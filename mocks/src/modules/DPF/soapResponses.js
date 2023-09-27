const request = require('superagent');

function retreiveforsendelsetyper(req, res, parsed) {
    res.send(`<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
   <soap:Body>
      <ns2:retreiveForsendelseTyperResponse xmlns:ns2="http://www.ks.no/svarut/servicesV9">
         <return>Byggesøknad</return>
         <return>Geointegrasjon.Matrikkelføring</return>
         <return>Geointegrasjon.Matrikkelføringsrespons</return>
         <return>ks.signertforsendelse</return>
         <return>nav.digisos</return>
      </ns2:retreiveForsendelseTyperResponse>
   </soap:Body>
</soap:Envelope>`);
}

function retrieveforsendelsestatuser(req, res, parsed){

    let forsendelsesId = parsed.envelope.body["0"].retrieveforsendelsestatuser["0"].forsendelseider["0"]

    res.send(`<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://www.ks.no/svarut/servicesV9">
                           <soap:Header/>
                           <soap:Body>
                              <ser:retrieveForsendelseStatuserResponse>
                                 <!--Returner LEST-->
                                 <return>
                                    <forsendelseStatus>LEST</forsendelseStatus>
                                    <forsendelsesid>${forsendelsesId}</forsendelsesid>
                                    <sisteStatusEndring>${new Date().toISOString()}</sisteStatusEndring>
                                 </return>
                              </ser:retrieveForsendelseStatuserResponse>
                           </soap:Body>
                        </soap:Envelope>`);

}

function sendforsendelsemedid() {
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

function PutMessage() {
    return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.arkivverket.no/Noark/Exchange/types">
              <soapenv:Header/>
              <soapenv:Body>
                 <typ:PutMessageResponse>
                    <!--Optional:-->
                    <result type="OK">
                    </result>
                 </typ:PutMessageResponse>
              </soapenv:Body>
            </soapenv:Envelope>`;
}

function retrieveCertificate(orgNum){
    return new Promise((resolve, reject) => {
        request.get(`http://localhost:8090/identifier/${orgNum}`)
            .then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
    });
}

function hentForsendelsefil(req, res){
    let username = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':')[0];
    res.header("Content-Type", "application/zip; charset=UTF-8");

    const childProcess = require('child_process');
    let certPath = `${__dirname}/910075918.cer`;
    let encryptedPath = `${__dirname}/uploads/${res.req.params.forsendelsesId}-encrypted`;
    let messages = [ ...dpfDB.get(username) ];
    let message = messages.find(value => value.conversationId === req.params.forsendelsesId);

    res.header("Content-Disposition", `attachment; filename=\"${message.fileName}\"`);

    childProcess.exec(`openssl smime -encrypt -binary -aes-256-cbc -in ${__dirname}/uploads/${res.req.params.forsendelsesId}.zip -out ${encryptedPath} -outform DER ${certPath}`, {},
        function (err, stdout, stderr) {
            if (err) throw err;
            res.download(`${encryptedPath}`)
        });
}

function hentNyeForsendelser(req, res) {
    let username = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':')[0];
    if (!dpfDB.get(username)) {
        res.send([]);
        return;
    }
    res.send([...dpfDB.get(username)]
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
                        "mimetype": value.mimeType[0],
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


            return response;
    }));
}

module.exports = { retreiveforsendelsetyper, retrieveforsendelsestatuser, sendforsendelsemedid, PutMessage, hentNyeForsendelser, hentForsendelsefil };