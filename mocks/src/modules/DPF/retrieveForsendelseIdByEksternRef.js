// const dpfDB = require("./dpfDB").dpfDB;

retrieveForsendelseIdByEksternRefResponse = function (req, res, parsed) {
    // 1. Save the externalRef for later:
    let externRef = parsed.envelope.body["0"].retrieveforsendelseidbyeksternref["0"].eksternref["0"];

    let messages = global.dpfDB.get(externRef);

    if (messages) {
        console.log('break');
    }

    res.send(`<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://www.ks.no/svarut/servicesV9">
                   <soap:Header/>
                   <soap:Body>
                      <ser:retrieveForsendelseIdByEksternRefResponse>
                         <!--Zero or more repetitions:-->
                         ${ messages && `<return>${externRef}<!--Svarut ID. Generert av MOCK.--></return>` }
                      </ser:retrieveForsendelseIdByEksternRefResponse>
                   </soap:Body>
                </soap:Envelope>`);
};

module.exports = { retrieveForsendelseIdByEksternRefResponse };