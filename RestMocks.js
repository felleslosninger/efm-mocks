const hentNyeForsendelser = require('./testdata/hentNyeForsendelser')
const config = require('./config');

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
        name: "DPI",
        routes: [
            {
                path: '/dpi/*',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.send('DPI OK');
                }
            }
        ]
    }
];

module.exports = mocks;
