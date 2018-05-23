const hentNyeForsendelser = require('./testdata/hentNyeForsendelser')
const config = require('./config');
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
                //path: '/ServiceEngineExternal/BrokerServiceExternalBasic.svc',
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

                    console.log(req.query.part);


                }
            },

            {
                path: '/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc',
                method: 'GET',
                responseFunction: (req,res) => {
                    //getBrokerServiceExternalBasicStreamedWSDL(req,res)
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
                    //getBrokerServiceExternalBasicStreamedWSDL(req,res)
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
                    //BrokerServiceExternalBasic(req,res)


                    console.log('WHATS THE SOAP ACTION?????');
                    console.log(req.headers);

                    if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/GetAvailableFilesBasic\"") {
                        res.header('Content-type', 'text/xml');
                        console.log('GetAvailableFilesBasic!!!! \n\n');
                        res.send(`<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
                                      <s:Body>
                                        <GetAvailableFilesBasicResponse xmlns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                                          <GetAvailableFilesBasicResult xmlns:a="http://schemas.altinn.no/services/ServiceEngine/Broker/2015/06" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"/>
                                        </GetAvailableFilesBasicResponse>
                                      </s:Body>
                                    </s:Envelope>`)
                    } else if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/InitiateBrokerServiceBasic\"") {

                        res.header('Content-type', 'text/xml');
                    res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                                   <soapenv:Header/>
                                   <soapenv:Body>
                                      <ns:InitiateBrokerServiceBasicResponse>
                                      </ns:InitiateBrokerServiceBasicResponse>
                                   </soapenv:Body>
                                </soapenv:Envelope>`)
                    }
                }
            },


            {
              path: '/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc',
                method: 'POST',
                responseFunction: (req, res) => {
                  console.log("\n\n BrokerServiceExternalBasicStreamed \n\n");
                    console.log('WHATS THE SOAP ACTION?????');
                    console.log(req.headers);
                    res.header('Content-type', 'text/xml');
                    if (req.headers.soapaction === "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/DownloadFileStreamedBasic\"") {
                        res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                                       <soapenv:Header/>
                                       <soapenv:Body>
                                          <ns:DownloadFileStreamedBasicResponse>
                                             <ns:DownloadFileStreamedBasicResult>cid:1353767272596</ns:DownloadFileStreamedBasicResult>
                                          </ns:DownloadFileStreamedBasicResponse>
                                       </soapenv:Body>
                                    </soapenv:Envelope>`);
                    } else {
                        res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                           <soapenv:Header/>
                           <soapenv:Body>
                              <ns:ReceiptExternalStreamedBE>
                                 <!--Optional:-->
                                 <ns:LastChanged>?</ns:LastChanged>
                                 <!--Optional:-->
                                 <ns:ParentReceiptId>?</ns:ParentReceiptId>
                                 <!--Optional:-->
                                 <ns:ReceiptHistory>?</ns:ReceiptHistory>
                                 <!--Optional:-->
                                 <ns:ReceiptId>?</ns:ReceiptId>
                                 <!--Optional:-->
                                 <ns:ReceiptStatusCode>?</ns:ReceiptStatusCode>
                                 <!--Optional:-->
                                 <ns:ReceiptText>?</ns:ReceiptText>
                                 <!--Optional:-->
                                 <ns:ReceiptTypeName>?</ns:ReceiptTypeName>
                              </ns:ReceiptExternalStreamedBE>
                           </soapenv:Body>
                        </soapenv:Envelope>`)
                    }
                }
            },



            {
                path: '/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/InitiateBrokerServiceBasic',
                method: 'POST',
                responseFunction: (req,res) => {
                    //BrokerServiceExternalBasic(req,res)
                    res.header('Content-type', 'text/xml');
                    res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                       <soapenv:Header/>
                       <soapenv:Body>
                          <ns:InitiateBrokerServiceBasicResponse>
                             <!--Optional:-->
                             <ns:InitiateBrokerServiceBasicResult>?</ns:InitiateBrokerServiceBasicResult>
                          </ns:InitiateBrokerServiceBasicResponse>
                       </soapenv:Body>
                    </soapenv:Envelope>`)
                }
            },
            ///ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc
            {
                path: '/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/UploadFileStreamedBasic',
                method: 'POST',
                responseFunction: (req,res) => {
                    res.header('Content-type', 'text/xml');
                    res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                           <soapenv:Header/>
                           <soapenv:Body>
                              <ns:ReceiptExternalStreamedBE>
                                 <!--Optional:-->
                                 <ns:LastChanged>?</ns:LastChanged>
                                 <!--Optional:-->
                                 <ns:ParentReceiptId>?</ns:ParentReceiptId>
                                 <!--Optional:-->
                                 <ns:ReceiptHistory>?</ns:ReceiptHistory>
                                 <!--Optional:-->
                                 <ns:ReceiptId>?</ns:ReceiptId>
                                 <!--Optional:-->
                                 <ns:ReceiptStatusCode>?</ns:ReceiptStatusCode>
                                 <!--Optional:-->
                                 <ns:ReceiptText>?</ns:ReceiptText>
                                 <!--Optional:-->
                                 <ns:ReceiptTypeName>?</ns:ReceiptTypeName>
                              </ns:ReceiptExternalStreamedBE>
                           </soapenv:Body>
                        </soapenv:Envelope>`)
                }
            },
            {
                path: '/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/GetAvailableFilesBasic',
                method: 'POST',
                responseFunction: (req,res) => {
                    res.header('Content-type', 'text/xml');
                    res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06" xmlns:ns1="http://schemas.altinn.no/services/ServiceEngine/Broker/2015/06">
                       <soapenv:Header/>
                       <soapenv:Body>
                          <ns:GetAvailableFilesBasicResponse>
                             <!--Optional:-->
                             <ns:GetAvailableFilesBasicResult>
                                <!--Zero or more repetitions:-->
                                <ns1:BrokerServiceAvailableFile>
                                   <!--Optional:-->
                                   <ns1:ExternalServiceCode>?</ns1:ExternalServiceCode>
                                   <!--Optional:-->
                                   <ns1:ExternalServiceEditionCode>?</ns1:ExternalServiceEditionCode>
                                   <!--Optional:-->
                                   <ns1:FileName>?</ns1:FileName>
                                   <!--Optional:-->
                                   <ns1:FileReference>?</ns1:FileReference>
                                   <!--Optional:-->
                                   <ns1:FileSize>?</ns1:FileSize>
                                   <!--Optional:-->
                                   <ns1:FileStatus>?</ns1:FileStatus>
                                   <!--Optional:-->
                                   <ns1:IsSftpDownloadOnly>?</ns1:IsSftpDownloadOnly>
                                   <!--Optional:-->
                                   <ns1:ReceiptID>?</ns1:ReceiptID>
                                   <!--Optional:-->
                                   <ns1:Reportee>?</ns1:Reportee>
                                   <!--Optional:-->
                                   <ns1:SendersReference>?</ns1:SendersReference>
                                   <!--Optional:-->
                                   <ns1:SentDate>?</ns1:SentDate>
                                </ns1:BrokerServiceAvailableFile>
                             </ns:GetAvailableFilesBasicResult>
                          </ns:GetAvailableFilesBasicResponse>
                       </soapenv:Body>
                    </soapenv:Envelope>`)
                }
            },
            {
                path: '/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/DownloadFileStreamedBasic',
                method: 'POST',
                responseFunction: (req,res) => {
                    res.header('Content-type', 'text/xml');
                    res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                       <soapenv:Header/>
                       <soapenv:Body>
                          <ns:DownloadFileStreamedBasicResponse>
                             <ns:DownloadFileStreamedBasicResult>cid:1353767272596</ns:DownloadFileStreamedBasicResult>
                          </ns:DownloadFileStreamedBasicResponse>
                       </soapenv:Body>
                    </soapenv:Envelope>`)
                }
            },

            // {
            //     path: '/dpo/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc',
            //     method: 'POST',
            //     responseFunction: (req,res) => {
            //         console.log('HELLO BrokerServiceExternalBasicStreamed');
            //         console.log(req.body);
            //         receiveDPO(req,res)
            //     }
            // }

            // {
            //     path: '/dpo/*',
            //     method: 'POST',
            //     responseFunction: receiveDPO
            // }
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