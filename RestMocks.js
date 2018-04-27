const recursiveKeySearch = require("./helper").recursiveKeySearch;
const uid = require("uid");
const WSSecurityCert = require('soap').WSSecurityCert;
const hentNyeForsendelser = require('./testdata/hentNyeForsendelser')
const config = require('./config');
const path = require('path');

const mocks = [
    {
        name: "KS SvarInn",
        routes: [
            {
                path: '/svarinn/mottaker/hentForsendelsefil/:forsendelseid',
                method: 'GET',
                responseFunction: (req, res) => {
                    // need stream?
                    res.download(`${__dirname}/testdata/${config.hentForsendelsefil}`)
                }
            },
            {
                path: '/svarinn/mottaker/hentNyeForsendelser',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.send(JSON.stringify(hentNyeForsendelser()));
                }
            },
            {
                path: '/svarinn/kvitterMottak/forsendelse/:forsendelseid',
                method: 'POST',
                responseFunction: (req, res) => {
                    console.log( req.params.forsendelseid);
                    res.send('Ok');
                }
            }
        ]
    },
    {
        name: "DPI",
        routes: [
            {
                path: '/dpi/*',
                method: 'POST',
                responseFunction: (req, res) => {

                    let splitted  = req.rawBody.split('------');
                    let regexp = /<env:Envelope(.*?)<\/env:Envelope>/g;

                    let xml2js = require('xml2js');
                    let builder = new xml2js.Builder({
                        headless: true,
                        xmldec : {'version': '1.2', 'encoding': 'UTF-8', 'standalone': false}
                         });
                    //            xmldec : {'version': '1.2', 'encoding': 'UTF-8', 'standalone': false}
                    let parseString = require('xml2js').parseString;

                  //  console.log(req.rawBody);

                    //console.log(req.rawBody.match(regexp)[0]);

                    // console.log('RECEIVED THIS:');
                    // console.log(splitted[1].match(regexp)[0]);

                    parseString(splitted[1].match(regexp)[0], (err, xml) => {
                        //console.log(JSON.stringify(xml, null, 2));

                        let messageId = recursiveKeySearch("ns6:MessageId",xml)[0][0];

                        //console.log('messageId', messageId);


                        let referenceElements = xml
                            ["env:Envelope"]
                            ["env:Header"]
                            .find(item => item["wsse:Security"])
                            ['wsse:Security']
                            [0]["ds:Signature"]
                            [0]["ds:SignedInfo"][0]["ds:Reference"];
                            // ["env:Envelope"]
                            // ["env:Header"]
                            // .find(item => item["wsse:Security"])
                            // ['wsse:Security']
                            // [0]["ds:Signature"]
                            // [0];

                        let timestamp = xml["env:Envelope"]
                            ["env:Header"]
                            .find(item => item["eb:Messaging"])
                            ["eb:Messaging"][0]["ns6:UserMessage"][0]["ns6:MessageInfo"][0]
                            ["ns6:Timestamp"][0];

                        let publicKey = xml["env:Envelope"]
                            ["env:Header"]
                            .find(item => item["wsse:Security"])
                            ['wsse:Security'][0]["wsse:BinarySecurityToken"][0]._;




                        let ws = require('ws.js')
                            , fs = require('fs')
                            , sec = ws.Security
                            , X509BinarySecurityToken = ws.X509BinarySecurityToken
                            , FileKeyInfo = require('xml-crypto').FileKeyInfo;

                        let x509 = new X509BinarySecurityToken(
                            { "key": `${fs.readFileSync(path.resolve(__dirname, 'server.pem')).toString()}
                        -----BEGIN CERTIFICATE-----
                        ${publicKey}
                        -----END CERTIFICATE-----`});

                        let signature = new ws.Signature(x509)

                        signature.addReference("//*[local-name(.)='Body']");
                        signature.addReference("//*[local-name(.)='Timestamp']");

                        sec = new ws.Security({}, [ x509, signature ]);

                        let handlers =  [
                            new ws.Addr("http://www.w3.org/2005/08/addressing")
                            , sec
                            , new ws.Http()
                        ];


                        const moment = require('moment');
                        let expire = new moment(timestamp).add(10, 'minutes').toISOString();;


                        let request = `<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
    <env:Header>
        <wsse:Security env:mustUnderstand="true" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
            <wsse:BinarySecurityToken EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" wsu:Id="X509-15a06669-e61c-4aae-8aab-be04905d22f7">MIIE9DCCA9ygAwIBAgILAT+iGF2ISezHpl4wDQYJKoZIhvcNAQELBQAwUTELMAkGA1UEBhMCTk8xHTAbBgNVBAoMFEJ1eXBhc3MgQVMtOTgzMTYzMzI3MSMwIQYDVQQDDBpCdXlwYXNzIENsYXNzIDMgVGVzdDQgQ0EgMzAeFw0xNzA0MjQwODM0NDZaFw0yMDA0MjQyMTU5MDBaMFoxCzAJBgNVBAYTAk5PMRgwFgYDVQQKDA9QT1NURU4gTk9SR0UgQVMxHTAbBgNVBAMMFFBPU1RFTiBOT1JHRSBBUyBURVNUMRIwEAYDVQQFEwk5ODQ2NjExODUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCiPsj+RRInXas3xedAYOAL4d3ZFxNOg1qT+emw7SeGBOd301yG3sFfZ61NUmPEznGLMMDGqhonSaXdMKBy8Ge44Lr6TNJ3RXQA7hbNm1QD0GUh7f8kblNEwDL7n9McuwG+itfXzzjF+GEgQUjriS8kdQ7M1R4brMvaZ4IvZQQYXtIUdz8A/IJPSSiw2JPCtdmZazhdcamhb4vq5qhHpQRKw4qNHiacp9tY14ZMQdMp5jdYcPCrKlBLJa7vKQF2qRIhQ77/ZBK7FuvqRCNy/M9ArSxxXmM85kk+n7FikQoSnTb54wEA/zYnzPKafDRQKT5yvO9jJBmMGog2bXEQuhGFAgMBAAGjggHCMIIBvjAJBgNVHRMEAjAAMB8GA1UdIwQYMBaAFD+u9XgLkqNwIDVfWvr3JKBSAfBBMB0GA1UdDgQWBBSPoMjenknBBiZxOLFafkGc1Y/wrzAOBgNVHQ8BAf8EBAMCBLAwFgYDVR0gBA8wDTALBglghEIBGgEAAwIwgbsGA1UdHwSBszCBsDA3oDWgM4YxaHR0cDovL2NybC50ZXN0NC5idXlwYXNzLm5vL2NybC9CUENsYXNzM1Q0Q0EzLmNybDB1oHOgcYZvbGRhcDovL2xkYXAudGVzdDQuYnV5cGFzcy5uby9kYz1CdXlwYXNzLGRjPU5PLENOPUJ1eXBhc3MlMjBDbGFzcyUyMDMlMjBUZXN0NCUyMENBJTIwMz9jZXJ0aWZpY2F0ZVJldm9jYXRpb25MaXN0MIGKBggrBgEFBQcBAQR+MHwwOwYIKwYBBQUHMAGGL2h0dHA6Ly9vY3NwLnRlc3Q0LmJ1eXBhc3Mubm8vb2NzcC9CUENsYXNzM1Q0Q0EzMD0GCCsGAQUFBzAChjFodHRwOi8vY3J0LnRlc3Q0LmJ1eXBhc3Mubm8vY3J0L0JQQ2xhc3MzVDRDQTMuY2VyMA0GCSqGSIb3DQEBCwUAA4IBAQCP2XKHyeZaaQBC4vBLjojanPWguou4iJnbTVcS/PNwwJh+7lvOB6MF5x32ggh617uaramrHNf9G7OZsSS8GZgDWX9BN8xSTD4Zz+lQpclPb3mOkeZapWsYlwBeoLcSSKFS0ezESYtT+XdWcPD06/fg2TWgkCBPBxEsKjzIRVwn34kyfik1mKsVO2JubleXcQDLjhTJ4U82VYQNMMnn4+9ZZrFvlBBUIBfvOOlpMCel+TWvccCpzktygVSScXU0ZK+mj/apl39hWMi5lVrdxq1CI4nrFiJM1vnoqaTp8IzbJEI59Zj2PXFTDxxKkUAhG515ONmTtl6cHrKpWx5grczC</wsse:BinarySecurityToken>
            <wsu:Timestamp wsu:Id="TS-77a32cbb-c4c7-4074-a229-48aa11bb1dc2">
                <wsu:Created>${timestamp}</wsu:Created>
                <wsu:Expires>${expire}</wsu:Expires>
            </wsu:Timestamp>
            <ds:Signature Id="SIG-fc22184d-3e82-46a9-a0d2-6e9f1d0ea963" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                <ds:SignedInfo>
                    <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
                        <ec:InclusiveNamespaces PrefixList="env" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/>
                    </ds:CanonicalizationMethod>
                    <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
                    <ds:Reference URI="#id-8ef1d317-0ea4-49e6-b420-ebb0e26d43db">
                        <ds:Transforms>
                            <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
                        </ds:Transforms>
                        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                        <ds:DigestValue>lBSHqA/1pOayuo4/R40T07JS56zPxjLIm1K2krfKJiE=</ds:DigestValue>
                    </ds:Reference>
                    <ds:Reference URI="#TS-77a32cbb-c4c7-4074-a229-48aa11bb1dc2">
                        <ds:Transforms>
                            <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
                                <ec:InclusiveNamespaces PrefixList="wsse env" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/>
                            </ds:Transform>
                        </ds:Transforms>
                        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                        <ds:DigestValue>7EDtV7WmjAnAK/MODN/zNbWuN0IcZyJdDcTFuQhx/Wc=</ds:DigestValue>
                    </ds:Reference>
                    <ds:Reference URI="#id-3e3ef405-0abe-4afd-a542-90a4aabbe6b1">
                        <ds:Transforms>
                            <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
                        </ds:Transforms>
                        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                        <ds:DigestValue>wFA/9NMAFf5kgG9hq/wg9DdVQ29n3v9zcMQlv769Izc=</ds:DigestValue>
                    </ds:Reference>
                </ds:SignedInfo>
                <ds:SignatureValue>BiRp035rpdt2pCzAfll/mc1oLJmRyMcsipIUuJAC70Hwb9rp+lMM1uSVOvBg92V0vGLKYyM6ii7ZWyO0TcieZoku6DJFxO3Ma+HVXXe2RnXpquYbRU6jKFWCLYQHVRx4K+bT+8TbvRsqdEeOqGxD5Znq/ILAomxG5j0yhzrCCep2ADJ42NOGJmTqoNVgyO+gij+zPWPHsa0NEBKra6y8J+0+/ZsyuB5KAJESF7wsgVQt5xK6edPAPP6f9fD8X4wg8eUtXx/08ZbJTe0DHT3kHzZzJH2eY3rV5KNQdvoxfOXf/HtYUhojeI8UegLRcXVNctOnLc5JHS+MVvdAiT9LyQ==</ds:SignatureValue>
                <ds:KeyInfo Id="KI-b03b6685-0ab6-4431-a5fc-265a95ed122d">
                    <wsse:SecurityTokenReference wsu:Id="STR-d7cc53a3-7823-4095-9849-5fdeda39c992">
                        <wsse:Reference URI="#X509-15a06669-e61c-4aae-8aab-be04905d22f7" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>
                    </wsse:SecurityTokenReference>
                </ds:KeyInfo>
            </ds:Signature>
        </wsse:Security>
        <eb:Messaging env:mustUnderstand="true" wsu:Id="id-3e3ef405-0abe-4afd-a542-90a4aabbe6b1" xmlns:eb="http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
            <ns6:SignalMessage xmlns:ns10="http://uri.etsi.org/2918/v1.2.1#" xmlns:ns11="http://uri.etsi.org/01903/v1.3.2#" xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns3="http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader" xmlns:ns4="http://www.w3.org/2003/05/soap-envelope" xmlns:ns5="http://www.w3.org/2000/09/xmldsig#" xmlns:ns6="http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/" xmlns:ns7="http://docs.oasis-open.org/ebxml-bp/ebbp-signals-2.0" xmlns:ns8="http://www.w3.org/1999/xlink" xmlns:ns9="http://begrep.difi.no/sdp/schema_v10">
                <ns6:MessageInfo>
                    <ns6:Timestamp>${timestamp}</ns6:Timestamp>
                    <ns6:MessageId>70155b49-eabe-49e3-a58b-ff7e210c3deb</ns6:MessageId>
                    <ns6:RefToMessageId>${messageId}</ns6:RefToMessageId>
                </ns6:MessageInfo>
                <ns6:Receipt>
                    <ns7:NonRepudiationInformation>
                        <ns7:MessagePartNRInformation>
                            <ns5:Reference URI="cid:7e6e44ca-f872-433f-bec0-669e23ba11a0@meldingsformidler.sdp.difi.no">
                                <ns5:Transforms>
                                    <ns5:Transform Algorithm="http://docs.oasis-open.org/wss/oasis-wss-SwAProfile-1.1#Attachment-Content-Signature-Transform"/>
                                </ns5:Transforms>
                                <ns5:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                                <ns5:DigestValue>1T3fve0vlz2QizScAFDNXRZGdjeBIs8wHmWqkAy20ZA=</ns5:DigestValue>
                            </ns5:Reference>
                        </ns7:MessagePartNRInformation>
                        <ns7:MessagePartNRInformation>
                            <ns5:Reference URI="#soapBody">
                                <ns5:Transforms>
                                    <ns5:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
                                </ns5:Transforms>
                                <ns5:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                                <ns5:DigestValue>4Tya7QeOk3Q9fImwAgHy6z9+hlATwUc6uWVmjidTxAk=</ns5:DigestValue>
                            </ns5:Reference>
                        </ns7:MessagePartNRInformation>
                    </ns7:NonRepudiationInformation>
                </ns6:Receipt>
            </ns6:SignalMessage>
        </eb:Messaging>
    </env:Header>
    <env:Body wsu:Id="id-8ef1d317-0ea4-49e6-b420-ebb0e26d43db" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"/>
</env:Envelope>`;

                        console.log(request);

                        res.setHeader('content-type', 'application/soap+xml');
                        res.send(request);

                        // let ctx = {
                        //     request: request,
                        //     url: "http://localhost:7171/Service/signature",
                        //     action: "http://tempuri.org/IService/GetData",
                        //     contentType: "text/xml"
                        // };

                        // ws.send(handlers, ctx, (ctx) => {
                        //     parseString(ctx.request, (err, parsed) => {
                        //       //   parsed.Envelope.Header[0]['eb:Messaging'] = { $: {} };
                        //       //   parsed.Envelope.Header[0]['eb:Messaging'].$['xmlns:eb'] = "http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/";
                        //       //  // console.log('parsed.Envelope.Header[0][\'eb:Messaging\'].$', parsed.Envelope.Header[0]['eb:Messaging'].$);
                        //       //
                        //       //   parsed.Envelope.Header[0]['eb:Messaging'].SignalMessage = {};
                        //       //   parsed.Envelope.Header[0]['eb:Messaging'].SignalMessage.MessageInfo = {};
                        //       //   parsed.Envelope.Header[0]['eb:Messaging'].SignalMessage.MessageInfo.Timestamp = timestamp;
                        //       //   parsed.Envelope.Header[0]['eb:Messaging'].SignalMessage.MessageInfo.MessageId = uid(36);
                        //       //   parsed.Envelope.Header[0]['eb:Messaging'].SignalMessage.MessageInfo.RefToMessageId = messageId;
                        //       //
                        //       //   parsed.Envelope.Header[0]['eb:Messaging'].Receipt = {};
                        //       //   parsed.Envelope.Header[0]['eb:Messaging'].Receipt.NonRepudiationInformation = [];
                        //       //   parsed.Envelope.Header[0]['eb:Messaging'].Receipt.NonRepudiationInformation
                        //       //       .push(referenceElements
                        //       //           .map((element) => {
                        //       //                   MessagePartNRInformation : {
                        //       //                       Reference: element
                        //       //                   }
                        //       //               }
                        //       //           ));
                        //       //
                        //       //   //xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                        //       //
                        //       //   parsed.Envelope["Header"][0]["wsse:Security"] = parsed.Envelope["Header"][0]["o:Security"];
                        //       //
                        //       //  // console.log('parsed.Envelope["Header"][0]["wsse:Security"].$', parsed.Envelope["Header"][0]["wsse:Security"]);
                        //       //
                        //       //   delete parsed.Envelope["Header"][0]["o:Security"];
                        //       //
                        //       //   parsed.Envelope["Header"][0]["wsse:Security"][0].$ = {};
                        //       //
                        //       //   parsed.Envelope["Header"][0]["wsse:Security"][0].$['xmlns:wsse'] = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd';
                        //       //
                        //       //
                        //       //
                        //       // //  parsed.Envelope.Header[0]['eb:Messaging'] = parsed.Envelope.Header[0]['eb:Messaging']
                        //       //
                        //       // //  console.log(JSON.stringify(parsed.Envelope.$.xmlns, null, 2));
                        //       //
                        //       //  //console.log(JSON.stringify(parsed.Envelope, null, 2));
                        //       //
                        //       //
                        //       //   parsed.Envelope.$.xmlns = "http://www.w3.org/2003/05/soap-envelope";
                        //
                        //         let xml = builder.buildObject(parsed);
                        //
                        //         console.log('sending this:');
                        //         console.log(xml);
                        //         res.setHeader('content-type', 'application/soap+xml');
                        //         res.send(xml);
                        //     });
                        // });

                    });

                }
            }
        ]
    },
    {
        name: "Logstash",
        routes: [
            {
                path: '/logstash/*',
                method: 'POST',
                responseFunction: (req, res) => {
                    res.send('Logged');
                }
            },
            {
                path: '/logstash/*',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.send('Logged');
                }
            }
        ]
    }
];

module.exports = mocks;