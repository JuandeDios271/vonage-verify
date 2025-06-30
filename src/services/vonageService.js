import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
})

export function startVerification(phone) {
  return new Promise((resolve, reject) => {
    vonage.verify.start({ number: phone, brand: 'MiApp' }, (err, result) => {
      if (err) return reject(err)
      if (result.status !== '0') return reject(new Error(result.error_text))
      resolve(result.request_id)
    })
  })
}

export function checkVerification(requestId, code) {
  return new Promise((resolve, reject) => {
    vonage.verify.check({ request_id: requestId, code }, (err, result) => {
      if (err) return reject(err)
      if (result.status !== '0') return reject(new Error(result.error_text))
      resolve(true)
    })
  })
}
