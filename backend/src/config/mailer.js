import nodemailer from 'nodemailer'
import { ENV } from '../config/env.js'

export const isMailerConfigured = Boolean(
    ENV.EMAIL_HOST
    && ENV.EMAIL_PORT
    && ENV.EMAIL_USER
    && ENV.EMAIL_PASS
)

export const transporter = isMailerConfigured
    ? nodemailer.createTransport({
        host: ENV.EMAIL_HOST,
        port: ENV.EMAIL_PORT,
        secure: ENV.EMAIL_PORT === 465,
        auth: {
            user: ENV.EMAIL_USER,
            pass: ENV.EMAIL_PASS
        },
    })
    : null
