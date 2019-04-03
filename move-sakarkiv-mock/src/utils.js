const { parseString } = require('xml2js');
const stripPrefix = require('xml2js').processors.stripPrefix;

const parseXml = (xml, callback) => {
    parseString(xml, { normalizeTags: true, tagNameProcessors: [ stripPrefix ] }, (err, js) => {
        callback(err, js);
    });
};

module.exports =  { parseXml };