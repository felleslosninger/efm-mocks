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

    var results = [];

    // Handle array which we just traverse and recurse.
    if(data.constructor === Array) {
        for (var i = 0, len = data.length; i < len; i++) {
            results = results.concat(recursiveKeySearch(key, data[i]));
        }
        return results;
    }

    // We know we have an general object to work with now.
    // Now we need to iterate keys
    for (var dataKey in data) {
        if (key === dataKey) {
            // we found a match
            results.push(data[key]);
        }

        // now recurse into value at key
        results = results.concat(recursiveKeySearch(key, data[dataKey]));
    }

    return results;
}

module.exports = { recursiveKeySearch };