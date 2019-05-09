const uid = require("uid");
const recursiveKeySearch = require("../helper").recursiveKeySearch;
const getResponse = require('./DPVresponse');
const cache = require('../../cache');
const getReceiptResponse = require("../../test/ReceiptResponse").getReceiptResponse;
const moment = require("moment");
const url = require('url');
const chalk = require('chalk');
const { parseString } = require('xml2js');
const stripPrefix = require('xml2js').processors.stripPrefix;


function receiveDPV(req, res) {

    parseString(req.rawBody,
        {
            normalizeTags: true,
            tagNameProcessors: [ stripPrefix ]
        },
        (err, js) => {
            if (js.envelope.body["0"].insertcorrespondencev2){
                getDPVrequest(req, res, js);
            } else {
                getDPVreceipt(req, res, js);
            }
    });
}

function getDPVrequest(req, res, parsedBody) {


    let sendersRererence = parsedBody.envelope.body["0"].insertcorrespondencev2["0"].externalshipmentreference["0"]
    console.log(chalk.blue('POST /dpv SOAP-action: InsertCorrespondenceV2 ') + ' Returning message for external shipment ref:' + chalk.yellow(sendersRererence));

    let reportee = parsedBody.envelope.body["0"].insertcorrespondencev2["0"].correspondence["0"].reportee.length;
    let receiptId = uid(36);

    let created = new moment().format();
    let expires = new moment().add(5, 'minutes').format();

    global.dpvDB.set(sendersRererence, {
        sendersReference: sendersRererence,
        reportee: reportee,
        created: created,
        receiptId: receiptId
    });

    let resXML = getResponse(sendersRererence, receiptId, reportee, created, expires);
    res.set('Content-Type', 'application/soap+xml');
    res.send(resXML);
}

function getDPVreceipt(req, res, parsedBody) {

    let sendersRef = parsedBody.envelope.body["0"].getcorrespondencestatusdetailsv2["0"].filtercriteria["0"].sendersreference["0"];
    let queItem = global.dpvDB.get(sendersRef);
    console.log(chalk.blue('POST /dpv SOAP-action: GetCorrespondenceStatusDetailsV2 ') + ' Returning message for receipt ref:' + chalk.yellow(sendersRef));
    res.set('Content-Type', 'application/soap+xml');

    if (queItem) {
        res.send(getReceiptResponse(sendersRef, queItem.reportee, queItem.receiptId, queItem.created, queItem.expires));
    } else {
        res.status(404).send(`No message with senders ref ${sendersRef} found.`);
    }
}


function getSoapAction(body) {
    let soapAction = recursiveKeySearch("action", body)[0][0];
    let q = url.parse(soapAction, true);
    let paths = q.pathname.split('/');
    return paths[paths.length -1 ];
}

module.exports = { receiveDPV, getSoapAction };