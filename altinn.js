"use strict";

let soap = require('soap');
const fetch = require('node-fetch');

fetch('https://www.altinn.no/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc?wsdl')
    .then(res => res.text())
    .then(xml => {
        let service = {
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
        };


        var xml2 = require('fs').readFileSync('wscalc1.wsdl', 'utf8');

        const express = require('express');

        let app = express();
        //app.get('/*', (req, res) => res.send('Hello World!'))
        app.listen(8001, function() {

            soap.listen(app, '/wscalc1', service, xml);

            soap.listen(app, '/wscalc2', service, xml2);

        });

});
