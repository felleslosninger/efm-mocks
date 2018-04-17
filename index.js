let mocks = require('./mocks');
let restMocks = require('./RestMocks');
let soap = require('soap');
const express = require('express');
const fetch = require('node-fetch');
const PORT = 8001;

let app = express();

// Set up REST mocks:
restMocks.forEach((mock) => {
    mock.routes
        .forEach((item) => {
            if (item.method === 'GET'){
                app.get(item.path, item.responseFunction)
            } else if (item.method === 'POST') {
                app.post(item.path, item.responseFunction)
            }
    });
});

// Set up SOAP mocks:

// Fetch the WSDLs:
Promise.all(mocks.map((mock) => fetch(mock.wsdlUrl) ))
    .then((res) => {
        // Map the WSDL to the mock:
        Promise.all(res.map((res) => res.text()))
            .then((wsdls) => {
                wsdls.forEach((wsdl, idx) => {
                    mocks[idx].wsdl = wsdl;
                });

                // Set up the listeners:
                app.listen(PORT, () => {
                    mocks.forEach((mock) => {
                        soap.listen(app, mock.pathName, mock.service, mock.wsdl);
                    })
                });
        });
});

console.log(`Mocks running on http://localhost:${PORT}`);

let restString = restMocks.map((item) => item.routes)
    .reduce((accumulator, current) => accumulator.concat(current))
    .map((item) => `${item.method} http://localhost:${PORT}${item.path}`).join('\n');

let soapString = mocks
    .map((item) => `http://localhost:${PORT}${item.pathName}?wsdl`).join('\n');

console.log('REST mocks: \n');
console.log(restString);
console.log("\n");
console.log('SOAP mocks: \n');
console.log(soapString);





