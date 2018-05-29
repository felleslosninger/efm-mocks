const uid = require("uid");
const recursiveKeySearch = require("../helper").recursiveKeySearch;
const getResponse = require('./DPVresponse');
const cache = require('../../cache');
const getReceiptResponse = require("../../test/ReceiptResponse").getReceiptResponse;
const moment = require("moment");
let url = require('url');
const chalk = require('chalk');

function receiveDPV(req, res) {

    if (req) {
        let soapAction = getSoapAction(req.body);
        if (soapAction === 'InsertCorrespondenceV2') {
            getDPVrequest(req, res)
        } else if (soapAction === 'GetCorrespondenceStatusDetailsV2') {
            getDPVreceipt(req, res)
        }

    }
}

function getDPVrequest(req, res) {

    let sendersRererence = recursiveKeySearch('externalshipmentreference', req.body)[0][0];

    console.log(chalk.blue('POST /dpv SOAP-action: InsertCorrespondenceV2 ') + ' Returning message for external shipment ref:' + chalk.yellow(sendersRererence));

    let reportee = recursiveKeySearch('ns2:reportee', req.body)[0][0];
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

    global.messageCount = global.messageCount + 1;

    let resXML = getResponse(sendersRererence, receiptId, reportee, created, expires);
    res.set('Content-Type', 'application/soap+xml');
    res.send(resXML);
}

function getDPVreceipt(req, res) {

    let elementName = 'ns3:sendersreference';

    if (process.env.NODE_ENV === 'test'){
        elementName = 'b:SendersReference';
    }

    let sendersRef = recursiveKeySearch(elementName, req.body)[0][0];
    let queItem = cache.get(sendersRef);
    console.log(chalk.blue('POST /dpv SOAP-action: GetCorrespondenceStatusDetailsV2 ') + ' Returning message for receipt ref:' + chalk.yellow(sendersRef));
    res.set('Content-Type', 'application/soap+xml');
    res.send(getReceiptResponse(sendersRef, queItem.reportee, queItem.receiptId, queItem.created, queItem.expires));
}


function getSoapAction(body) {
    let soapAction = recursiveKeySearch("wsa:action", body)[0][0];
    let q = url.parse(soapAction, true);
    let paths = q.pathname.split('/');
    return paths[paths.length -1 ];
}

module.exports = { receiveDPV, getSoapAction };