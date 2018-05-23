const hentNyeForsendelser = require('./testdata/hentNyeForsendelser')
const config = require('./config');
const UploadFileStreamedBasic = require("./modules/DPO/responses").UploadFileStreamedBasic;
const DownloadFileStreamedBasic = require("./modules/DPO/responses").DownloadFileStreamedBasic;
const InitiateBrokerServiceBasic = require("./modules/DPO/responses").InitiateBrokerServiceBasic;
const GetAvailableFilesBasic = require("./modules/DPO/responses").GetAvailableFilesBasic;
const getBasicWSDL = require("./modules/DPO/BasicWsdl").getBasicWSDL;
const getBasicStreamedWsdl = require("./modules/DPO/BasicStreamedWsdl").getBasicStreamedWsdl;
const getBrokerServiceExternalBasicStreamedWSDL = require("./modules/DPO/DPO").getBrokerServiceExternalBasicStreamedWSDL;
const BrokerServiceExternalBasic = require("./modules/DPO/DPO").BrokerServiceExternalBasic;
const { receiveDPO, getBrokerServiceExternalBasicWSDL } = require("./modules/DPO/DPO");
const { receiveDPV }  = require("./modules/DPV/DPV");

const mocks = [
    // {
    //     name: 'DPO',
    //     routes: [
    //         {
    //             path: '/ServiceEngineExternal/BrokerServiceExternalBasic.svc',
    //                 method: 'POST',
    //                 responseFunction: (req,res) => {
    //                     getBrokerServiceExternalBasicWSDL(req,res);
    //             }
    //         },
    //         {
    //             path: '/ServiceEngineExternal/BrokerServiceExternalBasic.svc',
    //             method: 'POST',
    //             responseFunction: (req,res) => {
    //                 getBrokerServiceExternalBasicWSDL(req,res);
    //             }
    //         },
    //         // {
    //         //     path: '/*',
    //         //     method: 'GET',
    //         //     responseFunction: (req, res) => {
    //         //         console.log('GOT GET REQ:');
    //         //         let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    //         //         console.log(fullUrl);
    //         //     }
    //         // },
    //         // {
    //         //     path: '/*',
    //         //     method: 'POST',
    //         //     responseFunction: (req, res) => {
    //         //         console.log('GOT POST REQ:');
    //         //         let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    //         //         console.log(fullUrl);
    //         //     }
    //         // }
    //     ]
    // }


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
                path: '/svarinn/mottaker/hentNyeForsendelser',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.send(JSON.stringify(hentNyeForsendelser()));
                }
            },
            {
                path: '/svarinn/kvitterMottak/forsendelse/:forsendelseid',
                method: 'POST',
                responseFunction: (req, res) => {
                    console.log( req.params.forsendelseid);
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
                responseFunction: receiveDPV
            }
        ]
    },
    {
        name: 'DPO',
        routes: [
            {
                path: '/',
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
                path: '/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc',
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
                path: '/ServiceEngineExternal/BrokerServiceExternalBasic.svc',
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
                path: '/ServiceEngineExternal/BrokerServiceExternalBasic.svc',
                method: 'POST',
                responseFunction: (req,res) => {
                    res.header('Content-type', 'text/xml');
                    if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/GetAvailableFilesBasic\"") {
                        res.send(GetAvailableFilesBasic())
                    } else if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/InitiateBrokerServiceBasic\"") {
                        res.send(InitiateBrokerServiceBasic())
                    }
                }
            },
            {
              path: '/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc',
                method: 'POST',
                responseFunction: (req, res) => {
                    res.header('Content-type', 'text/xml');
                    if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/DownloadFileStreamedBasic\"") {
                        res.send(DownloadFileStreamedBasic());
                    } else if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/UploadFileStreamedBasic\""){
                        res.send(UploadFileStreamedBasic())
                    }
                }
            },
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
                path: '/dpe-service-bus/*',
                method: 'POST',
                responseFunction: (req, res) => {
                    res.send('Logged');
                }
            }
        ]
    }
];

module.exports = mocks;