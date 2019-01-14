const { db } = require("../../db");
const { parseString } = require('xml2js');
const move = require("../helper").move;
const makeid = require("../helper").makeid;
const formidable = require('formidable')
const stripPrefix = require('xml2js').processors.stripPrefix;
const extract = require('extract-zip')
const fs = require('fs');
const uid = require("uid");
const recursiveKeySearch = require("../helper").recursiveKeySearch;

function GetAvailableFilesBasic(req, res) {

    console.log('ding');

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

            console.log(response);

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
    console.log(req, null, 2);


    let splitted = req.rawBody.split("\r\n");

    console.log(splitted);

    // let file = splitted[11];
    let xml = splitted[5];

    //fs.readFile("nyzip.zip", "utf8", function(err, data) {

    parseXml(xml, (err, parsed) => {


        let reportee = parsed["envelope"]["body"][0]["downloadfilestreamedbasic"][0]["reportee"][0];

        let fileReference = parsed["envelope"]["body"][0]["downloadfilestreamedbasic"][0]["filereference"][0];

        let files = db.get(reportee);

        let file = files.filter((item) => {
            return item.fileReference === fileReference;
        });

        let SNAPSHOT_BOUNDARY = "uuid:6444b74d-eade-4c93-a057-2aacf780696e+id=92282";

        res.writeHead(200, {
            'Content-Type': `multipart/related; type="application/xop+xml";start="<http://tempuri.org/0>";boundary="uuid:6444b74d-eade-4c93-a057-2aacf780696e+id=92282";start-info="text/xml"`,
            Connection: 'keep-alive'
        });

        res.write('\n\n --' + SNAPSHOT_BOUNDARY + '\n');
        res.write('Content-ID: <http://tempuri.org/0> \n');
        res.write('Content-Transfer-Encoding: 8bit \n');
        res.write('Content-Type: application/xop+xml;charset=utf-8;type="text/xml" \n');
        res.write(`<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><DownloadFileStreamedBasicResponse xmlns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06"><DownloadFileStreamedBasicResult><xop:Include href="cid:http://tempuri.org/1/636634546764523783" xmlns:xop="http://www.w3.org/2004/08/xop/include"/></DownloadFileStreamedBasicResult></DownloadFileStreamedBasicResponse></s:Body></s:Envelope>`);


        function writeResponse() {
            let buffer = new Buffer(0);
            let readStream = fs.createReadStream(file[0].file);

            readStream.on('error', function (err) {
                if (err) {
                    // handle error
                }
            });

            readStream.on('data', function (chunk) {
                buffer = Buffer.concat([buffer, chunk]);
            });

            readStream.on('end', () => {
                res.write('\n\n --' + SNAPSHOT_BOUNDARY + '\n');
                res.write('Content-ID: <http://tempuri.org/1/636634546764523783> \n');
                res.write('Content-Transfer-Encoding: binary \n');
                res.write('Content-Type: application/octet-stream \n\n');
                res.write(buffer);
                res.write('\n--' + SNAPSHOT_BOUNDARY + '--');
                res.end()
            });
        }

        writeResponse()



//         res.send(
//             `--uuid:6444b74d-eade-4c93-a057-2aacf780696e+id=92282
// Content-ID: <http://tempuri.org/0>
// Content-Transfer-Encoding: 8bit
// Content-Type: application/xop+xml;charset=utf-8;type="text/xml"
//
// <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><DownloadFileStreamedBasicResponse xmlns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06"><DownloadFileStreamedBasicResult><xop:Include href="cid:http://tempuri.org/1/636634546764523783" xmlns:xop="http://www.w3.org/2004/08/xop/include"/></DownloadFileStreamedBasicResult></DownloadFileStreamedBasicResponse></s:Body></s:Envelope>
// --uuid:6444b74d-eade-4c93-a057-2aacf780696e+id=92282
// Content-ID: <http://tempuri.org/1/636634546764523783>
// Content-Transfer-Encoding: binary
// Content-Type: application/octet-stream
//
// ${file[0].file}
// --uuid:6444b74d-eade-4c93-a057-2aacf780696e+id=92282--`
//         );

    });
    //});
}

// <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
//     <soapenv:Header/>
// <soapenv:Body>
// <ns:DownloadFileStreamedBasicResponse>
// <ns:DownloadFileStreamedBasicResult>cid:1353767272596</ns:DownloadFileStreamedBasicResult>
// </ns:DownloadFileStreamedBasicResponse>
// </soapenv:Body>
// </soapenv:Envelope>



function UploadFileStreamedBasic(req, res) {

    const form = new formidable.IncomingForm();

    // let splitted = req.rawBody.split("\r\n");
    //
    // console.log(splitted);
    //
    // // let file = splitted[11];
    // let xml = splitted[5];

    let fileName = makeid();

    let filePath = `${__dirname}/uploads/${fileName}.zip`;
    let outputPath = `${__dirname}/uploads/${fileName}`;

    form.parse(req, (err, fields, files) => {
        move(files[null].path, filePath, (err) => {

            extract(filePath, { dir: outputPath }, (err) => {
                // handle err
                console.log('ding');
                if (!err) {
                    fs.readFile(`${outputPath}/recipients.xml`, (err, data) => {
                        parseString(data,
                            {
                                normalizeTags: true,
                                tagNameProcessors: [ stripPrefix ]
                            },
                            (err, result) => {
                                if (!err){
                                    console.log(result);
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
                                    console.log(recipient);
                                    console.log('Done');


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


        // var XmlStream = require('xml-stream');
        //
        // req.setEncoding('utf8');
        // var xml = new XmlStream(req);
        // xml.on('updateElement: envelope', function(element) {
        //     // DO some processing on the tag
        //     console.log('Got some envelope!');
        // });
        // xml.on('end', function() {
        //     res.end();
        // });

        //files[0].write()

        // parseXml(xml, (err, parsed) => {
        //     console.log(parsed);
        //
        //     console.log("The file was saved!");
        //
        //     let reportee = parsed["envelope"]["header"][0]["reportee"][0]["_"];
        //
        //     let messages = db.get(reportee);
        //
        //
        //     if (messages){
        //         messages.push({
        //             xmlHeader: xml,
        //             file: files[null].path,
        //             fileReference: uid(),
        //             receiptId: uid()
        //         });
        //     } else {
        //         db.set(reportee, [
        //             {
        //                 xmlHeader: xml,
        //                 file: files[null].path,
        //                 fileReference: uid(),
        //                 receiptId: uid()
        //             }
        //         ]);
        //     }
        //
        //     res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
        //                <soapenv:Header/>
        //                <soapenv:Body>
        //                   <ns:ReceiptExternalStreamedBE>
        //                      <!--Optional:-->
        //                      <ns:LastChanged>?</ns:LastChanged>
        //                      <!--Optional:-->
        //                      <ns:ParentReceiptId>?</ns:ParentReceiptId>
        //                      <!--Optional:-->
        //                      <ns:ReceiptHistory>?</ns:ReceiptHistory>
        //                      <!--Optional:-->
        //                      <ns:ReceiptId>?</ns:ReceiptId>
        //                      <!--Optional:-->
        //                      <ns:ReceiptStatusCode>?</ns:ReceiptStatusCode>
        //                      <!--Optional:-->
        //                      <ns:ReceiptText>?</ns:ReceiptText>
        //                      <!--Optional:-->
        //                      <ns:ReceiptTypeName>?</ns:ReceiptTypeName>
        //                   </ns:ReceiptExternalStreamedBE>
        //                </soapenv:Body>
        //             </soapenv:Envelope>`)
        //
        // });

    });

}

module.exports = {  GetAvailableFilesBasic, InitiateBrokerServiceBasic, DownloadFileStreamedBasic, UploadFileStreamedBasic };