import express from 'express'
import { transporter } from '../config/mailer.js'
import { verifyTurnstile } from '../utils/verifyTurnstile.js'

export const sendEmail = async (req, res) => {
    const { email, message, turnstileToken } = req.body

    if (!turnstileToken) {
        return res.status(400).json({ error: 'Turnstile token is required' })
    }

    // Verify turnstile token
    const isValid = await verifyTurnstile(turnstileToken, req.ip)
    if (!isValid.success) {
        return res.status(400).json({
            error: 'Turnstile validation failed',
            details: isValid["error-codes"] || [],
        })
    }

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
