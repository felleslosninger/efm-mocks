const {recieveFile} = require("./modules/DPE/responses");
const { getRawBody } = require('./modules/helper');
const { PutMessage, retrieveforsendelsestatus } = require("./modules/DPF/soapResponses");
const retrieveForsendelseIdByEksternRefResponse = require("./modules/DPF/retrieveForsendelseIdByEksternRef").retrieveForsendelseIdByEksternRefResponse;
const { GetAvailableFilesBasic, InitiateBrokerServiceBasic, DownloadFileStreamedBasic, UploadFileStreamedBasic } = require("./modules/DPO/responses");
const getBasicWSDL = require("./modules/DPO/BasicWsdl").getBasicWSDL;
const getBasicStreamedWsdl = require("./modules/DPO/BasicStreamedWsdl").getBasicStreamedWsdl;
const { getBrokerServiceExternalBasicWSDL } = require("./modules/DPO/DPO");
const { receiveDPV }  = require("./modules/DPV/DPV");
const config = require('./config');
const chalk = require("chalk");
const hentForsendelsefil = require("./modules/DPF/soapResponses").hentForsendelsefil;
const hentNyeForsendelser = require("./modules/DPF/soapResponses").hentNyeForsendelser;
const sendForsendelseMedId = require("./modules/DPF/sendForsendelseMedId").sendForsendelseMedId;
const parseXml = require("./modules/DPO/responses").parseXml;

const mocks = [
    {
        name: 'DPF',
        routes: [
            {
                path: '/dpf*',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.send('ok');
                }
            },
            {
                path: '/svarinn/mottaker/hentNyeForsendelser',
                method: 'GET',
                responseFunction: (req, res) => {
                    hentNyeForsendelser(req, res);
                }
            },
            {
                path: "/tjenester/svarinn/forsendelse/:forsendelsesId",
                method: 'GET',
                responseFunction: (req, res) => {
                    hentForsendelsefil(req, res);
                }
            },
            {
                path: '/dpf*',
                method: 'POST',
                middleware: getRawBody,
                responseFunction: (req, res) => {
                    res.set('Content-type', 'application/soap+xml');
                    parseXml(req.rawBody, (err, parsed) => {
                        if (parsed.envelope.body[0]["sendforsendelsemedid"]){
                            sendForsendelseMedId(req, res, parsed);
                        } else if (parsed.envelope.body["0"].retrieveforsendelseidbyeksternref){
                            console.log("Checking for FIKS messages");
                            retrieveForsendelseIdByEksternRefResponse(req, res, parsed)
                        } else if(parsed.envelope.body["0"].retrieveforsendelsestatus) {
                            retrieveforsendelsestatus(req, res, parsed);
                        }
                    });
                }
            }
        ]
    },
    {
        name: 'Noark',
        routes: [
            {
                path: '/noark*',
                method: 'POST',
                responseFunction: (req, res) => {

                    res.set('Content-type', 'text/xml');

                    if (req.headers && req.headers.soapaction === "\"http://www.arkivverket.no/Noark/Exchange/IEDUImport/PutMessage\"") {
                        res.send(PutMessage());
                    } else {
                        res.send('ding!')
                    }
                }
            }
        ]
    },
    {
        name: "KS SvarInn",
        routes: [
            {
                path: '/svarinn/mottaker/hentForsendelsefil/:forsendelseid',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.download(`${__dirname}/testdata/${config.hentForsendelsefil}`)
                }
            },
            {
                path: '/svarinn/kvitterMottak/forsendelse/:forsendelseid',
                method: 'POST',
                responseFunction: (req, res) => {
                    res.send('Ok');
                }
            }
        ]
    },
    {
        name: 'DPV',
        routes: [
            {
                path: '/dpv/*',
                method: 'POST',
                middleware: getRawBody,
                responseFunction: receiveDPV
            }
        ]
    },
    {
        name: 'DPO',
        routes: [
            {
                path: '/dpo',
                method: 'GET',
                responseFunction: (req,res) => {
                    if (!req.query.part){
                        getBrokerServiceExternalBasicWSDL(req,res)
                    } else if (req.query.part === 'BrokerServiceExternalBasicStreamed.wsdl'){
                        console.log(chalk.blue('BrokerServiceExternalBasicStreamed.wsdl'));
                        res.set('Content-type', 'text/xml');
                        res.send(getBasicStreamedWsdl());
                    } else if (req.query.part === 'BrokerServiceExternalBasic.wsdl') {
                        console.log(chalk.blue('BrokerServiceExternalBasic.wsdl'));
                        res.set('Content-type', 'text/xml');
                        res.send(getBasicWSDL());
                    }
                }
            },
            {
                path: '/dpo/ServiceEngineExternal/BrokerServiceExternalBasic.svc',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.set('Content-type', 'text/xml');
                    res.send(getBasicWSDL());
                }
            },
            {
                path: '/dpo/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.set('Content-type', 'text/xml');
                    res.send(getBasicStreamedWsdl());
                }
            },
            {
                path: '/dpo/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc',
                method: 'GET',
                responseFunction: (req,res) => {
                    if (!req.query.part) {
                        getBrokerServiceExternalBasicWSDL(req,res)
                    } else if (req.query.part === 'BrokerServiceExternalBasicStreamed.wsdl'){
                        res.set('Content-type', 'text/xml');
                        res.send(getBasicStreamedWsdl());
                    } else if (req.query.part === 'BrokerServiceExternalBasic.wsdl') {
                        res.set('Content-type', 'text/xml');
                        res.send(getBasicWSDL());
                    }
                }
            },
            {
                path: '/dpo/ServiceEngineExternal/BrokerServiceExternalBasic.svc',
                method: 'GET',
                responseFunction: (req,res) => {
                    if (!req.query.part){
                        getBrokerServiceExternalBasicWSDL(req,res)
                    } else if (req.query.part === 'BrokerServiceExternalBasicStreamed.wsdl'){
                        res.set('Content-type', 'text/xml');
                        res.send(getBasicStreamedWsdl());
                    } else if (req.query.part === 'BrokerServiceExternalBasic.wsdl') {
                        res.set('Content-type', 'text/xml');
                        res.send(getBasicWSDL());
                    }
                }
            },
            {
                path: '/dpo/ServiceEngineExternal/BrokerServiceExternalBasic.svc',
                method: 'POST',
                middleware: getRawBody,
                responseFunction: (req,res) => {
                    res.header('Content-type', 'text/xml');
                    if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/GetAvailableFilesBasic\"") {
                        GetAvailableFilesBasic(req, res);
                    } else if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/InitiateBrokerServiceBasic\"") {
                        res.send(InitiateBrokerServiceBasic(req.body))
                    } else if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/ConfirmDownloadedBasic\"" ){

                        res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                                   <soapenv:Header/>
                                   <soapenv:Body>
                                      <ns:ConfirmDownloadedBasicResponse/>
                                   </soapenv:Body>
                                </soapenv:Envelope>`);
                    } else  {
                        res.send('halla');
                    }
                }
            },
            {
                path: '/dpo/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc',
                method: 'POST',
                middleware: (req, res, next) => {
                    if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/DownloadFileStreamedBasic\"") {
                        getRawBody(req, res, next)
                    } else if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/UploadFileStreamedBasic\""){
                        // getRawBody(req, res, next)
                        next();
                    } else {
                        console.log("stop");
                    }
                },
                responseFunction: (req, res) => {
                    res.header('Content-type', 'text/xml');
                    if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/DownloadFileStreamedBasic\"") {

                        console.log(chalk.blue('\n\nDownloadFileStreamedBasic\n\n'));

                        DownloadFileStreamedBasic(req, res);
                    } else if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/UploadFileStreamedBasic\""){
                        console.log(chalk.blue('\n\nUploadFileStreamedBasic\n\n'));
                        UploadFileStreamedBasic(req, res)
                    } else {
                        console.log("stop");
                    }
                }
            }
        ]
    },
    {
        name: "Logstash",
        routes: [
            {
                path: '/logstash/*',
                method: 'POST',
                responseFunction: (req, res) => {
                    res.send('Logged');
                }
            },
            {
                path: '/logstash/*',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.send('Logged');
                }
            }
        ]
    },
    {
        name: "DPE Service bus",
        routes: [
            {
                path: '/dpe/*/messages',
                method: 'POST',
                middleware: getRawBody,
                responseFunction: (req, res) => {
                    recieveFile(req, res);
                }
            },
            {
                /**
                 * The IP will send a delete request to remove a message it has received a receipt for.
                 * If this message returns 200, the message will receive the status "MOTTATT" in the IP.
                 * */
                path: '/dpe/*/messages/:conversationId/:lockToken',
                method: 'DELETE',
                responseFunction: (req, res) => {
                    // Extract the org number from the que name:
                    let orgNum = req.originalUrl.split('/')[2].match(/\d/g).join('');

                    // Check it there is any messages for this org number:
                    let messageQue = global.dpeDB.get(orgNum);
                    if (messageQue) {
                        // Check if we have a message with the conversation ID:
                        let message = messageQue.filter(message => message.convId === req.params.conversationId);
                        if (message.length > 0) {
                            // Remove the message from the que and return 200.
                            global.dpeDB.set(orgNum, messageQue.filter(message => message.convId !== req.params.conversationId));
                            res.status(200).send();
                        } else {
                            // If there is no messages with the given conversation ID, return 404.
                            res.status(204).send();
                        }
                    } else {
                        res.status(204).send();
                    }
                }
            },
            {
                path: '/dpe/*/messages/head',
                method: 'POST',
                /**
                 * The IP will poll this endpoint for messages.
                 * It simulates the Azure Service Bus.
                 * */
                responseFunction: (req, res) => {

                    // Extract the org number from the que name:
                    let orgNum = req.originalUrl.split('/')[2].match(/\d/g).join('');

                    // Check if there is any messages for this org num:
                    let dpeMessages = global.dpeDB.get(orgNum);

                    if (dpeMessages && dpeMessages.length > 0) {
                        res.set(
                            'BrokerProperties', JSON.stringify(
                            {
                                LockToken: "gerger",
                                SequenceNumber: 1,
                                MessageId: dpeMessages[0].convId
                            }))
                            .status(201)
                            .send(dpeMessages[0].sbd);
                    } else {
                        res.status(204).send();
                    }
                }
            }
        ]
    }
];

module.exports = mocks;