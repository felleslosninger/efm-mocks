const { db } = require("../../db");


const { parseString } = require('xml2js');
const uid = require("uid");
const multiparty = require("../multiparty");
let fs = require('fs');

const stripPrefix = require('xml2js').processors.stripPrefix;


function GetAvailableFilesBasic(req, res) {


    // let reportee = req.body["s:envelope"]["s:body"]
    //     [0]["ns2:getavailablefilesbasic"][0]
    //     ["ns2:searchparameters"][0]["reportee"][0]


    // parseString(req.rawBody, { tagNameProcessors: [ stripPrefix ] }, function(err, js) {
    //     if(err) throw err;
    //     cons`ole.dir(js, { depth: null });
    // });


    parseString(req.rawBody, { normalizeTags: true, tagNameProcessors: [ stripPrefix ] }, function(err, js) {
        if(err) throw err;
        let reportee = js.envelope.body[0]['getavailablefilesbasic'][0]['searchparameters'][0]["reportee"][0];

        let files = db.get(reportee)
        res.send(`<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
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
                </s:Envelope>`);
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


        // console.log(file);
        //
        // console.log(reportee);

        // res.set({
        //     'Content-Type': `multipart/related; type="application/xop+xml";start="<http://tempuri.org/0>";boundary="uuid:6444b74d-eade-4c93-a057-2aacf780696e+id=92282";start-info="text/xml"`
        // });

        //res.write(`<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><DownloadFileStreamedBasicResponse xmlns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06"><DownloadFileStreamedBasicResult><xop:Include href="cid:http://tempuri.org/1/636634546764523783" xmlns:xop="http://www.w3.org/2004/08/xop/include"/></DownloadFileStreamedBasicResult></DownloadFileStreamedBasicResponse></s:Body></s:Envelope>`)


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
            var buffer = new Buffer(0);
            var readStream = fs.createReadStream(file[0].file);

            readStream.on('error', function (err) {
                if (err) {
                    // handle error
                }
            });

            readStream.on('data', function (chunk) {
                buffer = Buffer.concat([buffer, chunk]);
            });

            readStream.on('end', function () {
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



function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function UploadFileStreamedBasic(req, res) {

    console.log(req);

    // let splitted = req.rawBody.split("\r\n");
    // let file = splitted[11];
    // let xml = splitted[5];


    var formidable = require('formidable')

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        // res.writeHead(200, {'content-type': 'text/plain'});
        // res.write('received upload:\n\n');
        // res.end(util.inspect({fields: fields, files: files}));

        console.log(fields);
        console.log(files);

        var util = require('util')

        move(files[null].path, `${__dirname}/uploads/${makeid()}.zip`, (err) => {
            console.log(err);
            console.log('what');
        });

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

        console.log("The file was saved!");


    });


    //var form = new multiparty.Form();
    //let boundary = splitted[0];

    //let fs = require('fs');
    // fs.writeFile(`${uid()}.txt`, file, 'ascii', (err) => {
    //     if(err) {
    //         return console.log(err);
    //     }


    //const fileType = require('file-type');


    //});

}

module.exports = {  GetAvailableFilesBasic, InitiateBrokerServiceBasic, DownloadFileStreamedBasic, UploadFileStreamedBasic };