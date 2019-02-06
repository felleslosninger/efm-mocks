const { db } = require("../../db");
const { parseString } = require('xml2js');
const move = require("../helper").move;
const makeid = require("../helper").makeid;
const formidable = require('formidable');
const stripPrefix = require('xml2js').processors.stripPrefix;
const extract = require('extract-zip')
const fs = require('fs');
const uid = require("uid");
const recursiveKeySearch = require("../helper").recursiveKeySearch;

function GetAvailableFilesBasic(req, res) {
    parseString(req.rawBody,
        {
            normalizeTags: true,
            tagNameProcessors: [ stripPrefix ]
        },
        (err, js) => {
            if(err) throw err;
            let reportee = js.envelope.body[0]['getavailablefilesbasic'][0]['searchparameters'][0]["reportee"][0];

            let files = db.get(reportee)

            let response = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
                          <s:Body>
                            <GetAvailableFilesBasicResponse xmlns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                              <GetAvailableFilesBasicResult xmlns:a="http://schemas.altinn.no/services/ServiceEngine/Broker/2015/06" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
                                ${  files ? files.map((file) =>
                                    `<BrokerServiceAvailableFile>
                                        <FileReference>${file.fileReference}</FileReference>
                                        <ReceiptID>${file.receiptId}</ReceiptID>
                                    </BrokerServiceAvailableFile>`
                                    ).join('') : ''
                                }
                                </GetAvailableFilesBasicResult>
                            </GetAvailableFilesBasicResponse>
                          </s:Body>
                    </s:Envelope>`;
            res.send(response);
    });
}

parseXml = (xml, callback) => {
    parseString(xml, { normalizeTags: true, tagNameProcessors: [ stripPrefix ] }, (err, js) => {
        callback(err, js);
    });
};

function InitiateBrokerServiceBasic(body) {
    return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
               <soapenv:Header/>
               <soapenv:Body>
                  <ns:InitiateBrokerServiceBasicResponse>
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

    if (splitted[5].length > 0){
        xml = splitted[5];
    } else if(splitted[0].length > 0){
        xml = splitted[0];
    } else if(splitted[6].length > 0){
        xml = splitted[6];
    } else {
        xml = false;
    }


    if (xml) {

    let partID = "3de524c5-a743-4154-81ab-42c0d119c32c";

    parseXml(xml, (err, parsed) => {

        if (!parsed) {
            console.log("Stop!");
        } else {

            let reportee = parsed["envelope"]["body"][0]["downloadfilestreamedbasic"][0]["reportee"][0];

            let fileReference = parsed["envelope"]["body"][0]["downloadfilestreamedbasic"][0]["filereference"][0];

            let files = db.get(reportee);

            let file = files.filter((item) => {
                return item.fileReference === fileReference;
            });

            let SNAPSHOT_BOUNDARY = `--uuid:${partID}`;

            let CID = `f2ecf653-0262-4d3f-bfdc-38b7c98fca9f@example.jaxws.sun.com`

            function writeResponse() {
                let buffer = new Buffer(0);
                let data = '';
                let readStream = fs.createReadStream(file[0].file);

                readStream.on('error', function (err) {
                    if (err) {
                        // handle error
                    }
                });

                readStream.on('data', function (chunk) {
                    data += chunk;
                    buffer = Buffer.concat([buffer, chunk]);
                });

                readStream.on('end', () => {

                    res.writeHead(200, {
                        'Content-Type': `multipart/related;start=\"<rootpart*${partID}@example.jaxws.sun.com>\";type=\"application/xop+xml\";boundary=\"uuid:${partID}\";start-info=\"text/xml\"`,
                        "accept": "text/xml, multipart/related",
                        Connection: 'keep-alive'
                    });

                    res.write(SNAPSHOT_BOUNDARY + '\r\n');
                    res.write(`Content-Id: <rootpart*${partID}@example.jaxws.sun.com>` + '\r\n');
                    res.write(`Content-Type: application/xop+xml;charset=utf-8;type="text/xml"` + '\r\n');
                    res.write(`Content-Transfer-Encoding: binary` + '\r\n' + '\r\n');
                    res.write(` <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                                    <soapenv:Header/>
                                    <soapenv:Body>
                                        <ns:DownloadFileStreamedBasicResponse>
                                            <ns:DownloadFileStreamedBasicResult>cid:${CID}</ns:DownloadFileStreamedBasicResult>
                                        </ns:DownloadFileStreamedBasicResponse>
                                    </soapenv:Body>
                                </soapenv:Envelope>`+ '\r\n');

                    res.write(SNAPSHOT_BOUNDARY + '\r\n');
                    res.write(`content-id: <${CID}>` + '\r\n');
                    res.write('Content-Type: application/octet-stream' + '\r\n');
                    res.write('Content-Transfer-Encoding: binary' + '\r\n');
                    res.write('Content-Disposition: attachment; name="' + CID + '\r\n\r\n');
                    res.write(buffer);
                    res.write('\r\n')
                    res.write(`${SNAPSHOT_BOUNDARY}--`);
                    res.end()
                });
            }
                writeResponse();
        }
    });
    }
}

function UploadFileStreamedBasic(req, res) {

    const form = new formidable.IncomingForm();

    let fileName = makeid();

    let filePath = `${__dirname}/uploads/${fileName}.zip`;
    let outputPath = `${__dirname}/uploads/${fileName}`;

    form.parse(req, (err, fields, files) => {
        move(files[null].path, filePath, (err) => {

            extract(filePath, { dir: outputPath }, (err) => {
                if (!err) {
                    fs.readFile(`${outputPath}/recipients.xml`, (err, data) => {
                        parseString(data,
                            {
                                normalizeTags: true,
                                tagNameProcessors: [ stripPrefix ]
                            },
                            (err, result) => {
                                if (!err){
                                    let recipient = recursiveKeySearch('partynumber', result)[0][0];
                                        let messages = db.get(recipient);

                                        let receiptId = uid();

                                        let file = {
                                            xmlHeader: data,
                                            file: filePath,
                                            fileReference: fileName,
                                            receiptId: receiptId
                                        };

                                        if (messages){
                                            messages.push(file);
                                        } else {
                                            db.set(recipient, [ file ]);
                                        }

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
                                                         <ns:ReceiptId>${receiptId}</ns:ReceiptId>
                                                         <!--Optional:-->
                                                         <ns:ReceiptStatusCode>?</ns:ReceiptStatusCode>
                                                         <!--Optional:-->
                                                         <ns:ReceiptText>?</ns:ReceiptText>
                                                         <!--Optional:-->
                                                         <ns:ReceiptTypeName>?</ns:ReceiptTypeName>
                                                      </ns:ReceiptExternalStreamedBE>
                                                   </soapenv:Body>
                                                </soapenv:Envelope>`)
                                } else {
                                    console.log(err);
                                }

                        });
                    });
                } else {
                    console.log(err);
                }
            });
        });
    });
}

module.exports = {  parseXml, GetAvailableFilesBasic, InitiateBrokerServiceBasic, DownloadFileStreamedBasic, UploadFileStreamedBasic };