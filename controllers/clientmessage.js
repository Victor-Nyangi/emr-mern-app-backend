const AfricasTalking = require('africastalking');

const africastalking = AfricasTalking({
    apiKey: 'c6763238c49a43af147b00062e2bf00e4d00b6dee24f937f4e472ea120cf5fa7',
    username: 'sandbox'
});

// Sender IDs allow you to brand your messages as you send them to your customers.
// There are two kinds of sender IDs, short codes and alphanumerics.
// The difference is that you can send and receive messages with short codes but only send messages with alphanumerics.
// 70907 - shortcode
// theforest -alphanumeric

exports.sendMessage = async (req, res) => {
// TODO: Send message
try {
    const result=await africastalking.SMS.send({
      to: '+254700454757',
      message: 'Hey AT Ninja! Wassup...',
      from: '70907'
    });
    console.log(result);
  } catch(ex) {
    console.error(ex);
  }
}

// Inbox callback https://account.africastalking.com/apps/sandbox/sms/inbox/callback
exports.receiveMessage = async (req, res) => {
    try{
        const data = req.body;
        console.log(`Received message: \n ${ Object.keys(data)} \n linkId - ${data.linkId} \n text - ${data.text} \n id - ${data.id} \n to ${data.to} \n date ${data.date} from \n ${data.from}`);
        res.sendStatus(200);
    } catch(ex) {
        console.error(ex);
      }
}

// Inbox callback https://account.africastalking.com/apps/sandbox/sms/dlr/callback
exports.checkStatus = async (req, res) => {
    try{
        const data = req.body;
        console.log(`Received report: \n ${data}`);
        res.sendStatus(200);
    } catch(ex) {
        console.error(ex);
    }
}