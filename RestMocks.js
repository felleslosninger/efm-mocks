const hentNyeForsendelser = require('./testdata/hentNyeForsendelser')
const config = require('./config');
const { receiveDPV }  = require("./modules/DPV/DPV");

const mocks = [
    {
        name: "KS SvarInn",
        routes: [
            {
                path: '/svarinn/mottaker/hentForsendelsefil/:forsendelseid',
                method: 'GET',
                responseFunction: (req, res) => {
                    // need stream?
                    res.download(`${__dirname}/testdata/${config.hentForsendelsefil}`)
                }
            },
            {
                path: '/svarinn/mottaker/hentNyeForsendelser',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.send(JSON.stringify(hentNyeForsendelser()));
                }
            },
            {
                path: '/svarinn/kvitterMottak/forsendelse/:forsendelseid',
                method: 'POST',
                responseFunction: (req, res) => {
                    console.log( req.params.forsendelseid);
                    res.send('Ok');
                }
            }
        ]
    },
    {
        name: 'DPV',
        routes: [
            {
                path: '/dpv/*',
                method: 'POST',
                responseFunction: receiveDPV
            }
        ]
    },
    {
        name: "Logstash",
        routes: [
            {
                path: '/logstash/*',
                method: 'POST',
                responseFunction: (req, res) => {
                    res.send('Logged');
                }
            },
            {
                path: '/logstash/*',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.send('Logged');
                }
            }
        ]
    }
];

module.exports = mocks;