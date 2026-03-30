import fetch from "node-fetch"

export async function verifyTurnstile(token, ip) {
    const secret = process.env.TURNSTILE_SECRET_KEY

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
        console.log("Turnstile response:", data)
        return data

    } catch (error) {
        console.error("Turnstile validation error:", error)
        return { success: false, "error-codes": ["internal_error"]}
    }
}