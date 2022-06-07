const fetch = require('node-fetch');

const featureFlags = {
    getAll () {
        var headers = {
            "Content-type": 'application/json',
            Authorization: 'token'
          }
    
        return fetch("https://next-flags.ft.com/api/v1", { 
            method: 'GET', 
            headers: headers
        })
        .then(res => res.json())
        .then(json => json.flags)
        .catch(() => [])
    }
}

module.exports = featureFlags;