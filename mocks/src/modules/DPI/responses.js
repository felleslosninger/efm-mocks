const { parseString } = require('xml2js');
const stripPrefix = require('xml2js').processors.stripPrefix;
const moment = require("moment");
const formidable = require('formidable');
const makeid = require("../helper").makeid;
const move = require("../helper").move;

function receiveDPI(req, res){
    let fileName = makeid();

    let filePath = `${__dirname}/uploads/${fileName}.zip`;
    let outputPath = `${__dirname}/uploads/${fileName}`;


    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        console.log("stop");

        move(files[null].path, filePath, (err) => {

            if (err){
                console.log(err);
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        });


    // parseString(req.rawBody,
    //     {
    //         normalizeTags: true,
    //         tagNameProcessors: [ stripPrefix ]
    //     },
    //     (err, js) => {
    //         console.log("stop");
    //
    //         let created = new moment().format();
    //         let expires = new moment().add(5, 'minutes').format();
    //
    //
    //         res.set('Content-Type', 'application/soap+xml; charset=utf-8')
    //
    //         res.send(`<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
    //                     <env:Header>
    //                         <wsse:Security env:mustUnderstand="true" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    //                             <wsse:BinarySecurityToken EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" wsu:Id="X509-c454d6a8-2abc-4208-b4ea-42a41d5f58f3">MIIE9DCCA9ygAwIBAgILAT+iGF2ISezHpl4wDQYJKoZIhvcNAQELBQAwUTELMAkGA1UEBhMCTk8xHTAbBgNVBAoMFEJ1eXBhc3MgQVMtOTgzMTYzMzI3MSMwIQYDVQQDDBpCdXlwYXNzIENsYXNzIDMgVGVzdDQgQ0EgMzAeFw0xNzA0MjQwODM0NDZaFw0yMDA0MjQyMTU5MDBaMFoxCzAJBgNVBAYTAk5PMRgwFgYDVQQKDA9QT1NURU4gTk9SR0UgQVMxHTAbBgNVBAMMFFBPU1RFTiBOT1JHRSBBUyBURVNUMRIwEAYDVQQFEwk5ODQ2NjExODUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCiPsj+RRInXas3xedAYOAL4d3ZFxNOg1qT+emw7SeGBOd301yG3sFfZ61NUmPEznGLMMDGqhonSaXdMKBy8Ge44Lr6TNJ3RXQA7hbNm1QD0GUh7f8kblNEwDL7n9McuwG+itfXzzjF+GEgQUjriS8kdQ7M1R4brMvaZ4IvZQQYXtIUdz8A/IJPSSiw2JPCtdmZazhdcamhb4vq5qhHpQRKw4qNHiacp9tY14ZMQdMp5jdYcPCrKlBLJa7vKQF2qRIhQ77/ZBK7FuvqRCNy/M9ArSxxXmM85kk+n7FikQoSnTb54wEA/zYnzPKafDRQKT5yvO9jJBmMGog2bXEQuhGFAgMBAAGjggHCMIIBvjAJBgNVHRMEAjAAMB8GA1UdIwQYMBaAFD+u9XgLkqNwIDVfWvr3JKBSAfBBMB0GA1UdDgQWBBSPoMjenknBBiZxOLFafkGc1Y/wrzAOBgNVHQ8BAf8EBAMCBLAwFgYDVR0gBA8wDTALBglghEIBGgEAAwIwgbsGA1UdHwSBszCBsDA3oDWgM4YxaHR0cDovL2NybC50ZXN0NC5idXlwYXNzLm5vL2NybC9CUENsYXNzM1Q0Q0EzLmNybDB1oHOgcYZvbGRhcDovL2xkYXAudGVzdDQuYnV5cGFzcy5uby9kYz1CdXlwYXNzLGRjPU5PLENOPUJ1eXBhc3MlMjBDbGFzcyUyMDMlMjBUZXN0NCUyMENBJTIwMz9jZXJ0aWZpY2F0ZVJldm9jYXRpb25MaXN0MIGKBggrBgEFBQcBAQR+MHwwOwYIKwYBBQUHMAGGL2h0dHA6Ly9vY3NwLnRlc3Q0LmJ1eXBhc3Mubm8vb2NzcC9CUENsYXNzM1Q0Q0EzMD0GCCsGAQUFBzAChjFodHRwOi8vY3J0LnRlc3Q0LmJ1eXBhc3Mubm8vY3J0L0JQQ2xhc3MzVDRDQTMuY2VyMA0GCSqGSIb3DQEBCwUAA4IBAQCP2XKHyeZaaQBC4vBLjojanPWguou4iJnbTVcS/PNwwJh+7lvOB6MF5x32ggh617uaramrHNf9G7OZsSS8GZgDWX9BN8xSTD4Zz+lQpclPb3mOkeZapWsYlwBeoLcSSKFS0ezESYtT+XdWcPD06/fg2TWgkCBPBxEsKjzIRVwn34kyfik1mKsVO2JubleXcQDLjhTJ4U82VYQNMMnn4+9ZZrFvlBBUIBfvOOlpMCel+TWvccCpzktygVSScXU0ZK+mj/apl39hWMi5lVrdxq1CI4nrFiJM1vnoqaTp8IzbJEI59Zj2PXFTDxxKkUAhG515ONmTtl6cHrKpWx5grczC</wsse:BinarySecurityToken>
    //                             <wsu:Timestamp wsu:Id="TS-8c06999e-5aad-421c-95fa-b885012e6899">
    //                                 <wsu:Created>${created}</wsu:Created>
    //                                 <wsu:Expires>${expires}</wsu:Expires>
    //                             </wsu:Timestamp>
    //                             <ds:Signature Id="SIG-fd7b8fd7-9271-463b-969d-37ecc1b3db3b" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    //                                 <ds:SignedInfo>
    //                                     <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
    //                                         <ec:InclusiveNamespaces PrefixList="env" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/>
    //                                     </ds:CanonicalizationMethod>
    //                                     <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
    //                                     <ds:Reference URI="#id-1d7556d6-56c5-4cdf-a90a-54efc603094e">
    //                                         <ds:Transforms>
    //                                             <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
    //                                         </ds:Transforms>
    //                                         <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
    //                                         <ds:DigestValue>Dk0nJWAv9MFp6NaG38IC3Hgc05SWkKaZHpaqjfqB46s=</ds:DigestValue>
    //                                     </ds:Reference>
    //                                     <ds:Reference URI="#TS-8c06999e-5aad-421c-95fa-b885012e6899">
    //                                         <ds:Transforms>
    //                                             <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
    //                                                 <ec:InclusiveNamespaces PrefixList="wsse env" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/>
    //                                             </ds:Transform>
    //                                         </ds:Transforms>
    //                                         <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
    //                                         <ds:DigestValue>fDdQ8UKGoz41299SuMBhr7kKuUiQM/BVrOmBoDLUCqc=</ds:DigestValue>
    //                                     </ds:Reference>
    //                                     <ds:Reference URI="#id-70201561-5037-40db-9fe7-1be465630be3">
    //                                         <ds:Transforms>
    //                                             <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
    //                                         </ds:Transforms>
    //                                         <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
    //                                         <ds:DigestValue>xO/x7v7MjWJUsa9HhZqDu4/6pVDWxcG206ImsASf8dc=</ds:DigestValue>
    //                                     </ds:Reference>
    //                                 </ds:SignedInfo>
    //                                 <ds:SignatureValue>mtiHz+51Y4nQEmONhXHDSPNkjhWVjAOztgeonus8pKMqIMopRSGBvXUTl3wzxnbeJrzjIoDkCRlloLMofGj1ypPe9Vi1KQu0zPT24PreG5SCsQuCDE2hXYQ6ZWlGlxIbc4btSyvTFn30sCfYxsaJFvq+0XFVymT+XX7lMQgxlbThWte6NIPknvwrgX0TISNTCxVowK+Lo58m6DtBeCVtqG1mU/n/HdJq4PG0NZlk4VxFgXUJhpMaIrcy3zrLX8cxKkp7pFPQhZo2msWEXakRTCblvpV2ooTxa7ZUdpra3b7LppwKBh7x/qLG3sUoTgNbedwCFW1C3xsVDbidwS2WSw==</ds:SignatureValue>
    //                                 <ds:KeyInfo Id="KI-ec46469a-e96f-4f75-8f11-110ad25dd5a9">
    //                                     <wsse:SecurityTokenReference wsu:Id="STR-294fb9c5-278f-4770-b06d-f444f7c9edc8">
    //                                         <wsse:Reference URI="#X509-c454d6a8-2abc-4208-b4ea-42a41d5f58f3" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>
    //                                     </wsse:SecurityTokenReference>
    //                                 </ds:KeyInfo>
    //                             </ds:Signature>
    //                         </wsse:Security>
    //                         <eb:Messaging env:mustUnderstand="true" wsu:Id="id-70201561-5037-40db-9fe7-1be465630be3" xmlns:eb="http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    //                             <ns6:SignalMessage xmlns:ns10="http://uri.etsi.org/2918/v1.2.1#" xmlns:ns11="http://uri.etsi.org/01903/v1.3.2#" xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns3="http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader" xmlns:ns4="http://www.w3.org/2003/05/soap-envelope" xmlns:ns5="http://www.w3.org/2000/09/xmldsig#" xmlns:ns6="http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/" xmlns:ns7="http://docs.oasis-open.org/ebxml-bp/ebbp-signals-2.0" xmlns:ns8="http://www.w3.org/1999/xlink" xmlns:ns9="http://begrep.difi.no/sdp/schema_v10">
    //                                 <ns6:MessageInfo>
    //                                     <ns6:Timestamp>2019-02-22T10:27:40.526+01:00</ns6:Timestamp>
    //                                     <ns6:MessageId>5acaf734-4ee9-4e65-a51c-086263b2ec17</ns6:MessageId>
    //                                     <ns6:RefToMessageId>83731a77-e18b-4f45-b79d-958ee70c8ea3</ns6:RefToMessageId>
    //                                 </ns6:MessageInfo>
    //                                 <ns6:Receipt>
    //                                     <ns7:NonRepudiationInformation>
    //                                         <ns7:MessagePartNRInformation>
    //                                             <ns5:Reference URI="cid:ec0d8920-30a3-4f17-a958-fb8e7704a47f@meldingsformidler.sdp.difi.no">
    //                                                 <ns5:Transforms>
    //                                                     <ns5:Transform Algorithm="http://docs.oasis-open.org/wss/oasis-wss-SwAProfile-1.1#Attachment-Content-Signature-Transform"/>
    //                                                 </ns5:Transforms>
    //                                                 <ns5:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
    //                                                 <ns5:DigestValue>tdcsCJs+JKAkZg1Hqp+2+JI7GqezUEi2KzIG1TPi9LQ=</ns5:DigestValue>
    //                                             </ns5:Reference>
    //                                         </ns7:MessagePartNRInformation>
    //                                         <ns7:MessagePartNRInformation>
    //                                             <ns5:Reference URI="#soapBody">
    //                                                 <ns5:Transforms>
    //                                                     <ns5:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
    //                                                 </ns5:Transforms>
    //                                                 <ns5:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
    //                                                 <ns5:DigestValue>rjrT+emKJ0Ex9OoI6j58Vr9IL3VZJ2dDMRPXGm4wkYo=</ns5:DigestValue>
    //                                             </ns5:Reference>
    //                                         </ns7:MessagePartNRInformation>
    //                                     </ns7:NonRepudiationInformation>
    //                                 </ns6:Receipt>
    //                             </ns6:SignalMessage>
    //                         </eb:Messaging>
    //                     </env:Header>
    //                     <env:Body wsu:Id="id-1d7556d6-56c5-4cdf-a90a-54efc603094e" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"/>
    //                 </env:Envelope>`);
    //     });
    })
}


module.exports = { receiveDPI };