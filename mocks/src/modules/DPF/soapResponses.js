// const dpfDB = require("./dpfDB").dpfDB;

function retrieveforsendelsestatus(req, res, parsed){

    let forsendelsesId = parsed.envelope.body["0"].retrieveforsendelsestatus["0"].forsendelsesid["0"]

    let messages = global.dpfDB.get(forsendelsesId);

    if (messages) {
        console.log("stop");
    }

    res.send(`<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://www.ks.no/svarut/servicesV9">
                           <soap:Header/>
                           <soap:Body>
                              <ser:retrieveForsendelseStatusResponse>
                                 <!--Returner LEST-->
                                 <return>LEST</return>
                              </ser:retrieveForsendelseStatusResponse>
                           </soap:Body>
                        </soap:Envelope>`);
}

function sendforsendelsemedid(){
    return `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://www.ks.no/svarut/servicesV9">
                           <soap:Header/>
                           <soap:Body>
                              <ser:sendForsendelseMedIdResponse>
                                 <!--Optional:-->
                                 <return>OK</return>
                              </ser:sendForsendelseMedIdResponse>
                           </soap:Body>
                        </soap:Envelope>`;
}


function PutMessage(){

    let message = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.arkivverket.no/Noark/Exchange/types">
              <soapenv:Header/>
              <soapenv:Body>
                 <typ:PutMessageResponse>
                    <!--Optional:-->
                    <result type="OK">
                    </result>
                 </typ:PutMessageResponse>
              </soapenv:Body>
            </soapenv:Envelope>`;

    return message;
}

function hentForsendelsefil(req, res){
    res.header("Content-Type", "application/zip; charset=UTF-8");

    const childProcess = require('child_process');

    let message = global.dpfDB.get(res.req.params.forsendelsesId);

    let certPath = `${__dirname}/server.pem`;
    let encryptedPath = `${__dirname}/uploads/${res.req.params.forsendelsesId}-encrypted-new`;

    res.header("Content-Disposition", `attachment; filename=\"${message[0].fileName}\"`);

    childProcess.exec(`openssl smime -encrypt -binary -aes-256-cbc -in ${message[0].zipFilePath} -out ${encryptedPath} -outform DER ${certPath}`, {},
        function (err, stdout, stderr) {
            if (err) throw err;
            res.download(`${encryptedPath}`)
        });
}

function hentNyeForsendelser(req, res) {
    res.send([...dpfDB.values()]
        .reduce((accum, curr) => accum.concat(curr), [])
        .map((value) => {

            let response = {
                "avsender": {
                    "adresselinje1": "",
                    "adresselinje2": "",
                    "adresselinje3": "",
                    "navn": value.senderName,
                    "poststed": value.senderCity ,
                    "postnr": value.senderPostCode
                },
                "mottaker": {
                    "adresse1": null,
                    "adresse2": null,
                    "adresse3": null,
                    "postnr": value.receiverPostCode,
                    "poststed": value.receiverCity,
                    "navn": value.receiverName,
                    "land": "Norge",
                    "orgnr": value.receiverOrgNum,
                    "fnr": null
                },
                "id": value.eksternRef,
                "tittel": value.title,
                "date": 1548428782042,
                "metadataFraAvleverendeSystem": {
                    "sakssekvensnummer": 1,
                    "saksaar": 2016,
                    "journalaar": 2016,
                    "journalsekvensnummer": 25,
                    "journalpostnummer": 13,
                    "journalposttype": "U",
                    "journalstatus": "F",
                    "journaldato": 1458514800000,
                    "dokumentetsDato": 1458514800000,
                    "tittel": value.title,
                    "saksBehandler": null,
                    "ekstraMetadata": []
                },
                "metadataForImport": {
                    "sakssekvensnummer": 0,
                    "saksaar": 0,
                    "journalposttype": null,
                    "journalstatus": null,
                    "dokumentetsDato": null,
                    "tittel": null
                },
                "status": "Klar for mottak",
                "niva": "4",
                "filmetadata": [
                    {
                        "filnavn": value.fileName,
                        "mimetype": value.mimeType,
                        "sha256hash": "7a936ed5f396e6d73f0f33de991be54ab34987032c44a2c14613f03a33beb035",
                        "dokumentType": null,
                        "size": 58521
                    }
                ],
                "svarSendesTil": {
                    "adresse1": "Postboks 1337",
                    "adresse2": null,
                    "adresse3": null,
                    "postnr": "1337",
                    "poststed": "OSLO",
                    "navn": "Dølemo og Ramberg",
                    "land": "Norge",
                    "orgnr": "910076787",
                    "fnr": null
                },
                "svarPaForsendelse": null,
                "forsendelseType": null,
                "eksternRef": value.eksternRef,
                "lenker": [],
                "downloadUrl": `http://localhost:${process.env.PORT}/tjenester/svarinn/forsendelse/${value.eksternRef}`
            };

            // console.log(JSON.stringify(response, null, 2));

            return response;
    }));
}

module.exports = { retrieveforsendelsestatus, sendforsendelsemedid, PutMessage, hentNyeForsendelser, hentForsendelsefil };