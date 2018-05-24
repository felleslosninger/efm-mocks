function retrieveforsendelsestatus(){
    return `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://www.ks.no/svarut/servicesV9">
                           <soap:Header/>
                           <soap:Body>
                              <ser:retrieveForsendelseStatusResponse>
                                 <!--Returner LEST-->
                                 <return>LEST</return>
                              </ser:retrieveForsendelseStatusResponse>
                           </soap:Body>
                        </soap:Envelope>`;
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

module.exports = { retrieveforsendelsestatus, sendforsendelsemedid, PutMessage };