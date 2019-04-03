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
    res.set('Content-type', 'application/soap+xml');
    res.send(req.rawBody);

    // form.parse(req, (err, fields, files) => {
    //     console.log("stop");
    //
    //     move(files[null].path, filePath, (err) => {
    //
    //         console.log('yo');
    //
    //         if (err) {
    //             console.log(err);
    //             // res.sendStatus(400);
    //         } else {
    //             // res.sendStatus(200);
    //         }
    //     });


    parseString(req.rawBody,
        {
            normalizeTags: true,
            tagNameProcessors: [ stripPrefix ]
        },
        (err, js) => {

            if (js.envelope.header["0"].messaging["0"].signalmessage["0"].pullrequest) {
                console.log('stop');
            } else {
                console.log("also stop");
            }

            let created = new moment().format();
            let expires = new moment().add(5, 'minutes').format();


            let wsuId  = js.envelope.header["0"].security["0"].binarysecuritytoken["0"].$["wsu:Id"]


            let binarySecToken = js.envelope.header["0"].security["0"].binarysecuritytoken["0"]._;

            let signatureId = js.envelope.header["0"].security["0"].signature["0"].$.Id;


            let signatureValue = js.envelope.header["0"].security["0"].signature["0"].signaturevalue["0"];

            // let referenceUri =

//             res.set('Content-Type', 'application/soap+xml; charset=utf-8')
//
//
//             res.send(`<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
//   <env:Header>
//     <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" env:mustUnderstand="true">
//       <wsse:BinarySecurityToken EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" wsu:Id="X509-1c10ab2e-7462-4364-b7f8-2ac60d655e27">MIIFETCCA/mgAwIBAgILAUknTgzjO5360y8wDQYJKoZIhvcNAQELBQAwUTELMAkGA1UEBhMCTk8xHTAbBgNVBAoMFEJ1eXBhc3MgQVMtOTgzMTYzMzI3MSMwIQYDVQQDDBpCdXlwYXNzIENsYXNzIDMgVGVzdDQgQ0EgMzAeFw0xNzA2MTIwODU2MTFaFw0yMDA2MTIyMTU5MDBaMHcxCzAJBgNVBAYTAk5PMSwwKgYDVQQKDCNESVJFS1RPUkFURVQgRk9SIEZPUlZBTFROSU5HIE9HIElLVDESMBAGA1UECwwJT0lEQyB0ZXN0MRIwEAYDVQQDDAlESUZJIFRFU1QxEjAQBgNVBAUTCTk5MTgyNTgyNzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANgnUbiXPmgA8OBxnPa4ZlRHKNSiR1OQIj1wYKHrz4U1HoWmG5+VTZPXbhmRx20lGqQWrC0mqV2l/BrSTTpMumotPMWMQMmlUwWq0AXdQDx3H5BGYa66sV56xIvC4lzKI2EAGjsxdde8Xw7aypE5uJ/OVMycb/w6lqoDis8tHxiN0K4Z+IlULvpfCY56P7C+cuSzFU7UYkjbz9+XuWZlgJFfw2jAAXg6szzZ+lvleAI+6oUu3HfpnuJeBRO/xfDvkc/0cIPFRHAEeZ8nQwbsEi+OVSEFyYntSW3S0Pb9YmJk0CIiucLnVXJ5VBwyl6WsbDrckYd6JOmbXJGET/NtehMCAwEAAaOCAcIwggG+MAkGA1UdEwQCMAAwHwYDVR0jBBgwFoAUP671eAuSo3AgNV9a+vckoFIB8EEwHQYDVR0OBBYEFEeyddtKkcdiyFtyvb1nZwwEbnTAMA4GA1UdDwEB/wQEAwIGQDAWBgNVHSAEDzANMAsGCWCEQgEaAQADAjCBuwYDVR0fBIGzMIGwMDegNaAzhjFodHRwOi8vY3JsLnRlc3Q0LmJ1eXBhc3Mubm8vY3JsL0JQQ2xhc3MzVDRDQTMuY3JsMHWgc6Bxhm9sZGFwOi8vbGRhcC50ZXN0NC5idXlwYXNzLm5vL2RjPUJ1eXBhc3MsZGM9Tk8sQ049QnV5cGFzcyUyMENsYXNzJTIwMyUyMFRlc3Q0JTIwQ0ElMjAzP2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3QwgYoGCCsGAQUFBwEBBH4wfDA7BggrBgEFBQcwAYYvaHR0cDovL29jc3AudGVzdDQuYnV5cGFzcy5uby9vY3NwL0JQQ2xhc3MzVDRDQTMwPQYIKwYBBQUHMAKGMWh0dHA6Ly9jcnQudGVzdDQuYnV5cGFzcy5uby9jcnQvQlBDbGFzczNUNENBMy5jZXIwDQYJKoZIhvcNAQELBQADggEBAEcjKqJu3NoaOECYTek66wNfjW9iRz0VYLlpbc5AFEc2cuEiewNR6Sh0Mo4TfxZDVAli2ZiEWc+rlvFaS2hbebR+bKUryPcVFSCAtC72D4ja6zMju+NpvEetTn6k81Wgfsgjx6XNjJYc/6QNjvT4N22adEwyMvhE8ljkSg4d/udQyi2DQdHt0Shq/WK068N+hKRg+RIIdCu6Il9FSndyYO0azWZpcjujHVH7p8qKVZ58G87HDiC6FcpeZBOmzT/O7XiSy141U43JeFKBXkVupC0OYPosYGPnmzExqWLybgkbO/dSl8oDTzIIifvxyCd2iMEAc07+OuEefETzAxjqBHM=</wsse:BinarySecurityToken>
//       <wsu:Timestamp wsu:Id="TS-e87a2405-1433-4a7a-958b-3a7bd3e473b7">
//         <wsu:Created>${created}</wsu:Created>
//         <wsu:Expires>${expires}</wsu:Expires>
//       </wsu:Timestamp>
//       <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="SIG-2c240b9f-a025-4d2d-96ab-b94a06a5f524">
//         <ds:SignedInfo>
//           <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
//             <ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="env"/>
//           </ds:CanonicalizationMethod>
//           <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
//           <ds:Reference URI="#soapBody">
//             <ds:Transforms>
//               <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
//             </ds:Transforms>
//             <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
//             <ds:DigestValue>bESP4Ndg/0VjAt/ul3Y6LE6Qiz3juGBqZDsM3IwKGug=</ds:DigestValue>
//           </ds:Reference>
//           <ds:Reference URI="#TS-e87a2405-1433-4a7a-958b-3a7bd3e473b7">
//             <ds:Transforms>
//               <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
//                 <ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="wsse env"/>
//               </ds:Transform>
//             </ds:Transforms>
//             <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
//             <ds:DigestValue>fEcCQ6OET4yMX0xSPKCOX2EVyJa2PtBi7dXFttSjA3k=</ds:DigestValue>
//           </ds:Reference>
//           <ds:Reference URI="#id-48f8f51c-512a-4603-bd06-fcb773b44e2b">
//             <ds:Transforms>
//               <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
//             </ds:Transforms>
//             <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
//             <ds:DigestValue>sBEIt6Tgh7JaD3HThox5KgmmVhV8Dm4PtXTrqUUqCg4=</ds:DigestValue>
//           </ds:Reference>
//         </ds:SignedInfo>
//         <ds:SignatureValue>${signatureValue}</ds:SignatureValue>
//         <ds:KeyInfo Id="KI-cbb52cf3-e894-45f3-a93d-2febfe659537">
//           <wsse:SecurityTokenReference wsu:Id="STR-35a767cd-4d45-4a75-9a0f-a2f35e70fc82">
//             <wsse:Reference URI="#X509-1c10ab2e-7462-4364-b7f8-2ac60d655e27" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>
//           </wsse:SecurityTokenReference>
//         </ds:KeyInfo>
//       </ds:Signature>
//     </wsse:Security>
//     <eb:Messaging xmlns:eb="http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" env:mustUnderstand="true" wsu:Id="id-48f8f51c-512a-4603-bd06-fcb773b44e2b">
//       <ns6:SignalMessage xmlns:ns10="http://uri.etsi.org/2918/v1.2.1#" xmlns:ns11="http://uri.etsi.org/01903/v1.3.2#" xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns3="http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader" xmlns:ns4="http://www.w3.org/2003/05/soap-envelope" xmlns:ns5="http://www.w3.org/2000/09/xmldsig#" xmlns:ns6="http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/" xmlns:ns7="http://docs.oasis-open.org/ebxml-bp/ebbp-signals-2.0" xmlns:ns8="http://www.w3.org/1999/xlink" xmlns:ns9="http://begrep.difi.no/sdp/schema_v10">
//         <ns6:MessageInfo>
//           <ns6:Timestamp>2019-03-11T12:44:08.123+01:00</ns6:Timestamp>
//           <ns6:MessageId>503df4c3-b7da-4d88-8c95-2640d6339f84</ns6:MessageId>
//         </ns6:MessageInfo>
//         <ns6:PullRequest mpc="urn:normal:no.difi.move.integrasjonspunkt"/>
//       </ns6:SignalMessage>
//     </eb:Messaging>
//   </env:Header>
//   <env:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="soapBody"/>
// </env:Envelope>`)

            // res.send(`<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
            //             <env:Header>
            //                 <wsse:Security env:mustUnderstand="true" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
            //                     <wsse:BinarySecurityToken EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" wsu:Id="X509-c454d6a8-2abc-4208-b4ea-42a41d5f58f3">MIIE9DCCA9ygAwIBAgILAT+iGF2ISezHpl4wDQYJKoZIhvcNAQELBQAwUTELMAkGA1UEBhMCTk8xHTAbBgNVBAoMFEJ1eXBhc3MgQVMtOTgzMTYzMzI3MSMwIQYDVQQDDBpCdXlwYXNzIENsYXNzIDMgVGVzdDQgQ0EgMzAeFw0xNzA0MjQwODM0NDZaFw0yMDA0MjQyMTU5MDBaMFoxCzAJBgNVBAYTAk5PMRgwFgYDVQQKDA9QT1NURU4gTk9SR0UgQVMxHTAbBgNVBAMMFFBPU1RFTiBOT1JHRSBBUyBURVNUMRIwEAYDVQQFEwk5ODQ2NjExODUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCiPsj+RRInXas3xedAYOAL4d3ZFxNOg1qT+emw7SeGBOd301yG3sFfZ61NUmPEznGLMMDGqhonSaXdMKBy8Ge44Lr6TNJ3RXQA7hbNm1QD0GUh7f8kblNEwDL7n9McuwG+itfXzzjF+GEgQUjriS8kdQ7M1R4brMvaZ4IvZQQYXtIUdz8A/IJPSSiw2JPCtdmZazhdcamhb4vq5qhHpQRKw4qNHiacp9tY14ZMQdMp5jdYcPCrKlBLJa7vKQF2qRIhQ77/ZBK7FuvqRCNy/M9ArSxxXmM85kk+n7FikQoSnTb54wEA/zYnzPKafDRQKT5yvO9jJBmMGog2bXEQuhGFAgMBAAGjggHCMIIBvjAJBgNVHRMEAjAAMB8GA1UdIwQYMBaAFD+u9XgLkqNwIDVfWvr3JKBSAfBBMB0GA1UdDgQWBBSPoMjenknBBiZxOLFafkGc1Y/wrzAOBgNVHQ8BAf8EBAMCBLAwFgYDVR0gBA8wDTALBglghEIBGgEAAwIwgbsGA1UdHwSBszCBsDA3oDWgM4YxaHR0cDovL2NybC50ZXN0NC5idXlwYXNzLm5vL2NybC9CUENsYXNzM1Q0Q0EzLmNybDB1oHOgcYZvbGRhcDovL2xkYXAudGVzdDQuYnV5cGFzcy5uby9kYz1CdXlwYXNzLGRjPU5PLENOPUJ1eXBhc3MlMjBDbGFzcyUyMDMlMjBUZXN0NCUyMENBJTIwMz9jZXJ0aWZpY2F0ZVJldm9jYXRpb25MaXN0MIGKBggrBgEFBQcBAQR+MHwwOwYIKwYBBQUHMAGGL2h0dHA6Ly9vY3NwLnRlc3Q0LmJ1eXBhc3Mubm8vb2NzcC9CUENsYXNzM1Q0Q0EzMD0GCCsGAQUFBzAChjFodHRwOi8vY3J0LnRlc3Q0LmJ1eXBhc3Mubm8vY3J0L0JQQ2xhc3MzVDRDQTMuY2VyMA0GCSqGSIb3DQEBCwUAA4IBAQCP2XKHyeZaaQBC4vBLjojanPWguou4iJnbTVcS/PNwwJh+7lvOB6MF5x32ggh617uaramrHNf9G7OZsSS8GZgDWX9BN8xSTD4Zz+lQpclPb3mOkeZapWsYlwBeoLcSSKFS0ezESYtT+XdWcPD06/fg2TWgkCBPBxEsKjzIRVwn34kyfik1mKsVO2JubleXcQDLjhTJ4U82VYQNMMnn4+9ZZrFvlBBUIBfvOOlpMCel+TWvccCpzktygVSScXU0ZK+mj/apl39hWMi5lVrdxq1CI4nrFiJM1vnoqaTp8IzbJEI59Zj2PXFTDxxKkUAhG515ONmTtl6cHrKpWx5grczC</wsse:BinarySecurityToken>
            //                     <wsu:Timestamp wsu:Id="TS-8c06999e-5aad-421c-95fa-b885012e6899">
            //                         <wsu:Created>${created}</wsu:Created>
            //                         <wsu:Expires>${expires}</wsu:Expires>
            //                     </wsu:Timestamp>
            //                     <ds:Signature Id="SIG-fd7b8fd7-9271-463b-969d-37ecc1b3db3b" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
            //                         <ds:SignedInfo>
            //                             <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
            //                                 <ec:InclusiveNamespaces PrefixList="env" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            //                             </ds:CanonicalizationMethod>
            //                             <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
            //                             <ds:Reference URI="#id-1d7556d6-56c5-4cdf-a90a-54efc603094e">
            //                                 <ds:Transforms>
            //                                     <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            //                                 </ds:Transforms>
            //                                 <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            //                                 <ds:DigestValue>Dk0nJWAv9MFp6NaG38IC3Hgc05SWkKaZHpaqjfqB46s=</ds:DigestValue>
            //                             </ds:Reference>
            //                             <ds:Reference URI="#TS-8c06999e-5aad-421c-95fa-b885012e6899">
            //                                 <ds:Transforms>
            //                                     <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
            //                                         <ec:InclusiveNamespaces PrefixList="wsse env" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            //                                     </ds:Transform>
            //                                 </ds:Transforms>
            //                                 <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            //                                 <ds:DigestValue>fDdQ8UKGoz41299SuMBhr7kKuUiQM/BVrOmBoDLUCqc=</ds:DigestValue>
            //                             </ds:Reference>
            //                             <ds:Reference URI="#id-70201561-5037-40db-9fe7-1be465630be3">
            //                                 <ds:Transforms>
            //                                     <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            //                                 </ds:Transforms>
            //                                 <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            //                                 <ds:DigestValue>xO/x7v7MjWJUsa9HhZqDu4/6pVDWxcG206ImsASf8dc=</ds:DigestValue>
            //                             </ds:Reference>
            //                         </ds:SignedInfo>
            //                         <ds:SignatureValue>mtiHz+51Y4nQEmONhXHDSPNkjhWVjAOztgeonus8pKMqIMopRSGBvXUTl3wzxnbeJrzjIoDkCRlloLMofGj1ypPe9Vi1KQu0zPT24PreG5SCsQuCDE2hXYQ6ZWlGlxIbc4btSyvTFn30sCfYxsaJFvq+0XFVymT+XX7lMQgxlbThWte6NIPknvwrgX0TISNTCxVowK+Lo58m6DtBeCVtqG1mU/n/HdJq4PG0NZlk4VxFgXUJhpMaIrcy3zrLX8cxKkp7pFPQhZo2msWEXakRTCblvpV2ooTxa7ZUdpra3b7LppwKBh7x/qLG3sUoTgNbedwCFW1C3xsVDbidwS2WSw==</ds:SignatureValue>
            //                         <ds:KeyInfo Id="KI-ec46469a-e96f-4f75-8f11-110ad25dd5a9">
            //                             <wsse:SecurityTokenReference wsu:Id="STR-294fb9c5-278f-4770-b06d-f444f7c9edc8">
            //                                 <wsse:Reference URI="#X509-c454d6a8-2abc-4208-b4ea-42a41d5f58f3" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>
            //                             </wsse:SecurityTokenReference>
            //                         </ds:KeyInfo>
            //                     </ds:Signature>
            //                 </wsse:Security>
            //                 <eb:Messaging env:mustUnderstand="true" wsu:Id="id-70201561-5037-40db-9fe7-1be465630be3" xmlns:eb="http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
            //                     <ns6:SignalMessage xmlns:ns10="http://uri.etsi.org/2918/v1.2.1#" xmlns:ns11="http://uri.etsi.org/01903/v1.3.2#" xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns3="http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader" xmlns:ns4="http://www.w3.org/2003/05/soap-envelope" xmlns:ns5="http://www.w3.org/2000/09/xmldsig#" xmlns:ns6="http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/" xmlns:ns7="http://docs.oasis-open.org/ebxml-bp/ebbp-signals-2.0" xmlns:ns8="http://www.w3.org/1999/xlink" xmlns:ns9="http://begrep.difi.no/sdp/schema_v10">
            //                         <ns6:MessageInfo>
            //                             <ns6:Timestamp>2019-02-22T10:27:40.526+01:00</ns6:Timestamp>
            //                             <ns6:MessageId>5acaf734-4ee9-4e65-a51c-086263b2ec17</ns6:MessageId>
            //                             <ns6:RefToMessageId>83731a77-e18b-4f45-b79d-958ee70c8ea3</ns6:RefToMessageId>
            //                         </ns6:MessageInfo>
            //                         <ns6:Receipt>
            //                             <ns7:NonRepudiationInformation>
            //                                 <ns7:MessagePartNRInformation>
            //                                     <ns5:Reference URI="cid:ec0d8920-30a3-4f17-a958-fb8e7704a47f@meldingsformidler.sdp.difi.no">
            //                                         <ns5:Transforms>
            //                                             <ns5:Transform Algorithm="http://docs.oasis-open.org/wss/oasis-wss-SwAProfile-1.1#Attachment-Content-Signature-Transform"/>
            //                                         </ns5:Transforms>
            //                                         <ns5:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            //                                         <ns5:DigestValue>tdcsCJs+JKAkZg1Hqp+2+JI7GqezUEi2KzIG1TPi9LQ=</ns5:DigestValue>
            //                                     </ns5:Reference>
            //                                 </ns7:MessagePartNRInformation>
            //                                 <ns7:MessagePartNRInformation>
            //                                     <ns5:Reference URI="#soapBody">
            //                                         <ns5:Transforms>
            //                                             <ns5:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            //                                         </ns5:Transforms>
            //                                         <ns5:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            //                                         <ns5:DigestValue>rjrT+emKJ0Ex9OoI6j58Vr9IL3VZJ2dDMRPXGm4wkYo=</ns5:DigestValue>
            //                                     </ns5:Reference>
            //                                 </ns7:MessagePartNRInformation>
            //                             </ns7:NonRepudiationInformation>
            //                         </ns6:Receipt>
            //                     </ns6:SignalMessage>
            //                 </eb:Messaging>
            //             </env:Header>
            //             <env:Body wsu:Id="id-1d7556d6-56c5-4cdf-a90a-54efc603094e" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"/>
            //         </env:Envelope>`);
        });
    // })
}


module.exports = { receiveDPI };