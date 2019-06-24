const superagent = require('superagent');

// global.nextMoveMessages = [];

function deleteMessage(conversationId){
        return new Promise((resolve, reject) => {
            superagent.delete(`${process.env.IP_URL}/api/messages/in/${conversationId}`)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err)
                })
    });
}

const INTERVAL = 500;

function poll(){

    process.env.IP_URL = process.env.IP_URL || "http://localhost:9094";

    superagent.get(`${process.env.IP_URL}/api/messages/in/peek/`)
        .then((res) => {

            if (res.body.standardBusinessDocumentHeader) {
                global.nextMoveMessages.push(res.body);
                let conversationId = res.body.standardBusinessDocumentHeader.businessScope.scope[0].instanceIdentifier;
                console.log(`Received message with ID: ${conversationId}.`);
                let message = {
                    conversationId : conversationId,
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

                global.dpfDB.set(conversationId, message);

                deleteMessage(res.body.standardBusinessDocumentHeader.businessScope.scope[0].instanceIdentifier)
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