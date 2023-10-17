const client = require('twilio')(process.env.AccountSID, process.env.AuthToken);

client.verify.v2.services
                .create({friendlyName: 'Agriko'})
                .then(service => console.log(service.sid));

module.exports = client;