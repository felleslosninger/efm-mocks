const mocks = [
    {
        name: "KS SvarInn",
        routes: [
            {
                path: '/svarinn/mottaker/hentForsendelsefil',
                method: 'POST',
                responseFunction: (req, res) => {
                    res.send('hentForsendelsefil');
                }
            },
            {
                path: '/svarinn/mottaker/hentNyeForsendelser',
                method: 'GET',
                responseFunction: (req, res) => {
                    res.send('hentNyeForsendelser');
                }
            }
        ]
    }
];

module.exports = mocks;
