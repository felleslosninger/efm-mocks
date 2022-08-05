// const dpfDB = require("./dpfDB").dpfDB;
const makeid = require("../helper").makeid;
const formidable = require('formidable');
var fs = require("fs");
const AdmZip = require('adm-zip');

function sendForsendelseMedId(req, res, parsed) {

    const form = new formidable.IncomingForm();

    // TODO: fix, doesn't work
    let path = '';
    form.on('file', function (name, file) {
        path = file.path;
    });
    form.parse(req);

    let orgName = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].svarsendestil["0"].digitaladresse["0"].orgnr[0];

    let conversatoinId = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelsesid["0"];

    let fileName = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].dokumenter["0"].filnavn["0"];

    let receiptId = makeid();

    let eksternRef =  parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].eksternref["0"];

    let forsendelsesId = parsed.
        envelope.body["0"].sendforsendelsemedid["0"].forsendelsesid["0"];

    let mimeType = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].dokumenter["0"].mimetype;

    let title = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].tittel["0"];

    let filePath = `${__dirname}/uploads/${fileName}`;
    let zipFilePath = `${__dirname}/uploads/${conversatoinId}.zip`;

    let receiverCountry = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].mottaker["0"].postadresse["0"].land["0"];

    let receiverPostCode = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].mottaker["0"].postadresse["0"].postnr["0"];

    let receiverName = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].mottaker["0"].postadresse["0"].navn["0"];

    let receiverCity = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].mottaker["0"].postadresse["0"].poststed["0"];

    let receiverOrgNum = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].mottaker["0"].digitaladresse["0"].orgnr["0"];

    let senderOrgNum = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].svarsendestil["0"].digitaladresse["0"].orgnr["0"];

    let senderName = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].svarsendestil["0"].postadresse["0"].navn["0"];

    let senderCountry = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].svarsendestil["0"].postadresse["0"].land["0"];

    let senderPostCode = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].svarsendestil["0"].postadresse["0"].postnr["0"];

    let senderCity =  parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].svarsendestil["0"].postadresse["0"].poststed["0"];

    let logMessages = global.messageLog.get('dpf');

    logMessages.push({
        conversationId:conversatoinId,
        senderOrgNum: senderOrgNum,
        receiverOrgNum: receiverOrgNum
    });

    fs.writeFile(filePath, path, (err) => {
        if(err) {
            return console.log(err);
        }

        let zip = new AdmZip();
        zip.addLocalFile(filePath);
        zip.writeZip(zipFilePath);

        let file = {
            orgNum: orgName,
            type: "DPF",
            fileReference: fileName,
            receiptId: receiptId,
            conversationId: conversatoinId,
            x: forsendelsesId,
            eksternRef: eksternRef,
            filePath: filePath,
            fileName: fileName,
            zipFilePath: zipFilePath,
            mimeType: mimeType,
            title: title,
            receiverCountry: receiverCountry,
            receiverName: receiverName,
            receiverPostCode: receiverPostCode,
            receiverCity: receiverCity,
            receiverOrgNum: receiverOrgNum,
            senderOrgNum: senderOrgNum,
            senderName: senderName,
            senderCountry: senderCountry,
            senderPostCode: senderPostCode,
            senderCity: senderCity
        };


        if (global.dpfDB.get(receiverOrgNum)){
            global.dpfDB.get(receiverOrgNum).push(file);
        } else {
            global.dpfDB.set(receiverOrgNum, [ file ]);
        }

        res.send(`<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://www.ks.no/svarut/servicesV9">
                   <soap:Header/>
                   <soap:Body>
                      <ser:sendForsendelseMedIdResponse>
                         <!--Optional:-->
                         <return></return>
                         
                      </ser:sendForsendelseMedIdResponse>
                   </soap:Body>
                </soap:Envelope>`);
    });
}

module.exports = { sendForsendelseMedId };