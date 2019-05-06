const uuidv1 = require('uuid/v1');
const superagent = require('superagent');
const StandardBusinessDocument = require('./StandardBusinessDocument');
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

        let conversationId = res.body.standardBusinessDocumentHeader.businessScope.scope[0].instanceIdentifier;

        console.log(`Conversation created: ${conversationId}`);

        await sendFile( 'test4.pdf', conversationId);

        console.log(`Attachment uploaded: ${'test4.pdf'}`);

        await sendFile('arkivmelding.xml', conversationId);

        console.log(`arkivmelding.xml uploaded.`);

        await superagent
            .post( `${ipUrl}/${endpoint}/${conversationId}`)

    } catch(err) {
        // console.log(err);

        console.log(JSON.stringify(err, null, 2));

        // console.log(err.message);
        // console.log(err.status);
        // console.log(err.req.body.message);
    }
}

async function sendMessages(){

    // console.log('Sending message with process: \'administrasjon\'');
    // await sendLargeMessage(StandardBusinessDocument(991825827, 991825827, 'arkivmelding', 'arkivmelding', 'administrasjon', uuidv1(), uuidv1()))
    // console.log('Message with process: \'administrasjon\' sent OK');
    //
    // console.log('Sending message with process: \'helseSosialOgOmsorg\'');
    // await sendLargeMessage(StandardBusinessDocument(991825827, 991825827, 'arkivmelding', 'arkivmelding', 'helseSosialOgOmsorg', uuidv1(), uuidv1()))
    // console.log('Message with process: \'helseSosialOgOmsorg\' sent OK');
    //
    // console.log('Sending message with process: \'planByggOgGeodata\'');
    // await sendLargeMessage(StandardBusinessDocument(991825827, 991825827, 'arkivmelding', 'arkivmelding', 'planByggOgGeodata', uuidv1(), uuidv1()))
    // console.log('Message with process: \'planByggOgGeodata\' sent OK');


    console.log('Sending message with process: \'kulturIdrettOgFritid\'');
    await sendLargeMessage(StandardBusinessDocument(991825827, 991825827, 'arkivmelding', 'arkivmelding', 'kulturIdrettOgFritid', uuidv1(), uuidv1()))
    console.log('Message with process: \'kulturIdrettOgFritid\' sent OK');


}

sendMessages();
