import express from 'express'
import { transporter } from '../config/mailer.js'

export const sendEmail = async (req, res) => {
    const { email, message } = req.body

    if (!message) {
        return res.status(400).json({ error: 'Message is required' })
    }

    try {
        await transporter.sendMail({
            from: 'PlanBear <noreply@planbear.io>',
            to: process.env.CONTACT_RECEIVER,
            replyTo: email || undefined,
            subject: 'New Contact Form Submission',
            text: `
            Message:
            ${message}

            From:
            ${email || 'Anonymous'}
            `,
            })

        res.json({ success: true })
    } catch (error) { 
        res.status(500).json({ error: error.message})
    }
 }   