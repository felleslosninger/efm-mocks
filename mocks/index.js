const mocks = require('./src/mocks');
const restMocks = require('./src/RestMocks');
const soap = require('soap');
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const messageTable = require('./src/components/messageTable').messageTable;
const rimraf = require('rimraf');
const fs = require('fs');

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

let restString = restMocks.map((item) => item.routes)
    .reduce((accumulator, current) => accumulator.concat(current))
    .map((item) => `${item.method} http://localhost:${process.env.PORT}${item.path}`);

let soapString = mocks
    .map((item) => `http://localhost:${process.env.PORT}${item.pathName}?wsdl`);

app.get('/', (req, res) => {

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
            title: 'Receiver org name',
            accessor: 'receiverOrgName',
        },
        {
            title: 'Sender orgnum',
            accessor: 'senderOrgnum',
        },
        {
            title: 'Sender org name',
            accessor: 'senderOrgname',
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

    res.send(`
            <html>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
            <link rel="stylesheet" href="styles.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
            
            <script>
                // These variables are used in static/script.js
                let dpvHeaders = ${JSON.stringify(dpvHeaders)};
                let dpeHeaders = ${JSON.stringify(dpeHeaders)};
                let dpoHeaders = ${JSON.stringify(dpoHeaders)};
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
                
                    ${messageTable(dpoHeaders, 'DPF', global.dpfDB)}
                    
                    ${messageTable(dpoHeaders, 'DPO', global.dpoDB)}
                    
                    ${messageTable(dpvHeaders, 'DPV', global.dpvDB)}
                    
                    ${messageTable(dpeHeaders, 'DPE', global.dpeDB)}
                     
               </div>
                    </body>
                    <script src="script.js"></script>
            </html>
    `);
});

function deleteFiles(directory){
    return new Promise((resolve, reject) => {
        rimraf(`${directory}/*`, () => {
            console.log("Deleted files");
            fs.writeFile(`${directory}/.gitkeep`, "", (err) => {
                if(err) {
                    reject(err)
                }
                resolve("The file was saved!")
            });
        });
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

app.get('/api/messages/DPF', (req, res) => {
    if (global.dpfDB.size > 0) {
        res.send([...global.dpfDB].map(([key, value]) => value)[0]);
    } else {
        res.send([]);
    }

});

app.get('/api/messages/dpe', (req, res) => {
    if (global.dpeDB.size > 0) {
        res.send([...global.dpeDB].map(([key, value]) => {
            return {
                convId: value.convId,
                receiverOrgnum: value.receiverOrgnum,
                receiverOrgName: value.receiverOrgName,
                senderOrgnum: value.senderOrgnum,
                senderOrgname: value.senderOrgname,
                serviceIdentifier: value.serviceIdentifier
            }
        }));
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
        res.send([...global.dpvDB].map(([key, value]) => value)[0]);
    } else {
        res.send([]);
    }
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

console.log(`Mocks running on http://localhost:${process.env.PORT}`);
console.log('REST mocks: \n');
console.log(restString.join('\n'));
console.log("\n");
console.log('SOAP mocks: \n');
console.log(soapString.join('\n'));


module.exports = app;