const axios = require('axios');

let baseUrl = 'http://localhost:9093';

function downloadMessage(payload){

    return new Promise((resolve, reject) => {
        let url = `${baseUrl}/in/messages/pop?serviceIdentifier=${payload.serviceIdentifier}&conversationId=${payload.conversationId}`;
        axios({
            url,
            method: 'get'
        }).then((response) => {
            console.log('Checking message: ');
            console.log(payload.conversationId);
            resolve();

        }).catch((error) => {
            reject();
        });
    });
}

function pollDPE(){

    let url = `${baseUrl}/in/messages/peek`;
    axios({
        url,
        method: 'get'
    }).then((response) => {
        if (response.data.conversationId) {

            console.log('response.data', response.data);

            let existingMessage = global.dpeDB.find((message) => message.conversationId === response.data.conversationId);

            if (!existingMessage) {
                global.dpeDB.push(response.data)
                downloadMessage(response.data)
                    .then(() => {
                        setTimeout(() => {
                            pollDPE();
                        }, 1000)
                    }).catch((err) => {
                    console.log(err);
                });
            } else {
                setTimeout(() => {
                    pollDPE();
                }, 1000)
            }

        } else {
            setTimeout(() => {
                pollDPE()
            }, 1000)
        }

    }).catch((error) => {

    });
}

module.exports = { pollDPE };