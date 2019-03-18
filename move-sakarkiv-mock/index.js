const {pollDPE} = require("./src/dpePoller");
const mocks = require('./src/mocks');
const soap = require('soap');
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const { parseString } = require('xml2js');
const path = require('path');
const stripPrefix = require('xml2js').processors.stripPrefix;
process.env.PORT = process.env.PORT || 8002;

let app = express();
app.use(morgan('combined'));

global.dpeDB = [];

pollDPE();

app.use(express.static(`${__dirname}/client/build`));

app.post('/api/send', bodyParser, (req, res, next) => {

    let url = 'http://localhost:9093/noarkExchange';
    axios({
            url,
            method: 'POST',
            headers: { 'content-type': 'text/xml' },
            data: req.body.payload
    }).then((response) => {
        res.send("OK");
    }).catch((error) => {
        res.status(error.response.status)        // HTTP status 404: NotFound
            .send(error.response.statusText);
    });
});

const parseXml = (xml, callback) => {
    parseString(xml, { normalizeTags: true, tagNameProcessors: [ stripPrefix ] }, (err, js) => {
        callback(err, js);
    });
};

const getRawBody = (req, res, next) => {

    let data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
};

app.get('/p360', (req, res) => {
    res.type('application/xml');
    res.sendFile(`${__dirname}/wsdl/p360.wsdl`);
});

let dpfDB = new Map();

app.get('/api/messages', (req, res) => {
    res.send(JSON.stringify([...dpfDB]));
});

app.get('/api/dpe/messages', (req, res) => {
    res.json(global.dpeDB);
});

app.post('/p360',
    getRawBody,
    (req, res) => {
    parseXml(req.rawBody, (err, parsed) => {
        if (err) throw err;

        let conversationId = parsed.envelope.body["0"].putmessagerequest["0"].envelope["0"].$.conversationId;

        parseXml(parsed.envelope.body["0"].putmessagerequest["0"].payload["0"], (err, parsedPayload) => {

            if (parsedPayload.appreceipt) {
                console.log("Sending app receipt.");
                res.type('application/xop+xml');
                res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.arkivverket.no/Noark/Exchange/types">
                           <soapenv:Header/>
                           <soapenv:Body>
                              <typ:PutMessageResponse>
                                 <!--Optional:-->
                                 <result type="?">
                                    <!--Zero or more repetitions:-->
                                    <message code="?">
                                       <!--Optional:-->
                                       <text>gurba</text>
                                    </message>
                                 </result>
                              </typ:PutMessageResponse>
                           </soapenv:Body>
                        </soapenv:Envelope>`);
            } else {

                let filePath = `./uploads/${conversationId}-${parsedPayload.melding.journpost["0"].dokument["0"].dbtittel["0"]}`;

                let buff = new Buffer(parsedPayload.melding.journpost["0"].dokument["0"].fil["0"].base64["0"], 'base64');

                fs.writeFile(filePath, buff, (err) => {
                    if(err) {
                        return console.log(err);
                    }

                    let message = {
                        conversationId : conversationId,
                        sender: {
                            name: parsed.envelope.body["0"].putmessagerequest["0"].envelope["0"].sender["0"].name["0"],
                            orgnr: parsed.envelope.body["0"].putmessagerequest["0"].envelope["0"].sender["0"].orgnr["0"],
                            ref: parsed.envelope.body["0"].putmessagerequest["0"].envelope["0"].sender["0"].ref["0"]
                        },
                        receiver: {
                            name: parsed.envelope.body["0"].putmessagerequest["0"].envelope["0"].receiver["0"].name["0"],
                            orgnr: parsed.envelope.body["0"].putmessagerequest["0"].envelope["0"].receiver["0"].orgnr["0"]
                        },
                        file: filePath
                    };

                dpfDB.set(conversationId, message);

                res.type('application/xop+xml');
                res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.arkivverket.no/Noark/Exchange/types">
                           <soapenv:Header/>
                           <soapenv:Body>
                              <typ:PutMessageResponse>
                                 <!--Optional:-->
                                 <result type="?">
                                    <!--Zero or more repetitions:-->
                                    <message code="?">
                                       <!--Optional:-->
                                       <text></text>
                                    </message>
                                 </result>
                              </typ:PutMessageResponse>
                           </soapenv:Body>
                        </soapenv:Envelope>`);
                });
            }
        });

    });
});

// app.get('/', (req, res) => {
//     res.send(`<html style="font-family: Comic Sans MS;">
//                 <body>
//                     <h1>MOVE Mocks<h1>
//                     <h3>SOAP Mocks:<h3>
//                     <ul> ${ soapString.map((url) => `<li><a href="${url}">${url}</a></li>`).join('') }</ul>
//                 </body>
//             </html>`);
// });

app.get('/*', function (req, res) {

    console.log(`${__dirname}/client/build`);

    res.sendFile(`${__dirname}/client/build/index.html`);
});



//
// // Fetch the WSDLs:
Promise.all(mocks.map((mock) => getData(mock.wsdlUrl, 'utf8')))
    .then((res) => {
        // Map the WSDL to the mock:
        mocks.forEach((wsdl, idx) => {
            mocks[idx].wsdl = res[idx];
        });

        // Set up the listeners:
        app.listen(process.env.PORT, () => {
            mocks.forEach((mock) => {
                soap.listen(app, mock.pathName, mock.service, mock.wsdl);
            })
        });
});
//
function getData(fileName, type) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, type, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}
