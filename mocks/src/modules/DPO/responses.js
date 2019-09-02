const {parseString} = require('xml2js');
const move = require("../helper").move;
const makeid = require("../helper").makeid;
const formidable = require('formidable');
const stripPrefix = require('xml2js').processors.stripPrefix;
const extract = require('extract-zip');
const fs = require('fs');
const uid = require("uid");
const {deleteFile, recursiveKeySearch, deleteDirectoryRecursive} = require("../helper");

function GetAvailableFilesBasic(req, res) {
    parseString(req.rawBody,
        {
            normalizeTags: true,
            tagNameProcessors: [stripPrefix]
        },
        (err, js) => {
            if (err) {
                console.error(err);
            } else {
                let reportee = js.envelope.body[0]['getavailablefilesbasic'][0]['searchparameters'][0]["reportee"][0];

                let messages = Object.values(global.dpoDB)
                    .filter(p => p.recipient === reportee)
                    .filter(message => message.zip);

                let response = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                              <s:Body>
                                     <a:GetAvailableFilesBasicResponse xmlns:b="http://schemas.altinn.no/services/ServiceEngine/Broker/2015/06"
                                                xmlns:a="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
            <a:GetAvailableFilesBasicResult>
                 ${messages ? messages.map((message) =>
                    `<b:BrokerServiceAvailableFile>
                    <b:FileReference>${message.reference}</b:FileReference>
                    <b:ReceiptID>1</b:ReceiptID>
                </b:BrokerServiceAvailableFile>`
                ).join('') : ''
                }
                                    </a:GetAvailableFilesBasicResult>
                                </a:GetAvailableFilesBasicResponse>
                              </s:Body>
                        </s:Envelope>`;
                res.send(response);
            }
        });
}

parseXml = (xml, callback) => {
    parseString(xml, {normalizeTags: true, tagNameProcessors: [stripPrefix]}, (err, js) => {
        callback(err, js);
    });
};

function InitiateBrokerServiceBasic(body) {

    let recipient = body.match(/<PartyNumber>([^<]+)/)[1];
    let reference = uid();

    global.dpoDB[reference] = {
        reference: reference,
        recipient: recipient,
        zip: undefined
    };

    return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
               <soapenv:Header/>
               <soapenv:Body>
                  <ns:InitiateBrokerServiceBasicResponse>
                    <ns:InitiateBrokerServiceBasicResult>${reference}</ns:InitiateBrokerServiceBasicResult>
                  </ns:InitiateBrokerServiceBasicResponse>
               </soapenv:Body>
            </soapenv:Envelope>`;
}

function DownloadFileStreamedBasic(req, res) {
    let splitted = req.rawBody.split("\r\n");

    let xml;

    if (splitted.length > 1) {
        xml = splitted[5];
    } else {
        xml = splitted[0];
    }

    if (xml) {
        parseXml(xml, (err, parsed) => {

            if (err) {
                console.log(err);
            } else {
                let reference = parsed["envelope"]["body"][0]["downloadfilestreamedbasic"][0]["filereference"][0];

                console.log("DownloadFileStreamedBasic START", reference);

                let message = global.dpoDB[reference];
                delete global.dpoDB[reference];
                let SNAPSHOT_BOUNDARY = `610be47c-8021-4e0d-82d9-362a1e2c6b58+id=3890`;

                function writeResponse() {
                    res.status(200);
                    res.set({
                        'Cache-Control': `private`,
                        "Content-Type": `multipart/related; type="application/xop+xml";start="<http://tempuri.org/0>";boundary="uuid:610be47c-8021-4e0d-82d9-362a1e2c6b58+id=3890";start-info="text/xml"`,
                        'MIME-Version': '1.0',
                        'Server': 'Microsoft-IIS/8.5',
                        'Transfer-Encoding': 'chunked',
                        'X-AspNet-Version': '4.0.30319',
                        'X-Powered-By': 'ASP.NET',
                    });

                    let contentId = '636854854482615129';
                    res.write(`--uuid:${SNAPSHOT_BOUNDARY}` + '\r\n');
                    res.write(`Content-ID: <http://tempuri.org/0>` + '\r\n');
                    res.write(`Content-Transfer-Encoding: 8bit` + '\r\n');
                    res.write(`Content-Type: application/xop+xml;charset=utf-8;type="text/xml"` + '\r\n');

                    res.write('\r\n');

                    res.write(`<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><DownloadFileStreamedBasicResponse xmlns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06"><DownloadFileStreamedBasicResult><xop:Include href="cid:http://tempuri.org/1/636854854482615129" xmlns:xop="http://www.w3.org/2004/08/xop/include"/></DownloadFileStreamedBasicResult></DownloadFileStreamedBasicResponse></s:Body></s:Envelope>`)

                    res.write('\r\n');

                    res.write(`--uuid:${SNAPSHOT_BOUNDARY}` + '\r\n');

                    res.write(`Content-ID: <http://tempuri.org/1/${contentId}>` + '\r\n');
                    res.write(`Content-Transfer-Encoding: binary` + '\r\n');
                    res.write(`Content-Type: application/octet-stream` + '\r\n');

                    res.write('\r\n');

                    let readStream = fs.createReadStream(message.zip);

                    readStream.on('end', () => {
                        res.write('\r\n');
                        res.write(`--uuid:${SNAPSHOT_BOUNDARY}--`);
                        res.end();
                        deleteFile(message.zip);
                        console.log("DownloadFileStreamedBasic END", reference);
                    });

                    readStream.on('error', function (err) {
                        if (err) {
                            console.log(err);
                            // handle error
                        }
                    });

                    readStream.pipe(res);
                }

                writeResponse();
            }
        });
    }
}

function UploadFileStreamedBasic(req, res) {

    const form = new formidable.IncomingForm();

    let reference = 'something is wrong!';
    let fileName = makeid();
    let path = `${__dirname}/uploads/${fileName}.zip`;

    form.onPart = function (part) {
        console.log("Part type", part.mime);
        if (part.mime === 'application/octet-stream') {
            console.log("Writing to", path);
            let writeStream = fs.createWriteStream(path, {flags: 'w'});

            writeStream.on('error', function(err) {
                console.log("FILE ERROR", path, err);
            });

            part.on('data', function (data) {
                writeStream.write(data);
            });

            part.on('end', function () {
                writeStream.end();
            });
        } else {
            let xml = '';

            part.on('data', function (data) {
                xml += data;
            });

            part.on('end', function () {
                let regExpMatchArray = xml.match(/>([^<]+)<\/\w*:?Reference>/);

                if (regExpMatchArray && regExpMatchArray.length === 2) {
                    reference = regExpMatchArray[1];
                    console.log("Reference", reference);
                } else {
                    console.error("Missing Reference!");
                }
            });
        }
    };

    form.on('error', (err) => {
        console.error('Error', err);
    });

    form.on('end', () => {
        console.log("Sending receipt");
        res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                                                   <soapenv:Header/>
                                                   <soapenv:Body>
                                                      <ns:ReceiptExternalStreamedBE>
                                                         <!--Optional:-->
                                                         <ns:LastChanged>?</ns:LastChanged>
                                                         <!--Optional:-->
                                                         <ns:ParentReceiptId>?</ns:ParentReceiptId>
                                                         <!--Optional:-->
                                                         <ns:ReceiptHistory>?</ns:ReceiptHistory>
                                                         <!--Optional:-->
                                                         <ns:ReceiptId>${reference}</ns:ReceiptId>
                                                         <!--Optional:-->
                                                         <ns:ReceiptStatusCode>?</ns:ReceiptStatusCode>
                                                         <!--Optional:-->
                                                         <ns:ReceiptText>?</ns:ReceiptText>
                                                         <!--Optional:-->
                                                         <ns:ReceiptTypeName>?</ns:ReceiptTypeName>
                                                      </ns:ReceiptExternalStreamedBE>
                                                   </soapenv:Body>
                                                </soapenv:Envelope>`);
        res.end();

        console.log("UploadFileStreamedBasic UPLOADED", reference);

        let message = global.dpoDB[reference];
        message.zip = path;

        let logMessages = global.messageLog.get('dpo');

        logMessages.push({
            fileReference: reference,
            receiptId: reference,
            receiver: message.recipient
        });
        console.log("End");
    });

    form.parse(req);
}

module.exports = {
    parseXml,
    GetAvailableFilesBasic,
    InitiateBrokerServiceBasic,
    DownloadFileStreamedBasic,
    UploadFileStreamedBasic
};