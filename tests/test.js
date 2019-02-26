const fs = require('fs');
const request = require('superagent');
const getEduMessage = require("./eduMessage").getEduMessage;
const args = require('yargs').argv;

const uuidv1 = require('uuid/v1');

// let file = fs.readFileSync('/Users/adam.haeger/Downloads/Testfiler/25MB.docx', { encoding: 'base64' });
// let file = fs.readFileSync('/Users/adam.haeger/Downloads/Testfiler/72.pdf', { encoding: 'base64' });

// let file = fs.readFileSync('/Users/adam.haeger/Downloads/Testfiler/100.pdf', { encoding: 'base64' });

// let file = fs.readFileSync('/Users/adam.haeger/Downloads/Testfiler/200.pdf', { encoding: 'base64' });

// let file = fs.readFileSync('/Users/adam.haeger/Downloads/Testfiler/24.pdf', { encoding: 'base64' });

// let file = fs.readFileSync('/Users/adam.haeger/Downloads/Testfiler/liten.pdf', { encoding: 'base64' });

console.log('receiver: ' + args.receiver);
console.log('sender: ' + args.sender);
let receiver = args.receiver || 991825827;
let sender = args.sender || 991825827;
let filePath = args.filePath || '/Users/adam.haeger/Projects/mocks/jMeter/liten.pdf';
let iterations = args.iterations || 10;

let file = fs.readFileSync(filePath, { encoding: 'base64' });

let requests = [];
let convIds = [];

for(let i = 0; i < iterations; i++){
    let convId = uuidv1();
    convIds.push(convId);
    let body = getEduMessage(file, 991825827, 910229028, convId);

    requests.push(request
        .post('http://localhost:9093/noarkExchange')
        .set('Content-Type', 'text/xml;charset=UTF-8')
        .set('Accept-Encoding', 'gzip,deflate')
        .send(body)
        .timeout({
            response: 500000,
            deadline: 600000,
        }));
}

function checkStatuses() {

    Promise.all(convIds.map((convId) => {
        return request(`http://localhost:9093/conversations/${convId}?useConversationId=true`)
    })).then((res) => {
        console.log("stop");

        let allSent = res.map((response) =>
            response.body.messageStatuses
                .some((status) => status.status === 'SENT'))
                .every(status => status);

        if (allSent) {
            console.log("All sent!!");
        } else {

            setTimeout(checkStatuses, 1000)
        }

    })

}


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
