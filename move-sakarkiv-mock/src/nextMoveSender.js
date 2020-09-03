const superagent = require('superagent');
const request = require('request');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
let fileName = 'test.pdf';

function sendFile(fileName, messageId){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, fileName))
            .pipe(request({
                url: `${process.env.IP_URL}/api/messages/out/${messageId}?title=${fileName}`,
                method: 'PUT',
                headers: {
                    'content-disposition': 'attachment; filename=' + fileName,
                    'content-type' : 'application/json'
                },
                encoding: null
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response)
                }
            }))
    })
}

function getFilesize(filesize) {
    if (filesize.includes("kb")) {
        let kbCount = parseInt(filesize) / 1000;
        return Math.round(1024*1024*kbCount);
    } else if(filesize.includes("mb")) {
        let mbCount = parseInt(filesize);
        return 1024*1024*mbCount;
    }
}

async function sendLargeMessage(sbd) {

    return new Promise(async (resolve, reject) => {
        try {
            let res = await superagent
                .post(`${process.env.IP_URL}/api/messages/out`)
                .set('Content-Type', 'application/json')
                .send(sbd);

            let messageId = res.body.standardBusinessDocumentHeader.documentIdentification.instanceIdentifier;

            let messageType = res.body.standardBusinessDocumentHeader.documentIdentification.type;
            console.log(`Conversation created: ${process.env.IP_URL}/api/conversations/messageId/${messageId}`);

            let sendFileRes = await sendFile( fileName, messageId);

            console.log(`Attachment uploaded: ${fileName}`);
            let uploadedFilename;
            if(messageType==='arkivmelding')
            {
                uploadedFilename='arkivmelding.xml';
                let sendArchiveRes = await sendFile(uploadedFilename, messageId);
            }
            if(messageType==='innsynskrav'){
                uploadedFilename='order.xml'
                let sendOrderRes = await sendFile(uploadedFilename, messageId);
                let sendemailtextRes = await sendFile('emailtext', messageId);
            }

            //let sendArchiveRes = await sendFile('arkivmelding.xml', messageId);

            console.log(uploadedFilename + ` uploaded.`);

            let sendRes = await superagent
                .post( `${process.env.IP_URL}/api/messages/out/${messageId}`)
            if (sendRes) resolve(messageId);

        } catch(err) {
            reject(err);
        }
    })
}

function sendNextMoveMessage(payload){
    return new Promise(async (resolve, reject) => {

        let fileSize = getFilesize('200kb');

        crypto.randomBytes(fileSize, (err, buffer) => {

            if (err) {
                reject(err);
            } else {
                fs.writeFile(path.join(__dirname, fileName), buffer, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err)
                    } else {

                        console.time("totalTime");

                        sendLargeMessage(payload).then((messageId) => {

                            console.timeEnd("totalTime");

                            resolve(messageId);

                            fs.unlink(path.join(__dirname, fileName), (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Messages sent, file deleted");
                                    console.log(`Attachment file size was: ${fileSize}.`);
                                }
                            })
                        }).catch((err) => {
                            console.log(err);
                            reject(err);
                        });
                    }
                });
            }
        });
    })
}

module.exports = { sendNextMoveMessage };