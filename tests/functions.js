const uuidv1 = require('uuid/v1');
const request = require('superagent');

function getRequests(ipUrl, iterations, endpoint, file, sender, receiver, messageFunction){
    return new Promise((resolve, reject) => {

        let requests = [];
        let convIds = [];

        for(let i = 0; i < iterations; i++){
            let convId = uuidv1();
            convIds.push(convId);
            let body = messageFunction(file, sender, receiver, convId);

            requests.push(request
                .post(`${ipUrl}/${endpoint}`)
                .set('Content-Type', 'text/xml;charset=UTF-8')
                .set('Accept-Encoding', 'gzip,deflate')
                .send(body)
                .timeout({
                    response: 500000,
                    deadline: 600000,
                }));
            }
        resolve({ requests: requests, convIds: convIds }) ;
    });
}

function checkStatuses(convIds, ipUrl) {

    Promise.all(convIds.map((convId) => {
        console.log(`${ipUrl}/conversations/${convId}?useConversationId=true`);
        return request(`${ipUrl}/conversations/${convId}?useConversationId=true`);
    }))
        .then((res) => {

            let statuses = res.map((response) =>
                response.body.messageStatuses
                    .some((status) => status.status === 'SENDT'));

            // console.log('statuses', statuses);

            let allSent = statuses.every(status => status);

            if (allSent) {
                console.log("All sent!");
                console.timeEnd("Execution time");
            } else {
                console.log(`${statuses.filter((stat) => stat).length} sent, checking again...."`);
                setTimeout(() => checkStatuses(convIds, ipUrl), 1000);
            }
        });
}



function checkStatuses2(convIds, ipUrl) {
    request(`${ipUrl}/conversations`)
        .then((res) => {
            let statuses = res.body
                .filter(message => convIds.indexOf(message.conversationId) > -1)
                .map((response) =>
                response.messageStatuses
                    .some((status) => status.status === 'SENDT'));

            let allSent = statuses.every(status => status);

            if (allSent) {
                console.log("All sent!");
                console.timeEnd("Execution time");
            } else {
                console.log(`${statuses.filter((stat) => stat).length} sent, checking again...."`);
                setTimeout(() => checkStatuses2(convIds, ipUrl), 1000);
            }
        }).catch((err) => {
            console.log('fail');
            console.log(err);
            console.log('fail');
        });
}


function makeRequests(requests, convIds, ipUrl){

    console.log("Sending messages...");
    console.log("\n");

    Promise.all(requests)
        .then(res => {

            console.log("All messages sent ok.");
            console.log("Checking for sent statuses......");
            // checkStatuses(convIds, ipUrl);
            checkStatuses2(convIds, ipUrl);
        }, err => {
            if (err.timeout) {
                console.log("TIMEOUT!")
            }
            else {

                console.log(`Request failed. Status: ${err.status}`);
                console.log(`Response text:`);
                console.log(err.text);
                console.log("Something else went wrong.");
            }
        }).catch((err) => {
        console.log("err", err);
    });
}

module.exports = { makeRequests, getRequests };