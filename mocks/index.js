const mocks = require('./src/mocks');
const restMocks = require('./src/RestMocks');
const soap = require('soap');
const express = require('express');
const fetch = require('node-fetch');
const xmlparser = require('express-xml-bodyparser');
const bodyParser = require('body-parser');
const uid = require("uid");
const morgan = require('morgan');
// let db = require("./src/db");
// let dpfDB= require("./src/modules/DPF/dpfDB").dpfDB;
const messageTable = require('./src/components/messageTable');
const rimraf = require('rimraf');
const fs = require('fs');
const https = require('https');

// var privateKey  = fs.readFileSync('./ssl3/910094548.key', 'utf8');
// var certificate = fs.readFileSync('./ssl3/910094548.cer', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

global.dpoDB = new Map();
global.dpfDB = new Map();
global.dpeDB = new Map();

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
                
                    ${messageTable('DPF', global.dpfDB)}
                    
                    ${messageTable('DPO', global.dpoDB)} 
                    
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
    global.dpfDB = new Map();
    deleteFiles('./src/modules/DPF/uploads')
        .then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500)
        })
});

app.post('/api/messages/DPO', (req, res) => {
    global.dpoDB = new Map();
    deleteFiles('./src/modules/DPO/uploads')
        .then(() => {
            res.sendStatus(200);
        }).catch((err) => {
        console.log(err);
        res.sendStatus(500)
    })
});

app.get('/api/messages/DPF', (req, res) => {
    res.send([...global.dpfDB].map(([key, value]) => value));
});

app.get('/api/messages/DPO', (req, res) => {

    res.send([...global.dpoDB].map(([key, value]) => value));
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

// let httpsApp = express();
//
// // httpsApp.get('*', function(req, res) {
// //
// //     res.redirect('http://' + req.client.servername + ':' + process.env.PORT + req.url);
// //
// //     // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
// //     // res.redirect('https://example.com' + req.url);
// // })
//
// httpsApp.use(function(req, res, next) {
//     if (req.url === '/dpe/nextbestqueue991825827data/messages/head') {
//         console.log();
//         res.redirect(307, 'http://' + req.client.servername + ':' + process.env.PORT + req.url);
//     }
//     next();
// });
//
//
// httpsApp.post('*', function(req, res) {
//
//     let url = 'http://' + req.client.servername + ':' + process.env.PORT + req.url;
//
//     console.log('stop');
//
//     res.redirect(307, 'http://' + req.client.servername + ':' + process.env.PORT + req.url);
//
//     // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
//     // res.redirect('https://example.com' + req.url);
// })

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

                // let httpsServer = https.createServer(credentials, httpsApp);
                //
                // httpsServer.listen(8443, () => {
                //     console.log('SSL server running on 8443');
                // });


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