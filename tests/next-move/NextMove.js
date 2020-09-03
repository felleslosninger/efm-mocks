const superagent = require('superagent');
const {StandardBusinessDocument, dpiSbd, dpeInnsynSbd, dpiSbdFysisk, dpiSbdDigitalDpv, dpeJournSbd} = require('./StandardBusinessDocument');
const path = require('path');
const fs = require('fs');
const request = require('request');
const ipUrl = 'http://localhost:9093';
const endpoint = 'api/messages/out';
const program = require('commander');
const crypto = require('crypto');
const express = require('express');
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser');
const batchSize = 100;

program
    .version('0.1.0')
    .option('-s --filesize <size>', 'Size of files to send. User either kb or mb, eg: 200kb or 5mb.', '200kb')
    .option('dpi [count]', 'Send the specified number of dpi messages.')
    .option('dpiprint [count]', 'Send the specified number of dpiprint messages.')
    .option('digitaldpv [count]', 'Send the specified number of digitaldpv messages.')
    .option('dpe [count]', 'Send the specified number of dpe messages.')
    .option('dpejourn [count]', 'Send the specified number of dpejourn messages.')
    .option('dpo [count]', 'Send the specified number of dpo messages.')
    .option('dpf [count]', 'Send the specified number of dpf messages.')
    .option('dpv [count]', 'Send the specified number of dpv messages.')
    .parse(process.argv);

let fileSize;
let fileName = 'test.pdf';
let messages = {};
let webhookId;

console.time("totalTime");

if (program.filesize.includes("kb")) {
    let kbCount = parseInt(program.filesize) / 1000;
    fileSize = Math.round(1024 * 1024 * kbCount);
} else if (program.filesize.includes("mb")) {
    let mbCount = parseInt(program.filesize);
    fileSize = 1024 * 1024 * mbCount;
} else {
    console.log("You have entered an invalid value for file size.");
    console.log("Please enter like 200kb or 5mb.");
    process.exit(1);
}

let runAll = !program.dpiprint && !program.dpi && !program.dpe && !program.dpo && !program.dpf && !program.dpv && !program.digitaldpv && !program.dpejourn;


let app = express();
let sentCount = 0;

app.use(bodyParser.json({limit: '100mb', extended: true}));

app.post("/incoming", (req, res) => {

    if (req.body.event === 'ping') {
        console.log("ping");
        res.status(200).send();
    } else if (req.body.event === 'status') {

        if (messages[req.body.messageId]) {

            if (req.body.status === "SENDT") {
                delete messages[req.body.messageId];
                console.log(req.body.messageId + " " + req.body.status + " - Messages sent: " + (++sentCount));
            } else {
                console.log(req.body.messageId + " " + req.body.status);
            }

            if (!Object.keys(messages).length) {
                console.log("All messages sent.");
                console.timeEnd("totalTime");
                res.status(200).send();
                if (webhookId) {
                    removeWebHook(webhookId).then(() => process.exit(0))
                        .catch(() => {
                            console.log("Couldn't remove webhook");
                            process.exit(0)
                        });
                }
            }
        }

        res.status(200).send();
    }
});

app.listen(3001);

function registerWebHook() {
    return new Promise((resolve, reject) => {
        superagent
            .post(`${ipUrl}/api/subscriptions`)
            .send({
                "name": "MOVE mocks",
                "pushEndpoint": "http://localhost:3001/incoming",
                "resource": "all",
                "event": "status"
            }).then((res) => {
            console.log(res.body.id);
            resolve(res.body.id)
        }).catch((err) => {
            if (err.status === 400 && err.response.body.exception === 'no.difi.meldingsutveksling.exceptions.SubscriptionWithSameNameAndPushEndpointAlreadyExists') {
                resolve(-1)
            } else {
                reject(err);
            }
        });
    });
}

function removeWebHook(id) {
    webhookId = undefined;
    return new Promise((resolve, reject) => {
            if (id === -1) {
                resolve(id);
            } else {
                superagent
                    .delete(`${ipUrl}/api/subscriptions/${id}`)
                    .then((res) => {
                        resolve(id)
                    }).catch((err) => {
                    reject(err);
                });
            }
        }
    );
}

function sendFile(fileName, messageId) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, fileName))
            .pipe(request({
                url: `${ipUrl}/${endpoint}/${messageId}?title=${fileName}`,
                method: 'PUT',
                headers: {
                    'content-disposition': 'attachment; filename=' + fileName,
                    'content-type': 'application/json'
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

async function sendLargeMessage(sbd) {
    let messageId = sbd.standardBusinessDocumentHeader.documentIdentification.instanceIdentifier;
    let messageType = sbd.standardBusinessDocumentHeader.documentIdentification.type;
    messages[messageId] = true;

    return new Promise(async (resolve, reject) => {
        try {
            let res = await superagent
                .post(`${ipUrl}/${endpoint}`)
                .send(sbd);

            if (res.statusCode !== 200) {
                reject(res);
            }

            let sendFileRes = await sendFile(fileName, messageId);

            console.log(messageId + ` Attachment uploaded: ${fileName}`);

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

            console.log(messageId + ` ` + uploadedFilename + `  uploaded.`);

            let sendRes = await superagent
                .post(`${ipUrl}/${endpoint}/${messageId}`);
            if (sendRes) resolve(messageId);

        } catch (err) {
            reject(err);
        }
    })
}

function getRequests(requestNum, sbdFunction, ...sbdParameters) {
    let requests = [];

    for (let i = 0; i < requestNum; i++) {
        requests.push(sendLargeMessage(sbdFunction(...sbdParameters)))
    }
    return requests;
}


function sendMessagesForServiceIdentifier(serviceIdentifier, requests) {

    console.time(serviceIdentifier);

    return new Promise((resolve, reject) => {
        Promise.all(requests).then(() => {
            console.log(`Sent ${requests.length} ${serviceIdentifier} messages.`);
            console.timeEnd(serviceIdentifier);
            resolve();
        }).catch((err) => {
            reject(err);
        });
    })
}

async function sendAllMessages() {

    return new Promise(async (resolve, reject) => {

        try {
            webhookId = await registerWebHook();
        } catch (err) {
            console.log(err);
            console.log("Could not register webhook.");
            process.exit(1);
        }

        console.log("Webhook registerd");

        if (program.dpo || runAll) {
            try {
                let totalRequests = program.dpo && program.dpo.length ? parseInt(program.dpo) : 1;

                for (let requestsLeft = totalRequests; requestsLeft > 0; requestsLeft -= batchSize) {
                    await sendMessagesForServiceIdentifier("DPO", getRequests(Math.min(requestsLeft, batchSize), StandardBusinessDocument, 910075918, 910075918, 'arkivmelding', 'arkivmelding', 'administrasjon'));
                }
            } catch (err) {
                reject(err);
            }
        }

        if (program.dpv || runAll) {
            try {
                let totalRequests = program.dpv && program.dpv.length ? parseInt(program.dpv) : 1;

                for (let requestsLeft = totalRequests; requestsLeft > 0; requestsLeft -= batchSize) {
                    await sendMessagesForServiceIdentifier("DPV", getRequests(Math.min(requestsLeft, batchSize), StandardBusinessDocument, 984661185, 910075918, 'arkivmelding', 'arkivmelding', 'helseSosialOgOmsorg'));
                }
            } catch (err) {
                if (webhookId) await removeWebHook(webhookId);
                reject(err);
            }
        }

        if (program.dpf || runAll) {
            try {
                let totalRequests = program.dpf && program.dpf.length ? parseInt(program.dpf) : 1;

                for (let requestsLeft = totalRequests; requestsLeft > 0; requestsLeft -= batchSize) {
                    await sendMessagesForServiceIdentifier("DPF", getRequests(Math.min(requestsLeft, batchSize), StandardBusinessDocument, 910075918, 910075918, 'arkivmelding', 'arkivmelding', 'planByggOgGeodata'));
                }
            } catch (err) {
                if (webhookId) await removeWebHook(webhookId);
                reject(err);
            }
        }

        if (program.dpi || runAll) {
            try {
                let totalRequests = program.dpi && program.dpi.length ? parseInt(program.dpi) : 1;

                for (let requestsLeft = totalRequests; requestsLeft > 0; requestsLeft -= batchSize) {
                    await sendMessagesForServiceIdentifier("DPI", getRequests(Math.min(requestsLeft, batchSize), dpiSbd, `0192:910075918`, "06068700602", 'digital', 'digital'));
                }
            } catch (err) {
                if (webhookId) await removeWebHook(webhookId);
                reject(err);
            }
        }

        if (program.dpe || runAll) {
            try {
                let totalRequests = program.dpe && program.dpe.length ? parseInt(program.dpe) : 1;

                for (let requestsLeft = totalRequests; requestsLeft > 0; requestsLeft -= batchSize) {
                    await sendMessagesForServiceIdentifier("DPE", getRequests(Math.min(requestsLeft, batchSize), dpeInnsynSbd, 910075918, 910076787, "innsynskrav"));
                }
            } catch (err) {

                if (webhookId) await removeWebHook(webhookId);
                reject(err);
            }
        }

        if (program.dpejourn || runAll) {
            try {
                let totalRequests = program.dpejourn && program.dpejourn.length ? parseInt(program.dpejourn) : 1;

                for (let requestsLeft = totalRequests; requestsLeft > 0; requestsLeft -= batchSize) {
                    await sendMessagesForServiceIdentifier("DPE Journal", getRequests(Math.min(requestsLeft, batchSize), dpeJournSbd, 910075918, 810074582));
                }
            } catch (err) {
                if (webhookId) await removeWebHook(webhookId);
                reject(err);

            }
        }

        if (program.dpiprint || runAll) {
            try {
                let totalRequests = program.dpiprint && program.dpiprint.length ? parseInt(program.dpiprint) : 1;

                for (let requestsLeft = totalRequests; requestsLeft > 0; requestsLeft -= batchSize) {
                    await sendMessagesForServiceIdentifier("DPI Print", getRequests(Math.min(requestsLeft, batchSize), dpiSbdFysisk, `0192:910075918`, "06068700602"));
                }
            } catch (err) {
                if (webhookId) await removeWebHook(webhookId);
                reject(err);
            }
        }

        if (program.digitaldpv || runAll) {
            try {
                let totalRequests = program.digitaldpv && program.digitaldpv.length ? parseInt(program.digitaldpv) : 1;

                for (let requestsLeft = totalRequests; requestsLeft > 0; requestsLeft -= batchSize) {
                    await sendMessagesForServiceIdentifier("DPI Digital DPV", getRequests(Math.min(requestsLeft, batchSize), dpiSbdDigitalDpv, `0192:910075918`, "10068700602"));
                }
            } catch (err) {
                if (webhookId) await removeWebHook(webhookId);
                reject(err);
            }
        }

        resolve();
    });
}

function createAttachment() {
    return new Promise((resolve, reject) => {

        let writeStream = fs.createWriteStream(path.join(__dirname, fileName), {flags: 'w'});
        writeStream.on('finish', function () {
            resolve();
        });

        let chunkSize = Math.min(fileSize, 64 * 1024);
        let bytesLeft = fileSize;

        while (bytesLeft > 0) {
            let buffer = crypto.randomBytes(Math.min(bytesLeft, chunkSize));
            writeStream.write(buffer);
            bytesLeft -= chunkSize;
        }

        writeStream.end();
    });
}

createAttachment().then(function () {
    console.time("totalTime");
    console.log("Starting to send messages");

    sendAllMessages().then(() => {

        // console.timeEnd("totalTime");
        fs.unlink(fileName, (err) => {
            if (err) {
                console.log(err);
                process.exit(1);
            } else {
                console.log("Messages sent, file deleted");
                console.log(`Attachment file size was: ${program.filesize}.`);
                // process.exit(0);
            }
        })
    }).catch((err) => {
        console.log("Error catched", err);
        // console.log(JSON.stringify(JSON.parse(err.response.text), null, 2));
        // Need to delete webhook here.
        process.exit(1);
    });
});
