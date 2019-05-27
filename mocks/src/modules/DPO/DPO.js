const fetch = require('node-fetch');

function receiveDPO(req, res) {
    console.log('receiveDPO');
    res.send('ok');
}

function getBrokerServiceExternalBasicWSDL(req, res){

    res.header('Content-type', 'text/xml');
    res.status(200);

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
                <wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
                  <wsdl:import namespace="http://www.altinn.no/services/ServiceEngine/Broker/2015/06" location="/?WSDL&amp;interface=BasicHttpBinding_IBrokerServiceExternalBasicStreamed&amp;part=BrokerServiceExternalBasicStreamed.wsdl">
                    </wsdl:import>
                  <wsdl:import namespace="http://www.altinn.no/services/ServiceEngine/Broker/2015/06" location="/?WSDL&amp;interface=BasicHttpBinding_IBrokerServiceExternalBasic&amp;part=BrokerServiceExternalBasic.wsdl">
                    </wsdl:import>
                </wsdl:definitions>`);
}

function getBrokerServiceExternalBasicStreamedWSDL(req, res){

    res.header('Content-type', 'text/xml');
    res.status(200);

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
                <wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
                  <wsdl:import namespace="http://www.altinn.no/services/ServiceEngine/Broker/2015/06" location="/?WSDL&amp;interface=BasicHttpBinding_IBrokerServiceExternalBasicStreamed&amp;part=BrokerServiceExternalBasicStreamed.wsdl">
                    </wsdl:import>
                  <wsdl:import namespace="http://www.altinn.no/services/ServiceEngine/Broker/2015/06" location="/?WSDL&amp;interface=BasicHttpBinding_IBrokerServiceExternalBasic&amp;part=BrokerServiceExternalBasic.wsdl">
                    </wsdl:import>
                </wsdl:definitions>`);
}


function BrokerServiceExternalBasic(req, res){
    res.send(BrokerServiceExternalBasicResponse());
}

function BrokerServiceExternalBasicResponse() {
    return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
            <soapenv:Header/>
            <soapenv:Body></soapenv:Body>
        </soapenv:Envelope>`;
}

module.exports = { getBrokerServiceExternalBasicWSDL, BrokerServiceExternalBasic, getBrokerServiceExternalBasicStreamedWSDL };


