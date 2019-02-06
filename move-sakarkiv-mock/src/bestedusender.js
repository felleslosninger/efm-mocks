let soap = require('soap');
let url = 'http://localhost:9093/noarkExchange?wsdl';

module.exports = {


    getCanReceive: (receiverOrgnr) =>  {

        let args = { receiver: { orgnr: receiverOrgnr } };
        soap.createClient(url, (err, client) => {
            client.GetCanReceiveMessage(args, (err, result) => {
                console.log(result);
            });
        });
    },

    sendAppReceipt: function (receivedMesssage, id) {
        let args = {
            envelope: {
                attributes: { conversationId: receivedMesssage.envelope.attributes.conversationId },
                sender: {
                    orgnr: receivedMesssage.envelope.sender.orgnr,
                    ref: receivedMesssage.envelope.sender.ref
                },
                receiver: {
                    orgnr: receivedMesssage.envelope.receiver.orgnr,
                    ref: receivedMesssage.envelope.receiver.ref
                }
            },            
            payload: getAppReceiptPayload(id)
        };
        soap.createClient(url, (err, client) => {
            if (err){
                console.error(err);
            } else {
                client.GetCanReceiveMessage(args, (err, result) => {
                    console.log(result);
                });
            }
        });
    },

    getId: function () {
        let min = Math.ceil(1);
        let max = Math.floor(100000);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getMessage: function (xml) {
        let parseString = require('xml2js').parseString;
        parseString(xml.toString(), {trim: true}, function (err, result) {
            return result;
        });
    }
};

function getAppReceiptPayload(id) {
    let xml = "<AppReceipt type=\"OK\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://www.arkivverket.no/Noark/Exchange/types\"><message code=\"ID\" xmlns=\"\"><text>" + id + "</text></message></AppReceipt>";
    return xml;
}