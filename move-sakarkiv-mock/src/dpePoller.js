const axios = require('axios');

let baseUrl = 'http://localhost:9093'

function downloadMessage(payload){

    return new Promise((resolve, reject) => {
        let url = `${baseUrl}/in/messages/pop?serviceIdentifier=${payload.serviceIdentifier}&conversationId=${payload.conversationId}`;
        axios({
            url,
            method: 'get'
        }).then((response) => {
            // console.log(response.data);
            console.log('got reponse  up here');
            console.log(payload.conversationId);

            // let dbInstance = global.dpeDB.get(payload.conversationId) || global.dpeDB.set(payload.conversationId, { messages: [] });
            // dbInstance.messages.push(payload)

            console.log('hey');

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
                pollDPE()
            }, 1000)
        }

    }).catch((error) => {

    });
}


module.exports = { pollDPE };
