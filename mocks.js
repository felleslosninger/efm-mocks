const mocks = [
    {
        name: "AltInn",
        pathName: '/altinn',
        wsdlUrl: 'https://www.altinn.no/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc?wsdl',
        service: {
            BrokerServiceExternalBasicStreamedSF: {
                BasicHttpBinding_IBrokerServiceExternalBasicStreamed: {
                    UploadFileStreamedBasic : function(args) {
                        return {
                            LastChanged : "LastChanged",
                            ParentReceiptId: "ParentReceiptId"
                        };
                    },
                    DownloadFileStreamedBasic : function(args) {
                        return {
                            mockResponse : "This is a mock"
                        };
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
    }
];

module.exports = mocks;
