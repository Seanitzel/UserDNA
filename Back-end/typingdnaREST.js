class typingdnaManager{
    constructor(apiKey,apiSecret) {
        this.apiKey = apiKey
        this.apiSecret = apiSecret
        this.https = require('https');
        this.querystring = require('querystring');
        this.base_url = 'api.typingdna.com';
    }

    verifyPattern(id, typingP, q = '2', callback){
        let data = {
            tp : typingP,
            quality : q,
        }

        let options = {
            hostname : this.base_url,
            port : 443,
            path : '/verify/' + id,
            method : 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache',
                'Authorization': 'Basic ' + new Buffer(this.apiKey + ':' + this.apiSecret).toString('base64'),
            },
        };

        let responseData = '';
        let req = this.https.request(options, function(res) {
            res.on('data', function(chunk) {
                responseData += chunk;
            });

            res.on('end', function() {
                callback(JSON.parse(responseData));
            });
        });

        req.on('error', function(e) {
            console.error(e);
        });
        req.write(
            this.querystring.stringify(data)
        );
        req.end();
    }

    addPattern(id, typingP, callback){
        let data = {
            tp : typingP,
            }

        let options = {
        hostname : this.base_url,
        port : 443,
        path : '/save/' + id,
        method : 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            'Authorization': 'Basic ' + new Buffer(this.apiKey + ':' + this.apiSecret).toString('base64'),
            },
        };

        let responseData = '';
        let req = this.https.request(options, function(res) {
            res.on('data', function(chunk) {
                responseData += chunk;
            });

            res.on('end', function() {
                callback(JSON.parse(responseData));
            });
        });

        req.on('error', function(e) {
            console.error(e);
            });
        req.write(
        this.querystring.stringify(data)
        );
        req.end();
    }

    checkUser( id,callback){
        let options = {
        hostname : this.base_url,
        port : 443,
        path : '/user/' + id,
        method : 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Authorization': 'Basic ' + new Buffer(this.apiKey + ':' + this.apiSecret).toString('base64'),
            'Access-Control-Allow-Origin' :''
        },
        };

        let responseData = '';
        let req = this.https.request(options, function(res) {
        res.on('data', function(chunk) {
            responseData += chunk;
        });

        res.on('end', function() {
            // console.log(JSON.parse(responseData));
            callback(JSON.parse(responseData))
        });
        });

        req.on('error', function(e) {
        console.error(e);
        });

        req.end();
    }
    
    deleteUser( id, callback){
        let https = require('https');
        let options = {
            hostname : this.base_url,
            port : 443,
            path : '/user/' + id,
            method : 'DELETE',
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': 'Basic ' + new Buffer(this.apiKey + ':' + this.apiSecret).toString('base64'),
            },
        };

        let responseData = '';
        let req = this.https.request(options, function(res) {
            res.on('data', function(chunk) {
                responseData += chunk;
            });

            res.on('end', function() {
                callback(JSON.parse(responseData));
            });
        });

        req.on('error', function(e) {
            console.error(e);
        });

        req.end();
    }
}
module.exports = typingdnaManager
