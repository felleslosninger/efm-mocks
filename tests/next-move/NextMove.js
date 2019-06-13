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
    .option('dpi [count]', 'Send the specified number of dpi messages.')
    .option('dpiprint [count]', 'Send the specified number of dpiprint messages.')
    .option('dpe [count]', 'Send the specified number of dpe messages.')
    .option('dpo [count]', 'Send the specified number of dpo messages.')
    .option('dpf [count]', 'Send the specified number of dpf messages.')
    .option('dpv [count]', 'Send the specified number of dpv messages.')
    .parse(process.argv);

let runAll = !program.dpiprint && !program.dpi && !program.dpe && !program.dpo && !program.dpf && !program.dpv;

if (program.dpiprint) console.log('  - %s messages dpi', program.dpiprint);
if (program.dpi) console.log(program.dpi);
if (program.dpe) console.log(program.dpe);
if (program.dpo) console.log(program.dpo);
if (program.dpf) console.log(program.dpf);
if (program.dpv) console.log(program.dpv);

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

            let sendFileRes = await sendFile( 'test4.pdf', conversationId);

            console.log(`Attachment uploaded: ${'test4.pdf'}`);

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

async function sendMessages(){

    if (program.dpo || runAll) {

        let requests = getRequests(program.dpo, StandardBusinessDocument, 910075918, 910075918, 'arkivmelding', 'arkivmelding', 'administrasjon');

        console.time('DPO Messages');

        Promise.all(requests).then((res) => {
            console.log(`Sent ${requests.length} DPO messages.`);
            console.timeEnd('DPO Messages');
        }).catch((err) => {
            console.log(err);
        });
    }

    if (program.dpv || runAll) {

        let requests = getRequests(program.dpv, StandardBusinessDocument, 991825827, 910075918, 'arkivmelding', 'arkivmelding', 'helseSosialOgOmsorg');

        console.time('DPV Messages');

        Promise.all(requests).then((res) => {
            console.log(`Sent ${requests.length} DPV messages.`);
            console.timeEnd('DPV Messages');
        }).catch((err) => {
            console.log(err);
        });
    }

    if (program.dpf || runAll) {

        let requests = getRequests(program.dpf, StandardBusinessDocument, 910075918, 910075918, 'arkivmelding', 'arkivmelding', 'planByggOgGeodata');

        console.time('DPF Messages');

        Promise.all(requests).then((res) => {
            console.timeEnd('DPF Messages');

            console.log(`Sent ${requests.length} DPF messages.`);
        }).catch((err) => {
            console.log(err);
        });
    }

    if (program.dpi || runAll) {

        let requests = getRequests(program.dpi, dpiSbd, `0192:910075918`, "06068700602", 'digital', 'digital');

        console.time('DPI Messages');

        Promise.all(requests).then((res) => {

            console.timeEnd('DPI Messages');

            console.log(`Sent ${requests.length} DPI messages.`);
        }).catch((err) => {
            console.log(err);
        });
    }

    if (program.dpe || runAll) {

        let requests = getRequests(program.dpe, dpeSbd, 910075918, 910076787,"innsynskrav");

        console.time('DPE Messages');

        Promise.all(requests).then((res) => {
            console.log(`Sent ${requests.length} DPE messages.`);

            console.timeEnd('DPE Messages');

        }).catch((err) => {
            console.log(err);
        });
    }

    if (program.dpiprint || runAll) {

        let requests = getRequests(program.dpiprint, dpiSbdFysisk, `0192:910075918`, "06068700602");

        console.time('DPI Print Messages');

        Promise.all(requests).then((res) => {

            console.timeEnd('DPI Print Messages');

            console.log(`Sent ${requests.length} DPI Print messages.`);
        }).catch((err) => {
            console.log(err);
        });
    }

}

sendMessages();