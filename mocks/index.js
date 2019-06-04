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

global.dpoDB = new Map();
global.dpfDB = new Map();
global.dpeDB = new Map();
global.dpvDB = new Map();

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

    let dpfHeaders = [
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
        },
        {
            title: 'Receipt ID',
            accessor: 'receiptId'
        }
    ];

    let dpvHeaders = [
        {
            title: 'Senders Reference',
            accessor: 'sendersReference',
        },
        {
            title: 'Reportee',
            accessor: 'reportee',
        },
        {
            title: 'Created',
            accessor: 'created',
        },
        {
            title: 'Receipt ID',
            accessor: 'receiptId'
        }
    ];

    let dpoHeaders = [
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
    ];

    let dpeHeaders = [
        {
            title: 'Receiver orgnum',
            accessor: 'receiverOrgnum',
        },
        {
            title: 'Sender orgnum',
            accessor: 'senderOrgnum',
        },
        {
            title: 'Conversation ID',
            accessor: 'convId',
        },
        {
            title: 'Type',
            accessor: 'serviceIdentifier',
        }
    ];

    let dpiHeaders = [
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
        },
        {
            title: 'Message ID',
            accessor: 'messageId',
        }
    ];

    res.send(`
            <html>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
                <link rel="stylesheet" href="styles.css">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
                
                <script>
                    // These variables are used in static/script.js
                    let dpfHeaders = ${JSON.stringify(dpfHeaders)};
                    let dpvHeaders = ${JSON.stringify(dpvHeaders)};
                    let dpeHeaders = ${JSON.stringify(dpeHeaders)};
                    let dpoHeaders = ${JSON.stringify(dpoHeaders)};
                    let dpiHeaders = ${JSON.stringify(dpiHeaders)};
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
                    
                        ${messageTable(dpfHeaders, 'DPF', global.dpfDB)}
                        
                        ${messageTable(dpoHeaders, 'DPO', global.dpoDB)}
                        
                        ${messageTable(dpvHeaders, 'DPV', global.dpvDB)}
                        
                        ${messageTable(dpeHeaders, 'DPE', global.dpeDB)}
                        
                        ${messageTable(dpiHeaders, 'DPI', [])}
                      
                   </div>
                </body>
                <script src="script.js"></script>
            </html>
    `);
});

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

app.post('/api/messages/DPF', (req, res) => {
    global.dpfDB = new Map();
    deleteFiles('./src/modules/DPF/uploads')
        .then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500)
        })
});

app.post('/api/messages/DPO', (req, res) => {
    global.dpoDB = new Map();
    deleteFiles('./src/modules/DPO/uploads')
        .then(() => {
            res.sendStatus(200);
        }).catch((err) => {
        console.log(err);
        res.sendStatus(500)
    })
});

app.post('/api/messages/DPV', (req, res) => {
    global.dpvDB = new Map();
    res.sendStatus(200);
});

app.post('/api/messages/DPE', (req, res) => {
    global.dpeDB = new Map();
    deleteFiles('./src/modules/DPE/uploads')
        .then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
});

app.post('/api/messages/dpi', (req, res) => {
    request.delete(`http://${process.env.DPI_HOST}:${process.env.DPI_PORT}/messages`)
        .then((response) => {
            res.set(200).send();
        }).catch((err) => {
        res.status(500).send();
    })
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
        res.send([...global.dpoDB].map(([key, value]) => value)[0]);
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
            console.log('\n\n\n\n\n\n\n');

            console.log('DPI fetch messages failed!');
            console.log(err);

            console.log('\n\n\n\n\n\n\n');

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