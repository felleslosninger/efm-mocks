// const { statusSbd } = require("./sbd");

function recieveFile(req, res) {

    const payload = JSON.parse(req.rawBody);

    let convId = payload.sbd.standardBusinessDocumentHeader.businessScope.scope["0"].instanceIdentifier;
    let receiverOrgnum = payload.sbd.standardBusinessDocumentHeader.receiver["0"].identifier.value.split(":")[1];
    let senderOrgnum = payload.sbd.standardBusinessDocumentHeader.sender["0"].identifier.value.split(":")[1];
    let serviceIdentifier = payload.sbd.standardBusinessDocumentHeader.documentIdentification.standard;
    let messageId = payload.sbd.standardBusinessDocumentHeader.documentIdentification.instanceIdentifier;

    let dbMessage = {
        convId: convId,
        sbd: req.rawBody,
        receiverOrgnum: receiverOrgnum,
        senderOrgnum: senderOrgnum,
        serviceIdentifier: serviceIdentifier,
        locked: false
    };

    let logMessages = global.messageLog.get('dpe');

    logMessages.push({
        conversationId: convId,
        receiverOrgNum: receiverOrgnum,
        senderOrgNum: senderOrgnum
    });


    // We create
    let receiverMessages = global.dpeDB.get(receiverOrgnum);
    let senderMessages = global.dpeDB.get(senderOrgnum);

    if (receiverMessages) {
        receiverMessages.push(dbMessage);
    } else {
        global.dpeDB.set(receiverOrgnum, [dbMessage]);
    }

    res.status(200).send();
}

module.exports = {recieveFile};