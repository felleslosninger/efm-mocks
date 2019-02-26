const fs = require('fs');
const request = require('superagent');
const getEduMessage = require("./eduMessage").getEduMessage;
const args = require('yargs').argv;

const uuidv1 = require('uuid/v1');

let receiver = args.receiver || 910229028;
let sender = args.sender || 991825827;
let filePath = args.filePath || '/Users/adam.haeger/Projects/mocks/jMeter/liten.pdf';
let iterations = args.iterations || 100;
let ipUrl = args.ipUrl || 'http://localhost:9093';


console.log('receiver: ' + receiver);
console.log('sender: ' + sender);
console.log('filePath: ' + filePath);
console.log('iterations: ' + iterations);
console.log('ipUrl: ' + ipUrl);
console.log('\n');


console.time("Execution time");
let file = fs.readFileSync(filePath, { encoding: 'base64' });

let requests = [];
let convIds = [];

for(let i = 0; i < iterations; i++){
    let convId = uuidv1();
    convIds.push(convId);
    let body = getEduMessage(file, sender, receiver, convId);

    requests.push(request
        .post(`${ipUrl}/noarkExchange`)
        .set('Content-Type', 'text/xml;charset=UTF-8')
        .set('Accept-Encoding', 'gzip,deflate')
        .send(body)
        .timeout({
            response: 500000,
            deadline: 600000,
        }));
}

function checkStatuses() {

    Promise.all(convIds.map((convId) => request(`${ipUrl}/conversations/${convId}?useConversationId=true`)))
        .then((res) => {

        let statuses =  res.map((response) =>
            response.body.messageStatuses.some((status) => status.status === 'SENDT'));

        let allSent = statuses.every(status => status);

        if (allSent) {
            console.log("All sent!");
            console.timeEnd("Execution time");
        } else {
            console.log(`${statuses.filter((stat) => stat).length} sent, checking again...."`);
            setTimeout(checkStatuses, 1000)
        }

    })

}

console.log("Sending messages...");
console.log("\n");
Promise.all(requests)
    .then(res => {

        console.log("All messages sent ok.")
        console.log("Checking for sent statuses......")
        checkStatuses();
    }, err => {
        if (err.timeout) {
            console.log("TIMEOUT!")
        }
        else {

            console.log(`Request failed. Status: ${err.status}`);
            console.log(`Response text:`);
            console.log(err.text);
            console.log(err);
            console.log("Something else went wrong :(");
        }
    }).catch((err) => {
    console.log("err", err);
});
