// const cors = require("cors");
// const express = require("express");

// mock database
let messages =[
    {
        id:1,
        text: "Hello welcome to the Real chat application bootcamp",
        user: "John",
        timestamp: new Date().toISOString()
    },
    {
        id:2,
        text: "How are you",
        user: "Jane",
        timestamp: new Date().toISOString()
    },
    
]

//get all messages
const getMessages = (req, res) => {
    try {
        res.json({
        success: true,
        count: messages.length,
        data: messages,
        })
    } catch(error){
        res.status(500).json({
            success:false,
            message: "Server error",
            error: error.message
        })
    }
 }


//post the messages
const createMessages = (req, res) => {
    try{
        const {text, user} = req.body;

        //validation
        if(!text || !user){
            return res.status(400).json({
                success: false,
                message: "Please provide text for the message"
            })
        }

        // If validation is given
        const newMessage = {
            id: messages.length + 1,
            text,
            user,
            timestamp: new Date().toISOString()
        }

        messages.push(newMessage);
        res.status(201).json({
            success: true,
            message:"Message created successfully",
            data: newMessage
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}

//Delete messages
const deleteAllMessages = (req, res) => {
    try{
        messages =[],
        res.json({
            success: true,
            message: "All messages deleted"
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}

// adding new messages
const addMessage=(messageData) => {
    const newMessage = {
        id: messages.length + 1,
        text: messageData.text,
        user: messageData.user,
        timestamp: new Date().toISOString()
    }
    messages.push(newMessage);
    return newMessage;
}

    module.exports = {
        getMessages,
        createMessages,
        deleteAllMessages,
        addMessage
    }

