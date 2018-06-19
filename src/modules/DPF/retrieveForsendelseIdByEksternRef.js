retrieveForsendelseIdByEksternRefResponse = function (req, res) {
    // 1. Save the externalRef for later:
    let externRef = req.body["envelope"]["body"][0]["retrieveforsendelseidbyeksternref"][0]["eksternref"][0];
    console.log('Got the external ref:', externRef);

    return `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://www.ks.no/svarut/servicesV9">
               <soap:Header/>
               <soap:Body>
                  <ser:retrieveForsendelseIdByEksternRefResponse>
                     <!--Zero or more repetitions:-->
                     <return>42<!--Svarut ID. Generert av MOCK.--></return>
                  </ser:retrieveForsendelseIdByEksternRefResponse>
               </soap:Body>
            </soap:Envelope>`;
};

module.exports = { retrieveForsendelseIdByEksternRefResponse };