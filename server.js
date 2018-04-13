/*jslint node: true */
"use strict";

var soap = require('soap');

var service = {
    ws: {
        calc: {
            sum : function(args) {
                console.log("!!!", args);
                var n = 1*args.a + 1*args.b;
                return { sumres : n };
            },

            multiply : function(args) {
                console.log("!!!", args);
                var n = args.a * args.b;
                return { mulres : n };
            }
        }
    }
};

var xml = require('fs').readFileSync('wscalc1.wsdl', 'utf8');

const express = require('express');

var app = express();
app.listen(8001, function(){
    soap.listen(app, '/wscalc1', service, xml);
});


