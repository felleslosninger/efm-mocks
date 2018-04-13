"use strict";

let soap = require('soap');
const fetch = require('node-fetch');

fetch('https://svarut.ks.no/tjenester/forsendelseservice/ForsendelsesServiceV9?wsdl')
    .then(res => res.text())
    .then(xml => {
        let service = {
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
        };

        const express = require('express');

        let app = express();
        //app.get('/*', (req, res) => res.send('Hello World!'))
        app.listen(8001, function() {
            soap.listen(app, '/ks', service, xml);
        });

    });
