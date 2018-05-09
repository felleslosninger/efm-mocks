process.env.NODE_ENV = 'test';
const getRequest = require('./DPVRequest');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
const xml2js = require('xml2js');
const assert = require("assert");
const recursiveKeySearch = require("../modules/helper").recursiveKeySearch;

const { receiptRequest } = require('./ReceiptRequest');

const parseString = require('xml2js').parseString;
chai.use(chaiHttp);

const sendersReference = "SendersReference_AZ12347";

const xml = getRequest(sendersReference);

let test;

describe('/POST dpv', () => {
    it('It should receive an xml message.', (done) => {
        chai.request(server)
            .post('/dpv/')
            .set('content-type', 'text/xml')
            .send(xml)
            .end((err, res) => {

                parseString(res.text, (err, parsed) => {
                    let ReferenceValue = recursiveKeySearch('b:ReferenceValue', parsed)[0][0];
                    assert(sendersReference, ReferenceValue);

                    test = parsed;

                    done();
                });
            });
    });
});

describe('/POST dpv-receipt', () => {
    const xml = receiptRequest(sendersReference);
    it('It should receive a receipt.', (done) => {
        chai.request(server)
            .post('/dpv-receipt/')
            .set('content-type', 'text/xml')
            .send(xml)
            .end((err, res) => {
                parseString(res.text, (err, parsed) => {
                    let ReferenceValue = recursiveKeySearch('ns1:sendersreference', parsed);
                    assert(sendersReference, ReferenceValue);
                    done();
                });
            });
    });
});