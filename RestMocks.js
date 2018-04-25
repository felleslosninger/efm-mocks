const uid = require("uid");
const WSSecurityCert = require('soap').WSSecurityCert;
const hentNyeForsendelser = require('./testdata/hentNyeForsendelser')
const config = require('./config');


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

                    let referenceElements = req.body["env:envelope"]
                        ["env:header"]
                        .find(item => item["wsse:security"])
                        ['wsse:security']
                        [0]["ds:signature"]
                        [0]
                        ["ds:signedinfo"];

                    let timestamp = req.body["env:envelope"]
                        ["env:header"]
                        .find(item => item["eb:messaging"])["eb:messaging"][0]["eb:usermessage"][0]["eb:messageinfo"][0]
                        ["eb:timestamp"][0];

                    let publicKey = req.body["env:envelope"]
                        ["env:header"]
                        .find(item => item["wsse:security"])
                        ['wsse:security'][0]["wsse:binarysecuritytoken"][0]._;


                    let xml2js = require('xml2js');
                    let builder = new xml2js.Builder();
                    let parseString = require('xml2js').parseString;

                    let ws = require('ws.js')
                        , fs = require('fs')
                        , sec = ws.Security
                        , X509BinarySecurityToken = ws.X509BinarySecurityToken
                        , FileKeyInfo = require('xml-crypto').FileKeyInfo;

                    let x509 = new X509BinarySecurityToken(
                        { "key": `${fs.readFileSync("server.pem").toString()}
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

                    let request = "<Envelope xmlns='http://schemas.xmlsoap.org/soap/envelope/'>" +
                                    "<Header />" +
                                        "<Body>" +
                                        "</Body>" +
                                    "</Envelope>";

                    let ctx = {
                        request: request,
                        url: "http://localhost:7171/Service/signature",
                        action: "http://tempuri.org/IService/GetData",
                        contentType: "text/xml"
                    };

                    ws.send(handlers, ctx, (ctx) => {
                        parseString(ctx.request, (err, parsed) => {
                            parsed.Envelope.Header[0].Messaging = {};
                            parsed.Envelope.Header[0].Messaging.SignalMessage = {};
                            parsed.Envelope.Header[0].Messaging.SignalMessage.MessageInfo = {};
                            parsed.Envelope.Header[0].Messaging.SignalMessage.MessageInfo.Timestamp = timestamp;
                            parsed.Envelope.Header[0].Messaging.SignalMessage.MessageInfo.MessageId = uid(36);
                            parsed.Envelope.Header[0].Messaging.Receipt = {};
                            parsed.Envelope.Header[0].Messaging.Receipt.NonRepudiationInformation = [];
                            parsed.Envelope.Header[0].Messaging.Receipt.NonRepudiationInformation
                                .push(referenceElements[0]["ds:reference"]
                                    .map((element) => {
                                        MessagePartNRInformation : {
                                                Reference: element
                                            }
                                        }
                                    ));
                            let xml = builder.buildObject(parsed);
                            res.send(xml);
                        });
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