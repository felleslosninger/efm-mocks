const crypto = require("crypto");

const mocks = [
    // {
    //     name: "AltInn",
    //     pathName: '/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc',
    //     wsdlUrl: 'https://www.altinn.no/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc?wsdl',
    //     service: {
    //         BrokerServiceExternalBasicStreamedSF: {
    //             BasicHttpBinding_IBrokerServiceExternalBasicStreamed: {
    //                 UploadFileStreamedBasic : function(args) {
    //                     return {
    //                         LastChanged : "LastChanged",
    //                         ParentReceiptId: "ParentReceiptId"
    //                     };
    //                 },
    //                 DownloadFileStreamedBasic : function(args) {
    //                     return {
    //                         mockResponse : "This is a mock"
    //                     };
    //                 }
    //             }
    //         }
    //     }
    // },
    // {
    //     name: "AltInn",
    //     pathName: '/ServiceEngineExternal/BrokerServiceExternalBasic.svc',
    //     wsdlUrl: 'https://www.altinn.no/ServiceEngineExternal/BrokerServiceExternalBasic.svc?wsdl',
    //     service: {
    //         BrokerServiceExternalBasicSF: {
    //             BasicHttpBinding_IBrokerServiceExternalBasic: {
    //                 InitiateBrokerServiceBasic : function(args) {
    //                     return {
    //                         InitiateBrokerServiceBasicResult: crypto.randomBytes(16).toString("hex")
    //                     };
    //                 }
    //             }
    //         }
    //     }
    // },
    // {
    //     name: "AltInn DPV",
    //     pathName: '/ServiceEngineExternal/CorrespondenceAgencyExternal.svc',
    //     wsdlUrl: 'https://tt02.altinn.no/ServiceEngineExternal/CorrespondenceAgencyExternal.svc?wsdl',
    //     service: {
    //         CorrespondenceAgencyExternalSF: {
    //             CustomBinding_ICorrespondenceAgencyExternal: {
    //                 UploadFileStreamedBasic : function(args) {
    //                     return {
    //                         LastChanged : "LastChanged",
    //                         ParentReceiptId: "ParentReceiptId"
    //                     };
    //                 },
    //                 DownloadFileStreamedBasic : function(args) {
    //                     return {
    //                         mockResponse : "This is a mock"
    //                     };
    //                 }
    //             }
    //         }
    //     }
    // },
    {
        name: "KS",
        pathName: '/tjenester/forsendelseservice/ForsendelsesServiceV9',
        wsdlUrl: 'https://svarut.ks.no/tjenester/forsendelseservice/ForsendelsesServiceV9?wsdl',
        service: {
            ForsendelsesServiceV9: {
                ForsendelsesServiceV9: {
                    sendForsendelseMedId : function(args) {
                        return {
                            mockResponse : "This is a mock"
                        };
                    },
                    sendForsendelse : function(args) {
                        return {
                            mockResponse : "This is a mock"
                        };
                    }
                }
            }
        }
    },
    // {
    //     name: "DPO",
    //     pathName: '/tjenester/forsendelseservice/ForsendelsesServiceV9',
    //     wsdlUrl: 'https://raw.githubusercontent.com/difi/move-integrasjonspunkt/master/altinnexchange/wsdl/BrokerServiceExternalBasic.wsdl',
    //     service: {
    //
    //         //GetAvailableFilesBasic Returnere
    //
    //         ForsendelsesServiceV9: {
    //             ForsendelsesServiceV9: {
    //                 sendForsendelseMedId : function(args) {
    //                     return {
    //                         mockResponse : "This is a mock"
    //                     };
    //                 },
    //                 sendForsendelse : function(args) {
    //                     return {
    //                         mockResponse : "This is a mock"
    //                     };
    //                 }
    //             }
    //         }
    //     }
    // },
    // Simulerer et sak/arkiv system, nødvendig for å mocke DPO.
    // {
    //     name: "noark",
    //     pathName: '/noark',
    //     wsdlUrl: 'https://raw.githubusercontent.com/difi/move-integrasjonspunkt/master/noarkexchange/src/wsdl/noarkExchange.wsdl',
    //     service: {
    //         noarkExchange: {
    //             GetCanReceiveMessage : function(args) {
    //                 console.log('GetCanReceiveMessage');
    //                     return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.arkivverket.no/Noark/Exchange/types">' +
    //                         '  <soapenv:Header/>' +
    //                         '  <soapenv:Body>' +
    //                         '     <typ:PutMessageResponse>' +
    //                         '        <result type="OK">' +
    //                         '        </result>' +
    //                         '     </typ:PutMessageResponse>' +
    //                         '  </soapenv:Body>' +
    //                         '</soapenv:Envelope>';
    //                 },
    //             PutMessage : function(args) {
    //                 console.log('PutMessage');
    //                 return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.arkivverket.no/Noark/Exchange/types">' +
    //                     '  <soapenv:Header/>' +
    //                     '  <soapenv:Body>' +
    //                     '     <typ:PutMessageResponse>' +
    //                     '        <result type="OK">' +
    //                     '        </result>' +
    //                     '     </typ:PutMessageResponse>' +
    //                     '  </soapenv:Body>' +
    //                     '</soapenv:Envelope>';
    //                 }
    //         }
    //     }
    // }

    // ,
    // {
    //     name: "DPI",
    //     pathName: '/dpi/*',
    //     wsdlUrl: 'https://svarut.ks.no/tjenester/forsendelseservice/ForsendelsesServiceV9?wsdl',
    //     service: {
    //         ForsendelsesServiceV9: {
    //             ForsendelsesServiceV9: {
    //                 sendForsendelseMedId : function(args) {
    //                     return {
    //                         mockResponse : "This is a mock"
    //                     };
    //                 },
    //                 sendForsendelse : function(args) {
    //                     return {
    //                         mockResponse : "This is a mock"
    //                     };
    //                 }
    //             }
    //         }
    //     }
    // }
];

module.exports = mocks;
