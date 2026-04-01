import fetch from "node-fetch"
import { ENV } from "../config/env.js";

export async function verifyTurnstile(token, ip) {
    const secret = ENV.TURNSTILE_SECRET_KEY

    if (!secret) {
        console.error("Turnstile validation skipped because TURNSTILE_SECRET_KEY is not configured");
        return { success: false, "error-codes": ["missing_input_secret"] }
    }

    try {
        const response = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify", 
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                secret: secret,
                response: token,
                remoteip: ip,
            })
        })

        const data = await response.json()
        return data

    } catch (error) {
        console.error("Turnstile validation error:", error)
        return { success: false, "error-codes": ["internal_error"]}
    }
}
