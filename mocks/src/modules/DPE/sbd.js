const moment = require('moment');

const statusSbd = function (senderOrgNum, receiverOrgNum, conversationId) {
    return {
        "standardBusinessDocumentHeader": {
            "headerVersion": "1.0",
            "sender": [
                {
                    "identifier": {
                        "value": senderOrgNum,
                        "authority": "iso6523-actorid-upis"
                    },
                    "contactInformation": []
                }
            ],
            "receiver": [
                {
                    "identifier": {
                        "value": receiverOrgNum,
                        "authority": "iso6523-actorid-upis"
                    },
                    "contactInformation": []
                }
            ],
            "documentIdentification": {
                "standard": "urn:no:difi:eformidling:xsd::status",
                "typeVersion": "2.0",
                "instanceIdentifier": "72721bf0-0f0c-41c7-98d0-bc447bd8a5c6",
                "type": "status",
                "creationDateAndTime": new moment()
            },
            "businessScope": {
                "scope": [
                    {
                        "type": "ConversationId",
                        "instanceIdentifier": conversationId,
                        "identifier": "urn:no:difi:profile:einnsyn:response:ver1.0",
                        "scopeInformation": [
                            {
                                "expectedResponseDateTime": new moment().add(2, 'hours')
                            }
                        ]
                    }
                ]
            }
        },
        "status": {
            "status": "MOTTATT"
        }
    }
};

module.exports = { statusSbd };