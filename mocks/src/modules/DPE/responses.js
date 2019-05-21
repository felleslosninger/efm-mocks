
function recieveFile(req, res){

    const payload = JSON.parse(req.rawBody);

    let convId = payload.sbd.standardBusinessDocumentHeader.businessScope.scope["0"].instanceIdentifier;
    let receiverOrgnum = payload.sbd.standardBusinessDocumentHeader.receiver["0"].identifier.value;
    let senderOrgnum = payload.sbd.standardBusinessDocumentHeader.sender["0"].identifier.value;
    let serviceIdentifier = payload.sbd.standardBusinessDocumentHeader.documentIdentification.standard;

    let dbMessage = {
        convId: convId,
        sbd: req.rawBody,
        receiverOrgnum: receiverOrgnum,
        senderOrgnum: senderOrgnum,
        serviceIdentifier: serviceIdentifier
    };

    let messages = global.dpeDB.get(receiverOrgnum);

    if (messages){
        messages.push(dbMessage);
    } else {
        global.dpeDB.set(receiverOrgnum, [ dbMessage ]);
    }

    res.status(200).send();
}

module.exports = { recieveFile };