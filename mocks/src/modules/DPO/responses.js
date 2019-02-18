// const db = require("../../db");
const { parseString } = require('xml2js');
const move = require("../helper").move;
const makeid = require("../helper").makeid;
const formidable = require('formidable');
const stripPrefix = require('xml2js').processors.stripPrefix;
const extract = require('extract-zip');
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

            let files = global.dpoDB.get(reportee)

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

            let files = global.dpoDB.get(reportee);

            let file = files.filter((item) => {
                return item.fileReference === fileReference;
            });

            let SNAPSHOT_BOUNDARY = `610be47c-8021-4e0d-82d9-362a1e2c6b58+id=3890`;

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
                    //
                    //
                    let contentId = '636854854482615129';



                    // console.log(`Cache-Control: private` + '\r');
                    // console.log(`Content-Type: multipart/related; type="application/xop+xml";start="<http://tempuri.org/0>";boundary="uuid:610be47c-8021-4e0d-82d9-362a1e2c6b58+id=3890";start-info="text/xml"` + '\r');
                    // console.log(`Date: Mon, 11 Feb 2019 11:37:28 GMT` + '\r');
                    // console.log(`MIME-Version: 1.0` + '\r');
                    // console.log(`Server: Microsoft-IIS/8.5` + '\r');
                    // console.log(`Transfer-Encoding: chunked` + '\r');
                    // console.log(`X-AspNet-Version: 4.0.30319` + '\r');
                    // console.log(`X-Powered-By: ASP.NET` + '\r');
                    // console.log('\r');
                    //
                    // console.log(`--uuid:${SNAPSHOT_BOUNDARY}` + '\r');
                    // console.log(`Content-ID: <http://tempuri.org/0>` + '\r');
                    // console.log(`Content-Transfer-Encoding: 8bit` + '\r');
                    // console.log(`Content-Type: application/xop+xml;charset=utf-8;type="text/xml"` + '\r');
                    //
                    // console.log('\r');
                    //
                    // console.log(`<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><DownloadFileStreamedBasicResponse xmlns="http://www.altinn.no/servicesServiceEngineBroker/2015/06"><DownloadFileStreamedBasicResult>
                    //             <xop:Include href="cid:http://tempuri.org/1/${contentId}" xmlns:xop="http://www.w3.org/2004/08/xopinclude"/></DownloadFileStreamedBasicResult></DownloadFileStreamedBasicResponse></s:Body></s:Envelope>`)
                    //
                    // console.log('\r');
                    //
                    // console.log(`--uuid:${SNAPSHOT_BOUNDARY}` + '\r');
                    //
                    // console.log(`Content-ID: <http://tempuri.org/1/${contentId}>` + '\r');
                    // console.log(`Content-Transfer-Encoding: binary` + '\r');
                    // console.log(`Content-Type: application/octet-stream` + '\r');
                    //
                    // console.log('\r');
                    //
                    // console.log(buffer.toString('utf8'));
                    //
                    // console.log(`--uuid:${SNAPSHOT_BOUNDARY}--`);


                    // res.write(`null: HTTP/1.1 200 OK` + '\r');
                    // res.write(`Cache-Control: private` + '\r');
                    // res.write(`Content-Type: multipart/related; type="application/xop+xml";start="<http://tempuri.org/0>";boundary="uuid:610be47c-8021-4e0d-82d9-362a1e2c6b58+id=3890";start-info="text/xml"` + '\r');
                    // res.write(`Date: Mon, 11 Feb 2019 11:37:28 GMT` + '\r');
                    // res.write(`MIME-Version: 1.0` + '\r');
                    // res.write(`Server: Microsoft-IIS/8.5` + '\r');
                    // res.write(`Transfer-Encoding: chunked` + '\r');
                    // res.write(`X-AspNet-Version: 4.0.30319` + '\r');
                    // res.write(`X-Powered-By: ASP.NET` + '\r');
                    // res.write('\r');

                    // res.write(`--uuid:${SNAPSHOT_BOUNDARY}` + '\r');
                    // res.write(`Content-ID: <http://tempuri.org/0>` + '\r');
                    // res.write(`Content-Transfer-Encoding: 8bit` + '\r');
                    // res.write(`Content-Type: application/xop+xml;charset=utf-8;type="text/xml"` + '\r');
                    //
                    // res.write('\r');
                    //
                    // res.write(`<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><DownloadFileStreamedBasicResponse xmlns="http://www.altinn.no/servicesServiceEngineBroker/2015/06"><DownloadFileStreamedBasicResult><xop:Include href="cid:http://tempuri.org/1/${contentId}" xmlns:xop="http://www.w3.org/2004/08/xopinclude"/></DownloadFileStreamedBasicResult></DownloadFileStreamedBasicResponse></s:Body></s:Envelope>`)
                    //
                    // res.write('\r');
                    //
                    // res.write(`--uuid:${SNAPSHOT_BOUNDARY}` + '\r');
                    //
                    // res.write(`Content-ID: <http://tempuri.org/1/${contentId}>` + '\r');
                    // res.write(`Content-Transfer-Encoding: binary` + '\r');
                    // res.write(`Content-Type: application/octet-stream` + '\r');
                    //
                    // res.write('\r');
                    //
                    // res.write(buffer.toString('utf8'));
                    //
                    // res.write(`--uuid:${SNAPSHOT_BOUNDARY}--`);
                    //
                    //
                    //
                    // res.write(`Content-Transfer-Encoding: binary` + '\r\n' + '\r\n');
                    // res.write(` <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                    //                 <soapenv:Header/>
                    //                 <soapenv:Body>
                    //                     <ns:DownloadFileStreamedBasicResponse>
                    //                         <ns:DownloadFileStreamedBasicResult>cid:${CID}</ns:DownloadFileStreamedBasicResult>
                    //                     </ns:DownloadFileStreamedBasicResponse>
                    //                 </soapenv:Body>
                    //             </soapenv:Envelope>`+ '\r\n');
                    //
                    // res.write(SNAPSHOT_BOUNDARY + '\r\n');
                    // res.write(`content-id: <${CID}>` + '\r\n');
                    // res.write('Content-Type: application/octet-stream' + '\r\n');
                    // res.write('Content-Transfer-Encoding: binary' + '\r\n');
                    // res.write('Content-Disposition: attachment; name="' + CID + '\r\n\r\n');
                    // res.write(buffer.toString('utf8'));
                    // res.write('\r\n')
                    // res.write(`${SNAPSHOT_BOUNDARY}--`);
                    //
                    //
                    //
                    //
                    // res.end()

                    res.send(`--uuid:610be47c-8021-4e0d-82d9-362a1e2c6b58+id=3890
Content-ID: <http://tempuri.org/0>
Content-Transfer-Encoding: 8bit
Content-Type: application/xop+xml;charset=utf-8;type="text/xml"

<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><DownloadFileStreamedBasicResponse xmlns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06"><DownloadFileStreamedBasicResult><xop:Include href="cid:http://tempuri.org/1/636854854482615129" xmlns:xop="http://www.w3.org/2004/08/xop/include"/></DownloadFileStreamedBasicResult></DownloadFileStreamedBasicResponse></s:Body></s:Envelope>
--uuid:610be47c-8021-4e0d-82d9-362a1e2c6b58+id=3890
Content-ID: <http://tempuri.org/1/636854854482615129>
Content-Transfer-Encoding: binary
Content-Type: application/octet-stream

${buffer.toString()}   

--uuid:610be47c-8021-4e0d-82d9-362a1e2c6b58+id=3890--`);



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
                                        let messages = global.dpoDB.get(recipient);

                                        let receiptId = uid();

                                        let file = {
                                            xmlHeader: data,
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