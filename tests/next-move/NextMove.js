const uuidv1 = require('uuid/v1');
const superagent = require('superagent');
const { StandardBusinessDocument, dpiSbd, dpeSbd, dpiSbdFysisk } = require('./StandardBusinessDocument');
const path = require('path');
const fs = require('fs');
const request = require('request');
const moment = require('moment');
const ipUrl = 'http://localhost:9093';
const endpoint = 'api/messages/out';

let runDpe = process.argv.includes('dpe');
let runDpi = process.argv.includes('dpi');
let runDpv = process.argv.includes('dpv');
let runDpf = process.argv.includes('dpf');
let runDpo = process.argv.includes('dpo');

let runDpiPrint = process.argv.includes('dpiprint');

// If no message types are specified, we run them all:
let runAll = !runDpe && !runDpi && !runDpv && !runDpf && !runDpo && !runDpiPrint;

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

            console.log(`Conversation created: ${conversationId}`);

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

async function sendMessages(){

    if (runDpo || runAll) {
        console.log('Sending DPO message.');
        try {
            let res = await sendLargeMessage(StandardBusinessDocument(`910075918`, `910075918`, 'arkivmelding', 'arkivmelding', 'administrasjon', uuidv1(), uuidv1()))
            if (res) {
                console.log("Sendt DPO message OK.");
            }
        } catch(err) {
            console.log(JSON.stringify(err, null, 2));
            console.log('DPO message failed.');
        }
    }

    if (runDpv || runAll) {
        console.log('Sending DPV message.');
        try {
            let res = await sendLargeMessage(StandardBusinessDocument(991825827, 910075918, 'arkivmelding', 'arkivmelding', 'helseSosialOgOmsorg', uuidv1(), uuidv1()))
            if (res) {
                console.log("Sendt DPV message OK.");
            }
        } catch(e) {
            console.log(JSON.stringify(err, null, 2));
            console.log('DPV message failed.');
        }
    }


    if (runDpf || runAll) {
        console.log('Sending DPF message.');
        // DPF melding:
        try {
            let res = await sendLargeMessage(StandardBusinessDocument(910075918, 910075918, 'arkivmelding', 'arkivmelding', 'planByggOgGeodata', uuidv1(), uuidv1()))
            if (res) {
                console.log("Sendt DPF message OK.");
            }
        } catch (e) {
            console.log(JSON.stringify(err, null, 2));
            console.log("DPF message failed.");
        }
    }


    if (runDpi || runAll) {
        console.log('Sending DPI message');
        // DPI Message
        try {
            let res = await sendLargeMessage(dpiSbd(`0192:910075918`, "06068700602", 'digital', 'digital', 'kulturIdrettOgFritid', uuidv1(), uuidv1()))
            if (res) {
                console.log('Sent DPI message OK.');
            }
        } catch(err){
            console.log(JSON.stringify(err, null, 2));
            console.log("DPI message failed.");
        }
    }


    if (runDpe || runAll) {
        console.log('Sending DPE message');
        // DPE message
        try {
            let res = await sendLargeMessage(
                dpeSbd(910076787, 910076787,"innsynskrav")
            );
            if (res){
                console.log("Sent DPE message successfully");
                console.log(res);
            }
        } catch(err){
            console.log(JSON.stringify(err, null, 2));
            console.log("DPE message failed");
        }
    }

    if (runDpiPrint || runAll) {
        console.log('Sending DPI print message.');
        // DPE message
        try {

            console.log('');
            console.log(JSON.stringify(dpiSbdFysisk(`0192:910075918`, "06068700602", 'digital', 'digital', 'kulturIdrettOgFritid', uuidv1(), uuidv1()), null, 2));

            let res = await sendLargeMessage(
                dpiSbdFysisk(`0192:910075918`, "06068700602", 'digital', 'digital', 'kulturIdrettOgFritid', uuidv1(), uuidv1())
            );
            if (res){
                console.log("Sent DPI print message successfully");
                console.log(res);
            }
        } catch(err){
            console.log(JSON.stringify(err, null, 2));
            console.log("DPI print message failed");
        }
    }

}

sendMessages();
