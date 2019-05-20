const uuidv1 = require('uuid/v1');
const superagent = require('superagent');
const { StandardBusinessDocument, dpiSbd } = require('./StandardBusinessDocument');
const path = require('path');
const fs = require('fs');
const request = require('request');

const ipUrl = 'http://localhost:9093';
const endpoint = 'api/messages/out';

// console.log(JSON.stringify(StandardBusinessDocument(991825827, 991825827, 'arkivmelding', 'arkivmelding', 'planByggOgGeodata', uuidv1(), uuidv1()), null, 2));

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
    try {
        let res = await superagent
            .post(`${ipUrl}/${endpoint}`)
            .send(sbd);

        console.log(JSON.stringify(res, null, 2));

        let conversationId = res.body.standardBusinessDocumentHeader.businessScope.scope[0].instanceIdentifier;

        console.log(`Conversation created: ${conversationId}`);

        await sendFile( 'test4.pdf', conversationId);

        console.log(`Attachment uploaded: ${'test4.pdf'}`);

        await sendFile('arkivmelding.xml', conversationId);

        console.log(`arkivmelding.xml uploaded.`);

        await superagent
            .post( `${ipUrl}/${endpoint}/${conversationId}`)
            .then((res) => {
                console.log('sendt OK');
            }).catch((err) => {
                console.log(err);
                console.log("fail");
            })

    } catch(err) {
        let error = JSON.parse(JSON.stringify(err));
        let text = JSON.parse(error.response.text);
        console.log(JSON.stringify(text, null, 2));
        throw Error(err);
    }
}

async function sendMessages(){

    // console.log('Sending message with process: \'administrasjon\'');
    try {
        await sendLargeMessage(StandardBusinessDocument(`991825827`, `991825827`, 'arkivmelding', 'arkivmelding', 'administrasjon', uuidv1(), uuidv1()))
    } catch(err) {
        console.log(err);
    }
    //
    // console.log('Message with process: \'administrasjon\' sent OK');
    //
    console.log('Sending message with process: \'helseSosialOgOmsorg\'');
    try {
        await sendLargeMessage(StandardBusinessDocument(991825827, 991825827, 'arkivmelding', 'arkivmelding', 'helseSosialOgOmsorg', uuidv1(), uuidv1()))
    } catch(e) {
        console.log('Message with process: \'helseSosialOgOmsorg\' failed.');
    }


    console.log('Sending message with process: \'planByggOgGeodata\'');
    // DPF melding:
    try {
        await sendLargeMessage(StandardBusinessDocument(991825827, 991825827, 'arkivmelding', 'arkivmelding', 'planByggOgGeodata', uuidv1(), uuidv1()))
    } catch (e) {
        console.log('Message with process: \'planByggOgGeodata\' failed.');
    }

    console.log('Sending message with process: \'kulturIdrettOgFritid\'');
    try {
        console.log(JSON.stringify(dpiSbd(`0192:991825827`, "06068700602", 'digital', 'digital', 'kulturIdrettOgFritid', uuidv1(), uuidv1()), null, 2));

        await sendLargeMessage(dpiSbd(`0192:991825827`, "06068700602", 'digital', 'digital', 'kulturIdrettOgFritid', uuidv1(), uuidv1()))
        console.log('Message with process: \'kulturIdrettOgFritid\' sent OK');
    } catch(err){
        console.log(err);
    }


}

sendMessages();
