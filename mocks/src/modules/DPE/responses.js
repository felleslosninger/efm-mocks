const makeid = require("../helper").makeid;
const { parseString } = require('xml2js');
const stripPrefix = require('xml2js').processors.stripPrefix;


function recieveFile(req, res){

    parseString(req.rawBody,
        {
            normalizeTags: true,
            tagNameProcessors: [ stripPrefix ]
        },
        (err, js) => {
            if(err) throw err;

            let convId = js.standardbusinessdocument.payload["0"].conversation["0"].conversationid["0"];
            let receiverOrgnum = js.standardbusinessdocument.payload["0"].conversation["0"].receiverid["0"];
            //
            // let receiverOrgName = js.standardbusinessdocument.payload["0"].conversation["0"].receivername["0"];
            //
            // let senderOrgnum = js.standardbusinessdocument.payload["0"].conversation["0"].senderid["0"];
            //
            // let senderOrgname = js.standardbusinessdocument.payload["0"].conversation["0"].sendername["0"];
            //
            // let serviceIdentifier = js.standardbusinessdocument.payload["0"].conversation["0"].serviceidentifier["0"];


            global.dpeDB.set(receiverOrgnum, {
                convId: convId,
                sbd: req.rawBody
                // fileName: fileName,
                // receiverOrgnum: receiverOrgnum,
                // receiverOrgName: receiverOrgName,
                // senderOrgnum: senderOrgnum,
                // senderOrgname: senderOrgname,
                // serviceIdentifier: serviceIdentifier
            });


            res.status(200).send();

        });
}


module.exports = { recieveFile };