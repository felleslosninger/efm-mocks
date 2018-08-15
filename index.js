const mocks = require('./src/mocks');
const restMocks = require('./src/RestMocks');
const soap = require('soap');
const express = require('express');
const fetch = require('node-fetch');
const xmlparser = require('express-xml-bodyparser');
const bodyParser = require('body-parser');
const uid = require("uid");



process.env.PORT = process.env.PORT || 8001;

const morgan = require('morgan');


let app = express();

app.use(morgan('combined'));

// app.use(xmlparser({
//     stripPrefix: true,
//     normalizeTags: true
// }));

app.use(bodyParser.raw())

// app.use(function(req, res, next) {
//
//     //var regexp = /^(text\/xml|application\/([\w!#\$%&\*`\-\.\^~]+\+)?xml)$/i;
//
//     var contentType = req.headers['content-type'] || ''
//         , mime = contentType.split(';')[0];
//     // console.log(contentType);
//     // console.log(mime);
//
//     // if (mime != 'application/soap+xml') {
//     //     return next();
//     // }
//
//     //var data = '';
//     //let data = new Buffer();
//     let data = [];
//     // req.setEncoding('utf8');
//     req.on('data', function(chunk) {
//
//         // console.log("NEW CHUNK");
//         //
//         // console.log(chunk);
//         // console.log("END OF CHUNK");
//         //data += chunk;
//         data.push(chunk)
//
//         // if (req.headers.soapaction) {
//         //     if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/UploadFileStreamedBasic\""){
//         //         let chunktString = chunk.toString()
//         //         console.log(chunktString);
//         //         //        let fs = require('fs');
//         //
//         //                 console.log(data);
//         //
//         //
//         //                 //let file = chunk.slice(2563, chunk.length - 45);
//         //
//         //                 //console.log(file);
//         //
//         //                 var fs = require('fs');
//         //
//         //                 var wstream = fs.createWriteStream('myOutput53.txt', { encoding: 'binary' });
//         //
//         //
//         //                 // creates random Buffer of 100 bytes
//         //
//         //                 wstream.write(chunk, 2563, chunk.length - 45);
//         //                 // create another Buffer of 100 bytes and write
//         //                 wstream.end();
//         //
//         //
//         //                 // fs.writeFile(`newfile7.txt`, file, function(err) {
//         //                 //     if(err) {
//         //                 //         console.log(err);
//         //                 //     } else {
//         //                 //         console.log("The file was saved!");
//         //                 //     }
//         //                 // });
//         //     }
//         // }
//
//     });
//
//
//     req.on('end', function() {
//
//         req.rawBody = Buffer.concat(data).toString();
//
//         //req.bodyBuffer = Buffer.concat(data);
//
//         // if (req.headers.soapaction) {
//         //     if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/UploadFileStreamedBasic\""){
//         //         let fs = require('fs');
//         //
//         //         console.log(data);
//         //
//         //         fs.writeFile(`${uid()}.txt`, Buffer.concat(data), 'binary', function(err) {
//         //             if(err) {
//         //                 console.log(err);
//         //             } else {
//         //                 console.log("The file was saved!");
//         //             }
//         //         });
//         //     }
//         // }
//
//
//
//         next();
//     });
// });

let restString = restMocks.map((item) => item.routes)
    .reduce((accumulator, current) => accumulator.concat(current))
    .map((item) => `${item.method} http://localhost:${process.env.PORT}${item.path}`);

let soapString = mocks
    .map((item) => `http://localhost:${process.env.PORT}${item.pathName}?wsdl`);

app.get('/', (req, res) => {
    res.send(`
            <html style="font-family: Comic Sans MS;">
                <body>
                    <h1>MOVE Mocks<h1>
                        <h3>REST Mocks:<h3>
                            <ul> ${ restString.map((url) => `<li>${url}</li>`).join('') }</ul>
                        <h3>SOAP Mocks:<h3>
                            <ul> ${ soapString.map((url) => `<li><a href="${url}">${url}</a></li>`).join('') }</ul>
                </body>
            </html>
    `);
});


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