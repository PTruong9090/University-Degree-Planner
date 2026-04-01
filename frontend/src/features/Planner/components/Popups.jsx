import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export function ContactUs({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (!isOpen) {
            setStatus({ type: '', message: '' });
        }
    }, [isOpen]);

    async function handleSubmit() {
        if (!message.trim()) {
            setStatus({ type: 'error', message: 'Please add a message before sending.' });
            return;
        }

        if (!token) {
            setStatus({ type: 'error', message: 'Please complete the captcha.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await fetch(`${BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, message, turnstileToken: token }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed');
            }

            setEmail('');
            setMessage('');
            setToken(null);
            setStatus({ type: 'success', message: 'Message sent. Thanks for reaching out.' });

        } catch (error) {
            console.error('Contact form submission failed:', error);
            setStatus({ type: 'error', message: error.message || 'Failed to send message.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className='fixed inset-0 z-50 focus:outline-none'>
            <div className='fixed inset-0 w-screen bg-[rgba(47,52,65,0.22)] backdrop-blur-[2px]' aria-hidden='true' />
                
            <div className='fixed inset-x-0 top-20 flex justify-center px-4 text-left'>
                <DialogPanel transition className='m-6 w-full max-w-xl rounded-[28px] border border-[var(--border)] bg-[rgba(255,250,245,0.98)] p-6 shadow-[0_24px_80px_rgba(100,88,74,0.14)]'>
                    <DialogTitle as="h3" className='font-display text-3xl font-semibold text-[var(--text)]'>
                        Contact us
                    </DialogTitle>
                    <div className='mt-4 flex flex-col'>
                        <p className='text-sm leading-6 text-[var(--muted)]'>
                            Need help, found a bug, or have a suggestion? Send a quick note here.
                        </p>
                        
                        <label htmlFor='message' className='mt-5 text-sm font-semibold text-[var(--text)]'>
                            Your message
                        </label>
                        <textarea 
                            value={message}
                            placeholder='Describe how we can help.'
                            id="message" 
                            onChange={(e) => setMessage(e.target.value)}
                            className='mt-2 h-40 rounded-2xl border border-[var(--border)] bg-white p-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent-strong)] focus:ring-2 focus:ring-[var(--accent-soft)]'
                        />
                        
                        <label className='mt-4 text-sm font-semibold text-[var(--text)]' htmlFor='email'>
                            Your email (optional)
                        </label>
                        <input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='So we can get back to you.'
                            type='email' 
                            id="email" 
                            className='mt-2 rounded-2xl border border-[var(--border)] bg-white p-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent-strong)] focus:ring-2 focus:ring-[var(--accent-soft)]'
                        />
                    </div>

                    <div className='mt-5'>
                        {!TURNSTILE_SITE_KEY ? (
                            <p className='text-sm text-[var(--rose-strong)]'>
                                Turnstile is not configured. Add `VITE_TURNSTILE_SITE_KEY` to the frontend environment.
                            </p>
                        ) : (
                            <Turnstile
                                siteKey={TURNSTILE_SITE_KEY}
                                onSuccess={(newToken) => setToken(newToken)}
                                onExpire={() => setToken(null)}
                                onError={(errorCode) => {
                                    console.error('Turnstile failed to load:', errorCode);
                                }}
                                onTimeout={() => setToken(null)}
                            />
                        )}
                    </div>

                    {status.message ? (
                        <div
                            className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${
                                status.type === 'success'
                                    ? 'border-[var(--sage)] bg-[rgba(216,226,210,0.6)] text-[var(--sage-strong)]'
                                    : 'border-[var(--rose)] bg-[rgba(238,221,216,0.7)] text-[var(--rose-strong)]'
                            }`}
                        >
                            {status.message}
                        </div>
                    ) : null}

                    <div className='mt-6 flex justify-end'>
                        <button 
                            onClick={handleSubmit} 
                            disabled={!token || loading}
                            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                                !token || loading
                                    ? 'cursor-not-allowed bg-[var(--surface-muted)] text-[var(--muted-soft)] opacity-70'
                                    : 'bg-[var(--text)] text-[var(--surface)] hover:bg-[#4b5161]'
                            }`}
                        >
                            {loading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
