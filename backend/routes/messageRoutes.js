const express = require('express');

const router=express.Router();

const{
    getMessages,
    createMessages,
    deleteAllMessages,
}=require('../controllers/messageControllers');

// Get all messages
router.get('/', getMessages)

//Post the message
router.post('/', createMessages)

//Delete all messages
router.delete('/', deleteAllMessages)

module.exports = router;