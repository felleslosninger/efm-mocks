const xml2js = require('xml2js');
const uid = require("uid");
const recursiveKeySearch = require("../helper").recursiveKeySearch;
const getResponse = require('./DPVresponse');
const cache = require('../../cache');
const getReceiptResponse = require("../../test/ReceiptResponse").getReceiptResponse;
const moment = require("moment");
let builder = new xml2js.Builder();
let parseString = require('xml2js').parseString;

function receiveDPV(req, res) {
    if (req){
        let serviceCode = recursiveKeySearch('ns1:servicecode', req.body)[0][0];
        let sendersRererence  = recursiveKeySearch('ns:externalshipmentreference', req.body)[0][0];
        let reportee = recursiveKeySearch('ns1:reportee', req.body)[0][0];
        let receiptId = uid(36);

        let created = new moment().format();
        let expires = new moment().add(5, 'minutes').format();

        cache.set(sendersRererence, {
            sendersReference: sendersRererence,
            reportee: reportee,
            created: created,
            expires: expires,
            receiptId: receiptId
        });

        res.set('Content-Type', 'text/xml');
        res.send(getResponse(sendersRererence, receiptId, reportee, created, expires));
    }
}

function DPVreceipt(req, res){

    let elementName = 'ns1:sendersreference';

    if (process.env.NODE_ENV === 'test'){
        elementName = 'b:SendersReference';
    }

    let sendersRef = recursiveKeySearch(elementName, req.body)[0][0];

    let queItem = cache.get(sendersRef);

    res.set('Content-Type', 'text/xml');
    res.send(getReceiptResponse(sendersRef, queItem.reportee, queItem.created, queItem.expires));
}
module.exports = { receiveDPV, DPVreceipt };