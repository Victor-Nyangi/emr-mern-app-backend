const express = require('express')
const router = express.Router()
const Message = require('../../controllers/clientmessage');

router.get('/deliveryreports', Message.sendMessage);

router.post('/receivemessage', Message.receiveMessage);

router.post('/checkstatus', Message.checkStatus);

module.exports = router;