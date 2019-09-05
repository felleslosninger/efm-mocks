let fs = require('fs');
const rimraf = require('rimraf');

function recursiveKeySearch(key, data) {
    // not shown - perhaps validate key as non-zero length string

    // Handle null edge case.
    if(data === null) {
        // nothing to do here
        return [];
    }

    // handle case of non-object, which will not be searched
    if(data !== Object(data)) {
        return [];
    }

    let results = [];

    // Handle array which we just traverse and recurse.
    if(data.constructor === Array) {
        for (let i = 0, len = data.length; i < len; i++) {
            results = results.concat(recursiveKeySearch(key, data[i]));
        }
        return results;
    }

    // We know we have an general object to work with now.
    // Now we need to iterate keys
    for (let dataKey in data) {
        if (key === dataKey) {
            // we found a match
            results.push(data[key]);
        }

        // now recurse into value at key
        results = results.concat(recursiveKeySearch(key, data[dataKey]));
    }

    return results;
}

const getRawBody = (req, res, next) => {

        var chunks = [];
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            chunks.push(chunk);
        });
        req.on('end', function() {
            req.rawBody = chunks.join('');
            next();
        });
};

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

// delete file named 'sample.txt'
function deleteFile(file){
    fs.unlink(file, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    });
}

function deleteDirectoryRecursive(directory, removeContaining){
    let path = removeContaining ? `${directory}` : `${directory}/*`;
    return new Promise((resolve, reject) => {
        rimraf(path, (err) => {
            if (err) return reject(err);
            console.log("Deleted files");
            resolve("The folder was deleted!")
        });
    });
}

module.exports = { recursiveKeySearch, getRawBody, makeid, move, deleteFile, deleteDirectoryRecursive };