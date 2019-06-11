const { parseString } = require('xml2js');
const move = require("../helper").move;
const makeid = require("../helper").makeid;
const formidable = require('formidable');
const stripPrefix = require('xml2js').processors.stripPrefix;
const extract = require('extract-zip');
const fs = require('fs');
const uid = require("uid");
const { deleteFile, recursiveKeySearch, deleteDirectoryRecursive} = require("../helper");

function GetAvailableFilesBasic(req, res) {
    parseString(req.rawBody,
        {
            normalizeTags: true,
            tagNameProcessors: [ stripPrefix ]
        },
        (err, js) => {
            if(err) throw err;
            let reportee = js.envelope.body[0]['getavailablefilesbasic'][0]['searchparameters'][0]["reportee"][0];

            let files = global.dpoDB.get(reportee)

            let response = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
                              <s:Body>
                                <GetAvailableFilesBasicResponse xmlns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                                  <GetAvailableFilesBasicResult xmlns:a="http://schemas.altinn.no/services/ServiceEngine/Broker/2015/06" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
                                    ${ files ? files.map((file) =>
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

    if (xml) {
        parseXml(xml, (err, parsed) => {

            if (err) {
                console.log(err);
            } else {

                let reportee = parsed["envelope"]["body"][0]["downloadfilestreamedbasic"][0]["reportee"][0];

                let fileReference = parsed["envelope"]["body"][0]["downloadfilestreamedbasic"][0]["filereference"][0];

                let files = global.dpoDB.get(reportee);

                let file = files.filter((item) => {
                    return item.fileReference === fileReference;
                });

                let SNAPSHOT_BOUNDARY = `610be47c-8021-4e0d-82d9-362a1e2c6b58+id=3890`;

                function writeResponse() {
                    let buffer = new Buffer(0);
                    let data = '';
                    let readStream = fs.createReadStream(file[0].file);

                    readStream.on('error', function (err) {
                        if (err) {
                            console.log(err);
                            // handle error
                        }
                    });

                    readStream.on('data', function (chunk) {
                        data += chunk;
                        buffer = Buffer.concat([buffer, chunk]);
                    });

                    readStream.on('end', () => {

                        res.status(200);
                        res.set( {
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

                        res.write(buffer);
                        res.write('\r\n');
                        res.write(`--uuid:${SNAPSHOT_BOUNDARY}--`);
                        res.end();
                    });
                }

                writeResponse();
                // Remove the entry from memory and delete the files.
                files = files.filter((item) => {
                    return item.fileReference !== fileReference;
                });
                deleteFile(file[0].file);
                deleteDirectoryRecursive(`${__dirname}/uploads/${fileReference}`, true).then(() => {

                }).catch((err) => {
                    console.log(err);
                });
                console.log('stop');
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
                                        let messages = global.dpoDB.get(recipient);

                                        let receiptId = uid();

                                        let file = {
                                            file: filePath,
                                            fileReference: fileName,
                                            receiptId: receiptId,
                                            receiver: recipient
                                        };

                                        if (messages){
                                            messages.push(file);
                                        } else {
                                            global.dpoDB.set(recipient, [ file ]);
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