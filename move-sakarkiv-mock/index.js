const {poll} = require("./src/nextMovePoller");
const { sendNextMoveMessage } = require("./src/nextMoveSender");
const xml2js = require('xml2js');
const { parseXml } = require("./src/utils");
const {pollMessage} = require("./src/messagePoller");
const mocks = require('./src/mocks');
const soap = require('soap');
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const morgan = require('morgan');
const bodyParser = require('body-parser');

process.env.PORT = process.env.PORT || 8002;
process.env.ORG_NUM = process.env.ORG_NUM || 991825827;
process.env.ORG_NAME = process.env.ORG_NAME || "DIREKTORATET FOR FORVALTNING OG IKT";
process.env.EMAIL = process.env.EMAIL || "idporten@difi.no";
process.env.IP_URL = process.env.IP_URL || "http://localhost:9093";

console.log(process.env);

global.nextMoveMessages = [];

let app = express();
app.use(morgan('combined'));

global.dpeDB = [];

poll();
// pollMessage();

app.use(express.static(`${__dirname}/client/build`));

app.post(`/api/send`, bodyParser.json({limit: '2000mb'}), (req, res, next) => {

    let url = `${process.env.IP_URL}/noarkExchange`;

    axios({
            url,
            method: 'POST',
            headers: { 'content-type': 'text/xml;charset=utf-8' },
            data: req.body.payload
    }).then(() => {
        res.send("OK");
    }).catch((error) => {
        console.log(error);
        // The IP returns XML so we need to parse the response:
        parseXml(error.response.data, (err, parsed) => {
            if (err) {
                res.status(error.response.status)
                    .send(error.response.statusText);
            } else {
                // IP will return 500 status code even though the payload returns a 404:
                if (parsed.envelope.body["0"].fault["0"].faultstring["0"].includes(404)){
                    res.status(404)
                        .send("The specified recipient does not support this message type. Please check that the org number you are trying to send to has a record in the SR MOCK.");
                } else {
                    res.status(error.response.status)
                        .send(error.response.statusText);
                }
            }

        })

    });
});

app.post(`/api/send/nextmove`, bodyParser.json({limit: '2000mb'}), (req, res, next) => {

    sendNextMoveMessage(req.body).then((conversationId) => {
        res.status(200).send(conversationId);
    }).catch((err) => {
        res.status(500).send();
    })

});

app.get(`/api/outgoing`, (req, res) => {
    axios({
        url: `${process.env.IP_URL}/api/conversations`,
        method: 'GET'
    }).then((response) => {
        console.log(response.data);
        res.send(response.data);
    }).catch((error) => {
        console.log(error);
        res.status(error.response.status)        // HTTP status 404: NotFound
            .send(error.response.statusText);
    });
});


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

app.post('/p360/*', (req, res) => {
    res.type('application/xml');
    res.sendFile(`${__dirname}/wsdl/p360.wsdl`);
});


global.dpfDB = new Map();

app.get(`/api/messages`, (req, res) => {
    res.send(JSON.stringify(
        [...global.dpfDB].map(
            // Removing the payload from the response because it is too big:
            (message) => [ message[0], { ...message[1], payload: null } ])
    ));
});

app.get(`/api/incoming`, (req, res) => {
    res.send(global.nextMoveMessages);
});

app.get(`/api/messages/payload/:conversationId`, (req, res) => {

    let payload = global.dpfDB.get(req.params.conversationId);

    if (payload) {
        res.send(payload);
    } else {
        res.status(404).send("Message not found.");
    }
});


app.get(`/api/dpe/messages`, (req, res) => {
    res.json(global.dpeDB);
});

app.post(`/p360`, getRawBody, (req, res) => {
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
                                 <result type="OK">
                                    <!--Zero or more repetitions:-->
                                    <message code="?">
                                       <!--Optional:-->
                                       <text>OK</text>
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

                    parsedPayload.melding.journpost["0"].dokument["0"].fil["0"].base64["0"] = 'File content removed';

                    parsed.envelope.body["0"].putmessagerequest["0"].payload["0"] = parsedPayload;

                    let builder = new xml2js.Builder();

                    let message = {
                        conversationId : conversationId,
                        payload: builder.buildObject(parsed),
                        type: 'bestedu9',
                        sender: {
                            name: parsed.envelope.body["0"].putmessagerequest["0"].envelope["0"].sender["0"].name["0"],
                            orgnr: parsed.envelope.body["0"].putmessagerequest["0"].envelope["0"].sender["0"].orgnr["0"]
                        },
                        receiver: {
                            name: parsed.envelope.body["0"].putmessagerequest["0"].envelope["0"].receiver["0"].name["0"],
                            orgnr: parsed.envelope.body["0"].putmessagerequest["0"].envelope["0"].receiver["0"].orgnr["0"]
                        },
                        file: filePath
                    };

                global.dpfDB.set(conversationId, message);

                res.type('application/xop+xml');
                res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.arkivverket.no/Noark/Exchange/types">
                           <soapenv:Header/>
                           <soapenv:Body>
                              <typ:PutMessageResponse>
                                 <!--Optional:-->
                                 <result type="OK">
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

app.get('/*', function (req, res) {
    res.sendFile(`${__dirname}/client/build/index.html`);
});