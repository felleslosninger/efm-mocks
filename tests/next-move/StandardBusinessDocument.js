const moment = require('moment');

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

module.exports = { dpiSbd, StandardBusinessDocument };