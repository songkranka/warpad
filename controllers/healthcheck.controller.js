const healthcheck = require('../services/healthcheck')
let expression = true

module.exports = function (app) {
    app.get('/api/HealthCheck/getStatus', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        
        const dataObj = await healthcheck.getStatus();

        if (expression)
            return res.status(200).send(dataObj)
        return res.status(404).send(false)
    })
}
