import { Vonage } from '@vonage/server-sdk';
import { Sms } from '@vonage/sms';

const credentials = {
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
};
const sms = new Sms();
const options = { sms };
const vonage = new Vonage(credentials, options);

export async function sendSms(to, message) {

    try {
        const response = await vonage.sms.send({
            to,
            from: 'MyApp',
            text: message
        });

        const messageStatus = response.messages?.[0]?.status;
        const errorText = response.messages?.[0]?.['error-text'];

        if( messageStatus !== '0' ) {

            console.error('[]Vonage SMS Failed:', errorText);
            throw new Error(`Vonage SMS Error: ${errorText}`);

        }

        console.log('[Vonage SMS] Succesfully sent');
    } catch (err) {
        console.error('[Vonage SMS] Error:', err);
        throw err;
    }
    
}