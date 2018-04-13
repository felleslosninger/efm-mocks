let mocks = require('./mocks');
let soap = require('soap');
const express = require('express');
const fetch = require('node-fetch');

let app = express();

Promise.all(mocks.map((mock) => fetch(mock.wsdlUrl) ))
    .then((res) => {
        Promise.all(res.map((res) => res.text()))
            .then((wsdls) => {
                wsdls.forEach((wsdl, idx) => {
                    mocks[idx].wsdl = wsdl;
                });
                app.listen(8001, function() {
                    mocks.forEach((mock) => {
                        soap.listen(app, mock.pathName, mock.service, mock.wsdl);
                    })
                });

        });
});
