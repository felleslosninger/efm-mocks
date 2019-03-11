const fs = require('fs');

const getEduMessage = require("./eduMessage").getEduMessage;
const args = require('yargs').argv;


const getRequests = require("./functions").getRequests;
const makeRequests = require("./functions").makeRequests;

let receiver = args.receiver || 991825827;
let sender = args.sender || 991825827;
let filePath = args.filePath || '/Users/adam.haeger/Projects/mocks/jMeter/liten.pdf';
let iterations = args.iterations || 10;
let ipUrl = args.ipUrl || 'http://localhost:9093';


console.log('receiver: ' + receiver);
console.log('sender: ' + sender);
console.log('filePath: ' + filePath);
console.log('iterations: ' + iterations);
console.log('ipUrl: ' + ipUrl);
console.log('\n');


console.time("Execution time");
let file = fs.readFileSync(filePath, { encoding: 'base64' });

getRequests(ipUrl, iterations, 'noarkExchange', file, sender, receiver, getEduMessage)
    .then(({requests, convIds}) => {
        makeRequests(requests, convIds, ipUrl)
});
