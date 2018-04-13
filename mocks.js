const mocks = [
    {
        name: "AltInn",
        pathName: '/altinn',
        wsdlUrl: 'https://www.altinn.no/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc?wsdl',
        service: {
            BrokerServiceExternalBasicStreamedSF: {
                BasicHttpBinding_IBrokerServiceExternalBasicStreamed: {
                    UploadFileStreamedBasic : function(args) {
                        console.log('UploadFileStreamedBasic!', args);
                        return {
                            LastChanged : "LastChanged",
                            ParentReceiptId: "ParentReceiptId"
                        };
                    },
                    DownloadFileStreamedBasic : function(args) {
                        console.log('UploadFileStreamedBasic!', args);
                        let n = args.a * args.b;
                        return { mulres : n };
                    }
                }
            }
        }
    },
    {
        name: "KS",
        pathName: '/ks',
        wsdlUrl: 'https://svarut.ks.no/tjenester/forsendelseservice/ForsendelsesServiceV9?wsdl',
        service: {
            ForsendelsesServiceV9: {
                ForsendelsesServiceV9: {
                    sendForsendelseMedId : function(args) {
                        console.log('UploadFileStreamedBasic!', args);
                        return {
                            LastChanged : "LastChanged",
                            ParentReceiptId: "ParentReceiptId"
                        };
                    },
                    sendForsendelse : function(args) {
                        console.log('UploadFileStreamedBasic!', args);
                        return {
                            LastChanged : "LastChanged",
                            ParentReceiptId: "ParentReceiptId"
                        };
                    }
                }
            }
        }
    }
];

module.exports = mocks;
