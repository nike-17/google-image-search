var request = require('request'),
    stream = require('stream'),
    util = require('util'),
    querystring = require('querystring');

/**
 * Abstraction over goggle image search
 *
 * @extends {stream.Stream}
 * @constructor
 */
var GoogleImage = function GoogleImage() {
    stream.Stream.call(this);

    /**
     * Is readable stream flag
     *
     * @type {boolean}
     */
    this.readable = true;

    /**
     * Is writable stream flag
     *
     * @type {boolean}
     */
    this.writable = true;

    /**
     * Google images ajax endpoint url
     *
     * @type {string}
     * @private
     */
    this._url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=';
};

util.inherits(GoogleImage, stream.Stream);

/**
 * Search over google images
 *
 * @param {string} query search query
 */
GoogleImage.prototype.search = function search(query){
    var self = this;

    request.get({
        url: this._getUrl(query)
    }, function(err, resp, data){
        if(err) return cb(err);

        var response = JSON.parse(data);

        process.nextTick(function(){
            request.get({ url: response.responseData.results[0].url }).pipe(self);
        });
    });
};

/**
 * Send data to the underlying resource.
 *
 * @param {Buffer | string} chunk The chunk to be written
 * @param {string} encoding If the chunk is a string, then this is the encoding type.
 */
GoogleImage.prototype.write = function(chunk, encoding){
    this.emit('data', chunk);
};

/**
 * Is fired after all data has been output which is after the callback in flush has been called.
 *
 * @param {Buffer | string} chunk The chunk to be written
 */
GoogleImage.prototype.end = function(chunk){
    this.emit('end', chunk);
};

/**
 * Returns  url with query
 *
 * @param query
 * @returns {string}
 * @private
 */
GoogleImage.prototype._getUrl = function(query) {
    return this._url + encodeURIComponent(query);
};


function search(query){
    var s = new GoogleImage();
    process.nextTick(function(){
        s.search(query);
    });
    return s;
}

module.exports = search;
