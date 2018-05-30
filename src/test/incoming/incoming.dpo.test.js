process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../index');
let should = chai.should();
const xml2js = require('xml2js');
const assert = require("assert");
const { recursiveKeySearch }  = require("../../modules/helper");


const parseString = require('xml2js').parseString;
chai.use(chaiHttp);

// const xml = getRequest(sendersReference);

let test;

let brokerserviceMessage = `<?xml version='1.0' encoding='UTF-8'?><S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/"><S:Body><ns2:InitiateBrokerServiceBasic xmlns="http://schemas.altinn.no/services/ServiceEngine/Broker/2015/06" xmlns:ns2="http://www.altinn.no/services/ServiceEngine/Broker/2015/06" xmlns:ns3="http://www.altinn.no/services/2009/10" xmlns:ns4="http://www.altinn.no/services/common/fault/2009/10" xmlns:ns5="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:ns6="http://schemas.altinn.no/services/serviceEntity/2015/06"><ns2:brokerServiceInitiation><Manifest><ExternalServiceCode>4192</ExternalServiceCode><ExternalServiceEditionCode>270815</ExternalServiceEditionCode><ArrayOfFile><File><FileName>sbd.zip</FileName></File></ArrayOfFile><Reportee>991825827</Reportee><SendersReference>2395.847633830232</SendersReference></Manifest><RecipientList><Recipient><PartyNumber>991825827</PartyNumber></Recipient></RecipientList></ns2:brokerServiceInitiation></ns2:InitiateBrokerServiceBasic></S:Body></S:Envelope>`;


describe('/POST DPO', () => {
    it('Initiate brokerservice.', (done) => {
        chai.request(server)
            .post('/dpo/ServiceEngineExternal/BrokerServiceExternalBasic.svc')
            .set('content-type', 'text/xml')
            .set('soapaction', "\"http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasic/InitiateBrokerServiceBasic\"")
            .send(brokerserviceMessage)
            .end((err, res) => {

                console.log(res.text);
                console.log(err);

                done();

                // parseString(res.text, (err, parsed) => {
                //     let ReferenceValue = recursiveKeySearch('b:ReferenceValue', parsed)[0][0];
                //     assert(sendersReference, ReferenceValue);
                //
                //     test = parsed;
                //
                //     done();
                // });
            });
    });
});

// describe('/POST dpv-receipt', () => {
//     const xml = receiptRequest(sendersReference);
//     it('It should receive a receipt.', (done) => {
//         chai.request(server)
//             .post('/dpv-receipt/')
//             .set('content-type', 'text/xml')
//             .send(xml)
//             .end((err, res) => {
//                 parseString(res.text, (err, parsed) => {
//                     let ReferenceValue = recursiveKeySearch('ns1:sendersreference', parsed);
//                     assert(sendersReference, ReferenceValue);
//                     done();
//                 });
//             });
//     });
// });