import { Auth } from '@vonage/auth';
import { SMS } from '@vonage/sms';

const credentials = new Auth({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});
const options = {};
const smsClient = new SMS(credentials, options);

/**
 * 
 * @param {string} to - Phone number in international format
 * @param {string} message - Text to send
 * @throws {Error} - In case of API or network failure
 */
export async function sendSms(to, message) {

    try {
        const response = await smsClient.send({
            to,
            from: 'Vonage',
            text: message
        });

        console.log('[Vonage SMS] Raw response:', JSON.stringify(response, null, 2))

        const messageStatus = response.messages?.[0]?.status;
        const errorText = response.messages?.[0]?.['error-text'];

        if( messageStatus !== '0' ) {

            console.error('[]Vonage SMS Failed:', errorText);
            throw new Error(`[S001] SMS sending error: ${errorText || 'Unknown error'}`);

        }

        console.log('[Vonage SMS] Succesfully sent');
    } catch (err) {
        console.error('[Vonage SMS] Error:', err);
        throw new Error('[S500] The SMS could not be sent. Please try again later.');
    }
    
}