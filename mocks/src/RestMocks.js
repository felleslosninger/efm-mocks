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
                    // need stream?
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
                    //} else if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/ConfirmDownloadedBasic\"") {
                    } else  {
                        res.send('halla')
                        //res.send(InitiateBrokerServiceBasic(req.body))
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
                    recieveFile(req, res)

                }
            },
            {
                path: '/dpe/*/messages/head',
                method: 'POST',
                responseFunction: (req, res) => {

                    let orgNum  = req.originalUrl.split('/')[2].match(/\d/g).join('');

                    if (global.dpeDB.get(orgNum)) {
                        res.set('BrokerProperties', JSON.stringify(
                            {
                                LockToken: "gerger",
                                SequenceNumber: 1,
                                MessageId: global.dpeDB.get(orgNum).convId
                            }))
                            .status(201).send(global.dpeDB.get(orgNum).sbd);
                    } else {
                        res.status(204).send();
                    }
                }
            }
        ]
    }
];

module.exports = mocks;