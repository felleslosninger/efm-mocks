const moment = require('moment');
const uuidv1 = require('uuid/v1');

function StandardBusinessDocument(senderOrgNr, receiverOrgNr, meldingsType, forretningsMelding, prosess, senderRef, receiverRef){
    return {
        "standardBusinessDocumentHeader": {
            "headerVersion": "1.0",
            "sender": [
                {
                    "identifier": {
                        "value": `0192:${senderOrgNr}`,
                        "authority": "iso6523-actorid-upis"
                    },
                    "contactInformation": []
                }
            ],
            "receiver": [
                {
                    "identifier": {
                        "value": `0192:${receiverOrgNr}`,
                        "authority": "iso6523-actorid-upis"
                    },
                    "contactInformation": []
                }
            ],
            "documentIdentification": {
                "standard": `urn:no:difi:${meldingsType}:xsd::${forretningsMelding}`,
                "typeVersion": "2.0",
                "type": forretningsMelding,
                "creationDateAndTime": new moment()
            },
            "businessScope": {
                "scope": [
                    {
                        "type": "ConversationId",
                        "instanceIdentifier": senderRef,
                        "identifier": `urn:no:difi:profile:arkivmelding:${prosess}:ver1.0`,
                        "scopeInformation": [
                            {
                                "expectedResponseDateTime": new moment().add(2, 'hours')
                            }
                        ]
                    }
                ]
            }
        },
        "arkivmelding": {
            "sikkerhetsnivaa": 3
        }
    };
}


dpiSbd = (senderOrgNr, receiverOrgNr, meldingsType, forretningsMelding, prosess, senderRef, receiverRef) => {
    return {
        "standardBusinessDocumentHeader": {
            "headerVersion": "1.0",
            "sender": [
                {
                    "identifier": {
                        "value": `${senderOrgNr}`,
                        "authority": "iso6523-actorid-upis"
                    },
                    "contactInformation": []
                }
            ],
            "receiver": [
                {
                    "identifier": {
                        "value": `${receiverOrgNr}`,
                        "authority": "iso6523-actorid-upis"
                    },
                    "contactInformation": []
                }
            ],
            "documentIdentification": {
                "standard": `urn:no:difi:digitalpost:xsd:digital::digital`,
                "typeVersion": "2.0",
                "type": forretningsMelding,
                "creationDateAndTime": new moment()
            },
            "businessScope": {
                "scope": [
                    {
                        "type": "ConversationId",
                        "identifier": `urn:no:difi:profile:digitalpost:info:ver1.0`,
                        "scopeInformation": [
                            {
                                "expectedResponseDateTime": new moment().add(2, 'hours')
                            }
                        ]
                    }
                ]
            }
        },
        "digital": {
            "ikkeSensitivTittel": "tittel",
            "spraak": "NO",
            "primaerDokumentNavn": "test4.pdf",
            "sikkerhetsnivaa": 3,
            "digitalPostInfo": {
                "virkningsdato": new moment().add(2, 'hours'),
                "virkningstidspunkt": "",
                "aapningskvittering": "false"
            }
            ,
            "varsler": {
                "epostTekst":"Varseltekst",
                "smsTekst": "Varseltekst"
            }
        }
    };
};

dpiSbdFysisk = (senderOrgNr, receiverOrgNr, meldingsType, forretningsMelding, prosess, senderRef, receiverRef) => {
    return {
        "standardBusinessDocumentHeader": {
            "headerVersion": "1.0",
            "sender": [
                {
                    "identifier": {
                        "value": `${senderOrgNr}`,
                        "authority": "iso6523-actorid-upis"
                    },
                    "contactInformation": []
                }
            ],
            "receiver": [
                {
                    "identifier": {
                        "value": `${receiverOrgNr}`,
                        "authority": "iso6523-actorid-upis"
                    },
                    "contactInformation": []
                }
            ],
            "documentIdentification": {
                "standard": `urn:no:difi:digitalpost:xsd:fysisk::print`,
                "typeVersion": "2.0",
                "type": forretningsMelding,
                "creationDateAndTime": new moment()
            },
            "businessScope": {
                "scope": [
                    {
                        "type": "ConversationId",
                        "identifier": `urn:no:difi:profile:digitalpost:info:ver1.0`,
                        "scopeInformation": [
                            {
                                "expectedResponseDateTime": new moment().add(4, 'hours')
                            }
                        ]
                    }
                ]
            }
        },
        "print" : {
            "mottaker":{
                "navn": "Ola Nordmann",
                "adresselinje1": "",
                "adresselinje2": "Hentes fra capabilitylookup",
                "adresselinje3": "Hentes fra capabilitylookup",
                "adresselinje4": "Hentes fra capabilitylookup",
                "postnummer": "Hentes fra capabilitylookup",
                "poststed": "Hentes fra capabilitylookup",
                "landkode": "NO",
                "land": "Norge"
            },
            "utskriftsfarge" : "SORT_HVIT",
            "posttype": "B",
            "retur":{
                "mottaker":{
                    "navn": "Hentes fra capabilitylookup",
                    "adresselinje1": "Hentes fra capabilitylookup",
                    "adresselinje2": "Hentes fra capabilitylookup",
                    "adresselinje3": "Hentes fra capabilitylookup",
                    "adresselinje4": "Hentes fra capabilitylookup",
                    "postnummer": "Hentes fra capabilitylookup",
                    "poststed": "Hentes fra capabilitylookup",
                    "landkode": "NO",
                    "land": "Norge"
                },
                "returhaandtering": "DIREKTE_RETUR"
            }
        }
    };
};

dpeSbd = (senderOrgNr, receiverOrgNr, meldingsType) => {
    return {
        "standardBusinessDocumentHeader": {
            "headerVersion": "1.0",
            "sender": [
                {
                    "identifier": {
                        "value": `0192:${senderOrgNr}`,
                        "authority": "iso6523-actorid-upis"
                    },
                    "contactInformation": []
                }
            ],
            "receiver": [
                {
                    "identifier": {
                        "value": `0192:${receiverOrgNr}`,
                        "authority": "iso6523-actorid-upis"
                    },
                    "contactInformation": []
                }
            ],
            "documentIdentification": {
                "standard": `urn:no:difi:einnsyn:xsd::${meldingsType}`,
                "typeVersion": "2.0",
                "type": meldingsType,
                "creationDateAndTime": new moment()
            },
            "businessScope": {
                "scope": [
                    {
                        "type": "ConversationId",
                        "instanceIdentifier": uuidv1(),
                        "identifier": `urn:no:difi:profile:einnsyn:${meldingsType}:ver1.0`,
                        "scopeInformation": [
                            {
                                "expectedResponseDateTime": new moment().add(20, 'hours')
                            }
                        ]
                    }
                ]
            }
        },
        "innsynskrav": {
            "orgnr": receiverOrgNr,
            "epost": "test@example.com"
        }
    };
};


module.exports = { dpiSbd, StandardBusinessDocument, dpeSbd, dpiSbdFysisk };