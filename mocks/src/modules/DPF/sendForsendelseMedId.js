const dpfDB = require("./dpfDB").dpfDB;
const makeid = require("../helper").makeid;
var fs = require("fs");
const AdmZip = require('adm-zip');

function sendForsendelseMedId(req, res, parsed) {

    let orgName = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].svarsendestil["0"].digitaladresse["0"].orgnr[0];

    let messageId = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelsesid["0"];

    let payload = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].dokumenter["0"].data["0"];

    let fileName = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].dokumenter["0"].filnavn["0"];

    let receiptId = makeid();

    let eksternRef =  parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].eksternref["0"];

    let forsendelsesId = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelsesid["0"];

    let messages = dpfDB.get(eksternRef);

    let mimeType = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].dokumenter["0"].mimetype;

    let title = parsed.envelope.body["0"].sendforsendelsemedid["0"].forsendelse["0"].tittel["0"];

    let filePath = `${__dirname}/uploads/${fileName}`;
    let zipFilePath = `${__dirname}/uploads/${messageId}.zip`;

    let buff = new Buffer(payload, 'base64');

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

    fs.writeFile(filePath, buff, (err) => {
        if(err) {
            return console.log(err);
        }

        let zip = new AdmZip();
        zip.addLocalFile(filePath);
        zip.writeZip(zipFilePath);

        let file = {
            orgNum: orgName,
            type: "DPF",
            file: payload,
            fileReference: fileName,
            receiptId: receiptId,
            conversationId: messageId,
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


        if (messages){
            messages.push(file);
        } else {
            dpfDB.set(eksternRef, [ file ]);
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