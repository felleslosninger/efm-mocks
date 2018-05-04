let xml2js = require('xml2js');
let builder = new xml2js.Builder();
let parseString = require('xml2js').parseString;


function receiveDPV(req, res) {
    if (req){
        console.log('Got req!');

        console.log(req.body);

    }

    if (res){
        console.log('Got res!');
    }
    res.send('Gday mate!');
}

module.exports = { receiveDPV } ;

