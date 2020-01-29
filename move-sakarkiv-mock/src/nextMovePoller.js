const superagent = require('superagent');

// global.nextMoveMessages = [];

function deleteMessage(messageId){
        return new Promise((resolve, reject) => {
            superagent.delete(`${process.env.IP_URL}/api/messages/in/${messageId}`)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err)
                })
    });
}

const INTERVAL = 500;

function poll(){

    process.env.IP_URL = process.env.IP_URL || "http://localhost:9093";

    superagent.get(`${process.env.IP_URL}/api/messages/in/peek/`)
        .then((res) => {

            if (res.body.standardBusinessDocumentHeader) {
                global.nextMoveMessages.push(res.body);
                let messageId = res.body.standardBusinessDocumentHeader.documentIdentification.instanceIdentifier;
                console.log(`Received message with ID: ${messageId}.`);
                let message = {
                    messageId : messageId,
                    type: 'nextMove',
                    payload: JSON.stringify(res.body),
                    sender: {
                        orgnr: res.body.standardBusinessDocumentHeader.sender[0].identifier.value,
                        name: ''
                    },
                    receiver: {
                        orgnr: res.body.standardBusinessDocumentHeader.receiver[0].identifier.value,
                        name: ''
                    }
                };

                global.dpfDB.set(messageId, message);

                deleteMessage(res.body.standardBusinessDocumentHeader.documentIdentification.instanceIdentifier)
                    .then((res) => {
                        console.log('message deleted OK');
                        setTimeout(poll, INTERVAL);
                    }).catch((err) => {
                        console.log(err);
                        console.log('Error when polling nextmove messages.');
                        setTimeout(poll, INTERVAL);
                });
            } else {
                setTimeout(poll, INTERVAL);
            }
        })
        .catch((err) => {
            console.log(err);
            console.log('Message polling failed');
            setTimeout(poll, INTERVAL);
        })

}

module.exports = { poll };