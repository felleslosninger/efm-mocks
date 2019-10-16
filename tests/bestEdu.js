const fs = require('fs');
const path = require('path');

const getEduMessage = require("./eduMessage").getEduMessage;
const args = require('yargs').argv;


const getRequests = require("./functions").getRequests;
const makeRequests = require("./functions").makeRequests;

let receiver = args.receiver || 810074582;
let sender = args.sender || 910075918;
let filePath = args.filePath || path.join('docs', 'testdoc.pdf');
let iterations = args.iterations || 1;
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
