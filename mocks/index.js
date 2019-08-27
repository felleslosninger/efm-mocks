const mocks = require('./src/mocks');
const restMocks = require('./src/RestMocks');
const soap = require('soap');
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const messageTable = require('./src/components/messageTable').messageTable;
const { deleteDirectoryRecursive } = require('./src/modules/helper');
const fs = require('fs');
const request = require('superagent');

process.env.DPI_HOST = process.env.DPI_HOST || 'localhost';
process.env.DPI_PORT = process.env.DPI_PORT || 8080;


/**
 * These global maps are used to hold incoming messages.
 * */
global.dpoDB = new Map();
global.dpfDB = new Map();
global.dpeDB = new Map();
global.dpvDB = new Map();

/**
 * The messageLog map is used as a message log.
 * It is similar to the global maps, but is not removed
 * when a message is being pulled by the IP so that we can
 * display all received messages in the frontend.
 * */

global.messageLog = new Map();
global.messageLog.set('dpe', []);
global.messageLog.set('dpf', []);
global.messageLog.set('dpv', []);
global.messageLog.set('dpo', []);

process.env.PORT = process.env.PORT || 8001;

let app = express();

app.use(bodyParser.json({limit: '100mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(express.static('static'));
app.use(morgan('combined'));

app.get('/', (req, res) => {

    /**
    * Set up headers for use in the frontend view of received messages.
    * */

    let headers = [
        {
            serviceIdentifier: 'dpf',
            headers:[
                {
                    title: 'Sender orgNum',
                    accessor: 'senderOrgNum',
                },
                {
                    title: 'Receiver orgNum',
                    accessor: 'receiverOrgNum',
                },
                {
                    title: 'Conversation ID',
                    accessor: 'conversationId',
                }
            ]
        },
        {
            serviceIdentifier: 'dpv',
            headers:[
                {
                    title: 'Sender orgnum',
                    accessor: 'senderOrgNum',
                },
                {
                    title: 'Receiver orgnum',
                    accessor: 'receiverOrgNum',
                },
                {
                    title: 'Conversation ID',
                    accessor: 'conversationId',
                }
            ]
        },
        {
            serviceIdentifier: 'dpo',
            headers: [
                {
                    title: 'Receiver',
                    accessor: 'receiver',
                },
                {
                    title: 'File Reference',
                    accessor: 'fileReference',
                },
                {
                    title: 'Recipt ID',
                    accessor: 'receiptId',
                }
            ]
        },
        {
            serviceIdentifier: 'dpe',
            headers: [
                {
                    title: 'Sender orgnum',
                    accessor: 'senderOrgNum',
                },
                {
                    title: 'Receiver orgnum',
                    accessor: 'receiverOrgNum',
                },
                {
                    title: 'Conversation ID',
                    accessor: 'conversationId',
                }
            ]
        },
        {
            serviceIdentifier: 'dpi',
            headers: [
                {
                    title: 'Receiver orgnum',
                    accessor: 'receiverOrgNum',
                },
                {
                    title: 'Sender orgnum',
                    accessor: 'senderOrgNum',
                },
                {
                    title: 'Conversation ID',
                    accessor: 'conversationId',
                }
            ]
        }
    ];

    res.send(`
            <html>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
                <link rel="stylesheet" href="styles.css">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
                
                <script>
                    // These variables are used in static/script.js
                    let headers = ${JSON.stringify(headers)};
                </script>
           
                <body>
                    <nav class="navbar fixed-top flex-md-nowrap shadow elma-navbar p-0" >
                        <div class="container-fluid mr-auto">
                            <div class="navbar-header">
                                <a class="elma-logo" >
                                    <img src="images/difi.jpg"/>
                                    <div class="logo-text">Move Mocks</div>
                                </a>
                            </div>
                        </div>
                    </nav>
                    <div class="container main-container">
                    
                        ${headers.map((header) => messageTable(header.headers, header.serviceIdentifier)).join('')}
                       
                   </div>
                </body>
                <script src="script.js"></script>
            </html>
    `);
});


/**
 * Deletes all files in a directory, but creates a .gitkeep file
 * so that the directory is kept in sourcecontrol.
 * */
function deleteFiles(directory){
    return new Promise((resolve, reject) => {
        deleteDirectoryRecursive(directory, false)
            .then(() => {
                fs.writeFile(`${directory}/.gitkeep`, "", (err) => {
                    if(err) {
                        reject(err)
                    }
                    resolve("The file was saved!")
                });
            }).catch((err) => {
                reject(err)
            })
    });
}

/**
 * Clears the message log from the dpi mock.
 * */
function deleteDPIMessageLog(){
    return new Promise((resolve, reject) => {
        request.delete(`http://${process.env.DPI_HOST}:${process.env.DPI_PORT}/api/messages/log`)
            .then((response) => {
                resolve();
            }).catch((err) => {
                console.log(err);
                reject();
            })
    })
}

/**
 * Deletes messages from the dpi mock.
 * */
function deleteDPIMessages(){
    return new Promise((resolve, reject) => {
        request.delete(`http://${process.env.DPI_HOST}:${process.env.DPI_PORT}/api/messages`)
            .then((response) => {
                resolve();
            }).catch((err) => {
            console.log(err);
            reject();
        })
    })
}


/**
 * Returns all messages on the message log.
 * Has a side effect in that it also gets the messages from the DPI mock.
 * */
app.get('/api/messages', (req, res) => {

    let returnMessages = [...global.messageLog].map((item) => {
        return {
            serviceIdentifier: item[0],
            messages: item[1]
        }
    });

    // get dpi messages:
    request.get(`http://${process.env.DPI_HOST}:${process.env.DPI_PORT}/api/messages/log`)
        .then((response) => {

            let dpiMessages = JSON.parse(response.text);
            returnMessages.push({
                serviceIdentifier: 'dpi',
                messages: dpiMessages
            });

            res.send(returnMessages);

        }).catch((err) => {
            console.log('DPI fetch messages failed!');
            console.log(err);
            // Return the other messages even though DPI fails.
            // TODO: Possibly include a message in the response to let frontend know DPI has failed.
            res.send(returnMessages);
    });
});

/**
 * Deletes messages and files for a given service identifier.
 * */
app.delete('/api/messages/:serviceIdentifier', (req, res) => {

    if ("DPV" === req.params.serviceIdentifier.toUpperCase()) {
        global.dpvDB = new Map();
        res.sendStatus(200);
    } else if ("DPI" === req.params.serviceIdentifier.toUpperCase()){
        deleteDPIMessages()
            .then(() => {
                res.sendStatus(200);
            }).catch(() => {
                res.sendStatus(500);
            })
    } else {
        deleteFiles(`./src/modules/${req.params.serviceIdentifier.toUpperCase()}/uploads`)
            .then(() => {
                res.sendStatus(200);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
        });
    }
});


/**
 * Clears the message log for the given service identifier.
 * */
app.delete('/api/messages/log/:serviceIdentifier', (req, res) => {
    global.dpfDB = new Map();

    if ("DPI" === req.params.serviceIdentifier.toUpperCase()){
        // TODO: delete from dpi mock
        deleteDPIMessageLog()
            .then(() => {
                res.sendStatus(200);
            }).catch(() => {
                res.sendStatus(500);
        })
    } else {
        global.messageLog.set(req.params.serviceIdentifier.toLowerCase(), []);
        res.sendStatus(200);
    }
});


app.get('/api/messages/DPF', (req, res) => {
    if (global.dpfDB.size > 0) {
        res.send([...global.dpfDB]
            .map(([key, value]) => {
                return value.map((entry) => {
                    return {
                        conversationId: entry.conversationId,
                        receiverOrgNum: entry.receiverOrgNum,
                        senderOrgNum: entry.senderOrgNum,
                        receiptId: entry.receiptId
                    }
                });
            })
            [0]);
    } else {
        res.send([]);
    }
});

app.get('/api/messages/dpe', (req, res) => {
    if (global.dpeDB.size > 0) {
        res.send([...global.dpeDB].map(([key, value]) => {
            return value.map((entry) => {
                return {
                    convId: entry.convId,
                    receiverOrgnum: entry.receiverOrgnum,
                    receiverOrgName: entry.receiverOrgName,
                    senderOrgnum: entry.senderOrgnum,
                    senderOrgname: entry.senderOrgname,
                    serviceIdentifier: entry.serviceIdentifier
                }
            });
        })[0]);
    } else {
        res.send([]);
    }
});

app.get('/api/messages/DPO', (req, res) => {
    if (global.dpoDB.size > 0) {
        res.send([Object.values(global.dpoDB)[0]]);
    } else {
        res.send([]);
    }
});

app.get('/api/messages/DPV', (req, res) => {
    if (global.dpvDB.size > 0) {
        res.send([...global.dpvDB].map(([key, value]) => value));
    } else {
        res.send([]);
    }
});

app.get('/api/messages/dpi', (req, res) => {
    request.get(`http://${process.env.DPI_HOST}:${process.env.DPI_PORT}/messages`)
        .then((response) => {
            res.send(JSON.parse(response.text))
        }).catch((err) => {
            console.log('DPI fetch messages failed!');
            console.log(err);
            res.status(500).send();
        })
});

// Set up REST mocks:
restMocks.forEach((mock) => {
    mock.routes
        .forEach((item) => {
            if (item.method === 'GET'){
                app.get(item.path, item.responseFunction)
            } else if (item.method === 'POST') {
                if (item.middleware){
                    app.post(item.path, item.middleware, item.responseFunction);
                } else {
                    app.post(item.path, item.responseFunction);
                }
            } else if (item.method === 'DELETE') {
                app.delete(item.path, item.responseFunction);
            }
    });
});


// Set up SOAP mocks:

// Fetch the WSDLs:
Promise.all(mocks.map((mock) => fetch(mock.wsdlUrl) ))
    .then((res) => {
        // Map the WSDL to the mock:
        Promise.all(res.map((res) => res.text()))
            .then((wsdls) => {
                wsdls.forEach((wsdl, idx) => {
                    mocks[idx].wsdl = wsdl;
                });
                app.listen(process.env.PORT, () => {
                    mocks.forEach((mock) => {
                        soap.listen(app, mock.pathName, mock.service, mock.wsdl);
                    })
                });
        });
});

let restString = restMocks.map((item) => item.routes)
    .reduce((accumulator, current) => accumulator.concat(current))
    .map((item) => `${item.method} http://localhost:${process.env.PORT}${item.path}`);

let soapString = mocks
    .map((item) => `http://localhost:${process.env.PORT}${item.pathName}?wsdl`);

console.log(`Mocks running on http://localhost:${process.env.PORT}`);
console.log('REST mocks: \n');
console.log(restString.join('\n'));
console.log("\n");
console.log('SOAP mocks: \n');
console.log(soapString.join('\n'));


module.exports = app;