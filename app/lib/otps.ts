import crypto from 'crypto'

interface Iotp {
    code: string,
    id: string
}

let otps: Array<Iotp> = []

function generateOtp(id: string) {
    const code = crypto.randomBytes(3).toString('hex').toUpperCase()
    otps.push({
        id,
        code
    })
    setTimeout(() => {
        // console.log('otp code', code, 'has been expired')
        otps = otps.filter(_otp => _otp.code !== code)
    }, 900000);
    console.log('generateOtp', otps)
    return code
}

function verifyOtp(code: string) {
    // console.log('verifyotp', otps)
    const otp = otps.find(_otp => _otp.code === code)
    if (!otp) return null

    otps = otps.filter(_otp => _otp.code !== otp.code)
    return otp
}


export {
    generateOtp,
    verifyOtp
}