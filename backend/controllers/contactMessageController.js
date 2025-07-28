const ContactMessage = require('../models/contactMessageModel')
const nodemailer = require('nodemailer')

exports.submitContactMsg = async (req, res) => {
    try {

        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the data'
            })
        }

        await ContactMessage.create({
            name,
            email,
            subject,
            message
        })

        res.status(201).json({
            success: true,
            message: 'Your message has been submitted successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllContactMsgs = async (req, res) => {
    try {

        const contactMessages = await ContactMessage.find()

        res.status(200).json({
            success: true,
            contactMessages
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.markContactMsgAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await ContactMessage.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        contact.isRead = true;
        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Message marked as read',
            contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

exports.replyToContactMsg = async (req, res) => {

    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    try {
        const { id } = req.params;

        const { reply } = req.body;

        console.log(id, reply)

        const contactMsg = await ContactMessage.findById(id)

        if (!contactMsg) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            })
        }

        const emailOptions = {
            from: process.env.EMAIL_USER,
            to: contactMsg.email,
            subject: `Re: ${contactMsg.subject}`,
            text: reply
        }

        await transport.sendMail(emailOptions)

        contactMsg.isReplied = true;
        await contactMsg.save()

        res.status(200).json({
            success: true,
            message: 'Reply sent successfully',
            contact: contactMsg
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}