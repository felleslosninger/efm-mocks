const mocks = require('./src/mocks');
const restMocks = require('./src/RestMocks');
const soap = require('soap');
const express = require('express');
const fetch = require('node-fetch');
const xmlparser = require('express-xml-bodyparser');
const bodyParser = require('body-parser');
const uid = require("uid");
const morgan = require('morgan');
const db = require("./src/db").db;
let dpfDB= require("./src/modules/DPF/dpfDB").dpfDB;

// const dpoDB = require("./modudpfDB").dpfDB;

process.env.PORT = process.env.PORT || 8001;

let app = express();

app.use(morgan('combined'));


let restString = restMocks.map((item) => item.routes)
    .reduce((accumulator, current) => accumulator.concat(current))
    .map((item) => `${item.method} http://localhost:${process.env.PORT}${item.path}`);

let soapString = mocks
    .map((item) => `http://localhost:${process.env.PORT}${item.pathName}?wsdl`);

app.get('/', (req, res) => {
    res.send(`
            <html>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
                <body>
                
                <div class="container">
                <div class="">
                
                <h3>Received DPF messages</h3>
                                        
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">First</th>
                      <th scope="col">Last</th>
                      <th scope="col">Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                  
                  ${[...dpfDB].map(([key, value]) => {
                        return `<tr>Receiver: ${key}  ${value} </tr>`; } ).join('') }
                
                  </tbody>
                </table>
                
                
                
              <h3>Received DPO messages</h3>
                          
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Receiver</th>
                      <th scope="col">File reference</th>
                      <th scope="col">Receipt ID</th>
                      <th scope="col">#</th>
                    </tr>
                  </thead>
                  <tbody>
                  
                  ${[...db].map(([key, value]) => {
                        return `<tr> 
                                    <td>${key}</td>
                                    <td>${value.fileReference}</td>
                                    <td>${value.receiptId}</td>
                            `; } ).join('') }
                  </tbody>
                </table>
                
              
                       </div>
                       </div>
                </body>
            </html>
    `);
});

//
// <h3>Received DPO messages</h3>
// < ul
// className = "list-group" >
//
//     ${[...db].map(([key, value]) => `<li class="list-group-item">Receiver: ${key} < /li>` ).join('') }
//
// </ul>
//
// <
// h1 > MOVE
// Mocks < h1 >
// < h3 > Mocks
// :</h3>
// <
// ul
// className = "list-group" > ${ restString.map((url) => `<li class="list-group-item">${url} < /li>`).join('') }</u
// l >
// < h3 > WSDLs
// :</h3>
// <
// ul
// className = "list-group" > ${ soapString.map((url) => `<li class="list-group-item"><a href="${url}">${url}</a></li>`).join('') }</ul>
//

app.delete('/api/messages/dpf', (req, res) => {
    dpfDB = new Map();
    res.sendStatus(200)
});

app.delete('/api/messages/dpo', (req, res) => {
    dpfDB = new Map();
    res.sendStatus(200)
});

//File info: ${JSON.stringify(value, null, 2)}


// Set up REST mocks:
restMocks.forEach((mock) => {
    mock.routes
        .forEach((item) => {
            if (item.method === 'GET'){
                app.get(item.path, item.responseFunction)
            } else if (item.method === 'POST') {

                if (item.middleware){
                    app.post(item.path, item.middleware, item.responseFunction);
                } else {
                    app.post(item.path, item.responseFunction);
                }
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
                app.listen(process.env.PORT, () => {
                    mocks.forEach((mock) => {
                        soap.listen(app, mock.pathName, mock.service, mock.wsdl);
                    })
                });
        });
});

console.log(`Mocks running on http://localhost:${process.env.PORT}`);
console.log('REST mocks: \n');
console.log(restString.join('\n'));
console.log("\n");
console.log('SOAP mocks: \n');
console.log(soapString.join('\n'));


module.exports = app;