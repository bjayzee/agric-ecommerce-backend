const twilioClient = require('twilio')(process.env.AccountSID, process.env.AuthToken);

twilioClient.verify.v2.services
                .create({friendlyName: 'Agriko'})
                .then(service => console.log(service.sid));


const sendOTP = async(otpType, channel) =>{
    await twilioClient.verify.v2.services(process.env.TWILIO_ServiceId)
        .verifications
        .create({ to: otpType, channel: channel })
}               

const verifyOTP = async(otpType, token) =>{
    await twilioClient.verify.v2.
        services(process.env.TWILIO_ServiceId)
        .verificationChecks.create({
            to: otpType,
            code: token,
        });
}

module.exports = {
    twilioClient,
    sendOTP,
    verifyOTP
}