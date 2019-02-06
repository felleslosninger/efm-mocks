let bestedu = require('./bestedusender.js');
const path = require('path');

const mocks = [
    {
        name: "P360",
        pathName: '/p360',
        wsdlUrl:  path.join('wsdl', 'p360.wsdl'),
        service: {
            EDUImportService: {
                BasicHttpBinding_IEDUImport: {                    
                    GetCanReceiveMessage : function(args) {

                        bestedu.getCanReceive(args.receiver.orgnr);

                        return {
                            result : "true"
                        };
                    },
                    PutMessage : (args) => {

                        let id = bestedu.getId();
                        let message = bestedu.getMessage(args.payload);
                        //check if message is of type Message or AppReceipt. If Message send AppReceipt, else return result

                        bestedu.sendAppReceipt(args, id);

                        return {
                            result : 
                                {
                                    attributes: { type: 'OK' } ,
                                    message: {
                                        attributes: { code: 'ID' },
                                        text: id
                                }}
                        };
                    }
                }
            }
        }
    }
];

module.exports = mocks;
