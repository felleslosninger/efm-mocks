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
    }
    ,
    {
        name: "DPI",
        routes: [
            {
                path: '/dpi/*',
                method: 'POST',
                responseFunction: (req, res) => {
                    res.header("Content-Type", "application/soap+xml");
                    res.send('<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope"><env:Header><wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" env:mustUnderstand="true"><wsse:BinarySecurityToken EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" wsu:Id="X509-15a06669-e61c-4aae-8aab-be04905d22f7">MIIE9DCCA9ygAwIBAgILAT+iGF2ISezHpl4wDQYJKoZIhvcNAQELBQAwUTELMAkGA1UEBhMCTk8xHTAbBgNVBAoMFEJ1eXBhc3MgQVMtOTgzMTYzMzI3MSMwIQYDVQQDDBpCdXlwYXNzIENsYXNzIDMgVGVzdDQgQ0EgMzAeFw0xNzA0MjQwODM0NDZaFw0yMDA0MjQyMTU5MDBaMFoxCzAJBgNVBAYTAk5PMRgwFgYDVQQKDA9QT1NURU4gTk9SR0UgQVMxHTAbBgNVBAMMFFBPU1RFTiBOT1JHRSBBUyBURVNUMRIwEAYDVQQFEwk5ODQ2NjExODUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCiPsj+RRInXas3xedAYOAL4d3ZFxNOg1qT+emw7SeGBOd301yG3sFfZ61NUmPEznGLMMDGqhonSaXdMKBy8Ge44Lr6TNJ3RXQA7hbNm1QD0GUh7f8kblNEwDL7n9McuwG+itfXzzjF+GEgQUjriS8kdQ7M1R4brMvaZ4IvZQQYXtIUdz8A/IJPSSiw2JPCtdmZazhdcamhb4vq5qhHpQRKw4qNHiacp9tY14ZMQdMp5jdYcPCrKlBLJa7vKQF2qRIhQ77/ZBK7FuvqRCNy/M9ArSxxXmM85kk+n7FikQoSnTb54wEA/zYnzPKafDRQKT5yvO9jJBmMGog2bXEQuhGFAgMBAAGjggHCMIIBvjAJBgNVHRMEAjAAMB8GA1UdIwQYMBaAFD+u9XgLkqNwIDVfWvr3JKBSAfBBMB0GA1UdDgQWBBSPoMjenknBBiZxOLFafkGc1Y/wrzAOBgNVHQ8BAf8EBAMCBLAwFgYDVR0gBA8wDTALBglghEIBGgEAAwIwgbsGA1UdHwSBszCBsDA3oDWgM4YxaHR0cDovL2NybC50ZXN0NC5idXlwYXNzLm5vL2NybC9CUENsYXNzM1Q0Q0EzLmNybDB1oHOgcYZvbGRhcDovL2xkYXAudGVzdDQuYnV5cGFzcy5uby9kYz1CdXlwYXNzLGRjPU5PLENOPUJ1eXBhc3MlMjBDbGFzcyUyMDMlMjBUZXN0NCUyMENBJTIwMz9jZXJ0aWZpY2F0ZVJldm9jYXRpb25MaXN0MIGKBggrBgEFBQcBAQR+MHwwOwYIKwYBBQUHMAGGL2h0dHA6Ly9vY3NwLnRlc3Q0LmJ1eXBhc3Mubm8vb2NzcC9CUENsYXNzM1Q0Q0EzMD0GCCsGAQUFBzAChjFodHRwOi8vY3J0LnRlc3Q0LmJ1eXBhc3Mubm8vY3J0L0JQQ2xhc3MzVDRDQTMuY2VyMA0GCSqGSIb3DQEBCwUAA4IBAQCP2XKHyeZaaQBC4vBLjojanPWguou4iJnbTVcS/PNwwJh+7lvOB6MF5x32ggh617uaramrHNf9G7OZsSS8GZgDWX9BN8xSTD4Zz+lQpclPb3mOkeZapWsYlwBeoLcSSKFS0ezESYtT+XdWcPD06/fg2TWgkCBPBxEsKjzIRVwn34kyfik1mKsVO2JubleXcQDLjhTJ4U82VYQNMMnn4+9ZZrFvlBBUIBfvOOlpMCel+TWvccCpzktygVSScXU0ZK+mj/apl39hWMi5lVrdxq1CI4nrFiJM1vnoqaTp8IzbJEI59Zj2PXFTDxxKkUAhG515ONmTtl6cHrKpWx5grczC</wsse:BinarySecurityToken><wsu:Timestamp wsu:Id="TS-77a32cbb-c4c7-4074-a229-48aa11bb1dc2"><wsu:Created>2018-04-23T09:35:49.927Z</wsu:Created><wsu:Expires>2018-04-23T09:40:49.927Z</wsu:Expires></wsu:Timestamp><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="SIG-fc22184d-3e82-46a9-a0d2-6e9f1d0ea963"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"><ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="env"/></ds:CanonicalizationMethod><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference URI="#id-8ef1d317-0ea4-49e6-b420-ebb0e26d43db"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>lBSHqA/1pOayuo4/R40T07JS56zPxjLIm1K2krfKJiE=</ds:DigestValue></ds:Reference><ds:Reference URI="#TS-77a32cbb-c4c7-4074-a229-48aa11bb1dc2"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"><ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="wsse env"/></ds:Transform></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>7EDtV7WmjAnAK/MODN/zNbWuN0IcZyJdDcTFuQhx/Wc=</ds:DigestValue></ds:Reference><ds:Reference URI="#id-3e3ef405-0abe-4afd-a542-90a4aabbe6b1"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>wFA/9NMAFf5kgG9hq/wg9DdVQ29n3v9zcMQlv769Izc=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>BiRp035rpdt2pCzAfll/mc1oLJmRyMcsipIUuJAC70Hwb9rp+lMM1uSVOvBg92V0vGLKYyM6ii7ZWyO0TcieZoku6DJFxO3Ma+HVXXe2RnXpquYbRU6jKFWCLYQHVRx4K+bT+8TbvRsqdEeOqGxD5Znq/ILAomxG5j0yhzrCCep2ADJ42NOGJmTqoNVgyO+gij+zPWPHsa0NEBKra6y8J+0+/ZsyuB5KAJESF7wsgVQt5xK6edPAPP6f9fD8X4wg8eUtXx/08ZbJTe0DHT3kHzZzJH2eY3rV5KNQdvoxfOXf/HtYUhojeI8UegLRcXVNctOnLc5JHS+MVvdAiT9LyQ==</ds:SignatureValue><ds:KeyInfo Id="KI-b03b6685-0ab6-4431-a5fc-265a95ed122d"><wsse:SecurityTokenReference wsu:Id="STR-d7cc53a3-7823-4095-9849-5fdeda39c992"><wsse:Reference URI="#X509-15a06669-e61c-4aae-8aab-be04905d22f7" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/></wsse:SecurityTokenReference></ds:KeyInfo></ds:Signature></wsse:Security><eb:Messaging xmlns:eb="http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" env:mustUnderstand="true" wsu:Id="id-3e3ef405-0abe-4afd-a542-90a4aabbe6b1"><ns6:SignalMessage xmlns:ns10="http://uri.etsi.org/2918/v1.2.1#" xmlns:ns11="http://uri.etsi.org/01903/v1.3.2#" xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns3="http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader" xmlns:ns4="http://www.w3.org/2003/05/soap-envelope" xmlns:ns5="http://www.w3.org/2000/09/xmldsig#" xmlns:ns6="http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/" xmlns:ns7="http://docs.oasis-open.org/ebxml-bp/ebbp-signals-2.0" xmlns:ns8="http://www.w3.org/1999/xlink" xmlns:ns9="http://begrep.difi.no/sdp/schema_v10"><ns6:MessageInfo><ns6:Timestamp>2018-04-23T11:35:49.926+02:00</ns6:Timestamp><ns6:MessageId>70155b49-eabe-49e3-a58b-ff7e210c3deb</ns6:MessageId><ns6:RefToMessageId>0181add4-0eea-4c9b-b71e-36599d210705</ns6:RefToMessageId></ns6:MessageInfo><ns6:Receipt><ns7:NonRepudiationInformation><ns7:MessagePartNRInformation><ns5:Reference URI="cid:7e6e44ca-f872-433f-bec0-669e23ba11a0@meldingsformidler.sdp.difi.no"><ns5:Transforms><ns5:Transform Algorithm="http://docs.oasis-open.org/wss/oasis-wss-SwAProfile-1.1#Attachment-Content-Signature-Transform"/></ns5:Transforms><ns5:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ns5:DigestValue>1T3fve0vlz2QizScAFDNXRZGdjeBIs8wHmWqkAy20ZA=</ns5:DigestValue></ns5:Reference></ns7:MessagePartNRInformation><ns7:MessagePartNRInformation><ns5:Reference URI="#soapBody"><ns5:Transforms><ns5:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ns5:Transforms><ns5:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ns5:DigestValue>4Tya7QeOk3Q9fImwAgHy6z9+hlATwUc6uWVmjidTxAk=</ns5:DigestValue></ns5:Reference></ns7:MessagePartNRInformation></ns7:NonRepudiationInformation></ns6:Receipt></ns6:SignalMessage></eb:Messaging></env:Header><env:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="id-8ef1d317-0ea4-49e6-b420-ebb0e26d43db"/></env:Envelope>');
                }
            }
        ]
    }
];



module.exports = mocks;