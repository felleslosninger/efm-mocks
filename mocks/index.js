const mocks = require('./src/mocks');
const restMocks = require('./src/RestMocks');
const soap = require('soap');
const express = require('express');
const fetch = require('node-fetch');
const xmlparser = require('express-xml-bodyparser');
const bodyParser = require('body-parser');
const uid = require("uid");
const morgan = require('morgan');
let db = require("./src/db").db;
let dpfDB= require("./src/modules/DPF/dpfDB").dpfDB;
const messageTable = require('./src/components/messageTable');
const rimraf = require('rimraf');
const fs = require('fs');

process.env.PORT = process.env.PORT || 8001;

let app = express();

app.use(bodyParser.json({limit: '100mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}))


app.use(express.static('static'));
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
            <link rel="stylesheet" href="styles.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
            
           
            <body>
                <nav class="navbar fixed-top flex-md-nowrap shadow elma-navbar p-0" >
                    <div class="container-fluid mr-auto">
                        <div class="navbar-header">
                            <a class="elma-logo" >
                                <img src="images/difi.jpg"/>
                                <div class="logo-text">Move Mocks</div>
                            </a>
                        </div>
                    </div>
                </nav>
                <div class="container main-container">
                    <div class="">
                        ${messageTable('DPF', dpfDB)}
                        
                        
                        ${messageTable('DPO', db)}
                        
                           </div>
                       </div>
                    </body>
                    <script src="script.js"></script>
            </html>
    `);
});

function deleteFiles(directory){
    return new Promise((resolve, reject) => {
        rimraf(`${directory}/*`, () => {
            console.log("Deleted files");
            fs.writeFile(`${directory}/.gitkeep`, "", (err) => {
                if(err) {
                    reject(err)
                }
                resolve("The file was saved!")
            });
        });
    });
}

app.post('/api/messages/DPF', (req, res) => {
    dpfDB = new Map();
    deleteFiles('./src/modules/DPF/uploads')
        .then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500)
        })
});

app.post('/api/messages/DPO', (req, res) => {
    db = new Map();
    deleteFiles('./src/modules/DPO/uploads')
        .then(() => {
            res.sendStatus(200);
        }).catch((err) => {
        console.log(err);
        res.sendStatus(500)
    })
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