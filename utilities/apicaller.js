var request = require('request');

function post(endpoint, reqBody) {
    return new Promise((resolve, reject) => {
        request({
            headers: { "content-type": "application/json" },
            method: "POST",
            url: endpoint,
            body: reqBody,
            json: true
        }, function (error, response) {
            if (error != null) {
                return reject(error);
            } else {
                return resolve(response.body);
            }
        });
    });
}

function postWithToken(endpoint, token, reqBody) {
    return new Promise((resolve, reject) => {
        request.post({
            headers: { 'content-type': 'application/json', authorization: token },
            url: endpoint,
            body: reqBody
        }
            , function (error, response) {
                if (error != null) {
                    return reject(error);
                }
                return resolve(JSON.parse(response.body));
            });
    });
}

function get(endpoint) {
    return new Promise((resolve, reject) => {
        request(endpoint, function (error, response) {
            if (error != null) {
                return reject(error);
            } else {
                return resolve(response.body);
            }
        });
    });
}

function postSoap(endpoint, soapAction, soapReq) {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': endpoint,
            'headers': {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': soapAction
            },
            body: soapReq

        };
        request(options, function (error, response) {
            if (error != null) {
                return reject(error);
            } else {
                return resolve(response.body);
            }
        });
    });
}

module.exports = {
    post, postWithToken, postSoap, get
}