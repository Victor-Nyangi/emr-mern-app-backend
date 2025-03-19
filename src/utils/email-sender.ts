// import gmailSend from 'gmail-send';

const SENDER_EMAIL: string | undefined = process.env.SENDEREMAIL;
const SENDER_PASS: string | undefined = process.env.SENDERPASS;

if (!SENDER_EMAIL || !SENDER_PASS) {
  throw new Error('SENDEREMAIL and SENDERPASS must be set in environment variables');
}

interface SendGmailOptions {
  destination: string;
  messageHtml: string;
  subject: string;
  files?: string[]; // Optional array of file paths
}

export const sendGmail = async ({
  destination,
  messageHtml,
  subject,
  files,
}: SendGmailOptions): Promise<void> => {
  try {
    // const send = gmailSend({
    //   user: SENDER_EMAIL,
    //   pass: SENDER_PASS,
    //   to: destination,
    //   subject,
    //   html: messageHtml, // Fixed typo (was messageHtmL)
    //   bcc: 'gichuivictor@gmail.com',
    //   files,
    // });

    // const { result, full } = await send();
    // console.log(result);
  } catch (error) {
    console.error('ERROR', error);
    throw error;
  }
};
