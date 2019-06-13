const superagent = require('superagent');
const { StandardBusinessDocument, dpiSbd, dpeSbd, dpiSbdFysisk } = require('./StandardBusinessDocument');
const path = require('path');
const fs = require('fs');
const request = require('request');
const ipUrl = 'http://localhost:9093';
const endpoint = 'api/messages/out';
const program = require('commander');

program
    .version('0.1.0')
    .option('-s --filesize <size>', 'Size of files to send. User either kb or mb, eg: 200kb or 5mb.',  '200kb')
    .option('dpi [count]', 'Send the specified number of dpi messages.')
    .option('dpiprint [count]', 'Send the specified number of dpiprint messages.')
    .option('dpe [count]', 'Send the specified number of dpe messages.')
    .option('dpo [count]', 'Send the specified number of dpo messages.')
    .option('dpf [count]', 'Send the specified number of dpf messages.')
    .option('dpv [count]', 'Send the specified number of dpv messages.')
    .parse(process.argv);

let fileSize;
let fileName = 'test.pdf';

if (program.filesize.includes("kb")) {
    let kbCount = parseInt(program.filesize) / 1000;
    fileSize = Math.round(1024*1024*kbCount);
} else if(program.filesize.includes("mb")) {
    let mbCount = parseInt(program.filesize);
    fileSize = 1024*1024*mbCount;
} else {
    console.log("You have entered an invalid value for file size.");
    console.log("Please enter like 200kb or 5mb.");
    process.exit(1);
}

let runAll = !program.dpiprint && !program.dpi && !program.dpe && !program.dpo && !program.dpf && !program.dpv;


function sendFile(fileName, conversationId){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, fileName))
            .pipe(request({
                url: `${ipUrl}/${endpoint}/${conversationId}?title=${fileName}`,
                method: 'PUT',
                headers: {
                    'content-disposition': 'attachment; filename=' + fileName,
                    'content-type' : 'application/json'
                },
                encoding: null
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response)
                }
            }))
    })
}

async function sendLargeMessage(sbd){

    return new Promise(async (resolve, reject) => {
        try {
            let res = await superagent
                .post(`${ipUrl}/${endpoint}`)
                .send(sbd);

            let conversationId = res.body.standardBusinessDocumentHeader.businessScope.scope[0].instanceIdentifier;

            console.log(`Conversation created: http://localhost:9093/api/conversations/conversationId/${conversationId}`);

            let sendFileRes = await sendFile( fileName, conversationId);

            console.log(`Attachment uploaded: ${fileName}`);

            let sendArchiveRes = await sendFile('arkivmelding.xml', conversationId);

            console.log(`arkivmelding.xml uploaded.`);

            let sendRes = await superagent
                .post( `${ipUrl}/${endpoint}/${conversationId}`)
            if (sendRes) resolve(conversationId);

        } catch(err) {
            reject(err);
        }
    })
}

function getRequests(serviceIdentifier, sbdFunction, ...sbdParameters){
    let requests = [];
    let requestNum = serviceIdentifier && serviceIdentifier.length ? parseInt(serviceIdentifier) : 1;

    for (let i = 0; i < requestNum; i++){
        requests.push(sendLargeMessage(sbdFunction(...sbdParameters)))
    }
    return requests;
}


function sendMessagesForServiceIdentifier(serviceIdentifier, requests){

    console.time(serviceIdentifier);

    return new Promise((resolve, reject) => {
        Promise.all(requests).then((res) => {
            console.log(`Sent ${requests.length} ${serviceIdentifier} messages.`);
            console.timeEnd(serviceIdentifier);
            resolve()
        }).catch((err) => {
            console.log(err);
            reject()
        });
    })
}

async function sendAllMessages(){

    return new Promise(async (resolve, reject) => {

        if (program.dpo || runAll) {
            await sendMessagesForServiceIdentifier("DPO", getRequests(program.dpo, StandardBusinessDocument, 910075918, 910075918, 'arkivmelding', 'arkivmelding', 'administrasjon'))
        }

        if (program.dpv || runAll) {
            await sendMessagesForServiceIdentifier("DPV", getRequests(program.dpv, StandardBusinessDocument, 991825827, 910075918, 'arkivmelding', 'arkivmelding', 'helseSosialOgOmsorg'));
        }

        if (program.dpf || runAll) {
            await sendMessagesForServiceIdentifier("DPF", getRequests(program.dpf, StandardBusinessDocument, 910075918, 910075918, 'arkivmelding', 'arkivmelding', 'planByggOgGeodata'));
        }

        if (program.dpi || runAll) {
            await sendMessagesForServiceIdentifier("DPI", getRequests(program.dpi, dpiSbd, `0192:910075918`, "06068700602", 'digital', 'digital'));
        }

        if (program.dpe || runAll) {
            await sendMessagesForServiceIdentifier("DPE", getRequests(program.dpe, dpeSbd, 910075918, 910076787,"innsynskrav"));
        }

        if (program.dpiprint || runAll) {
            await sendMessagesForServiceIdentifier("DPI Print", getRequests(program.dpiprint, dpiSbdFysisk, `0192:910075918`, "06068700602"));
        }
        resolve();
    })
}


fs.writeFile(fileName, Buffer.alloc(fileSize), (err) => {
    if (err) {
        console.log(err);
    } else {

        console.time("totalTime");

        sendAllMessages().then(() => {

            console.timeEnd("totalTime");

            fs.unlink(fileName, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Messages sent, file deleted");
                }
            })
        }).catch((err) => {
            console.log(err);
        });

    }
});