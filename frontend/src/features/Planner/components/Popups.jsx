import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { useState } from 'react'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export function ContactUs( { isOpen, onClose }) {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        if (!message.trim()) return

        setLoading(true)

        try {
            const res = await fetch(`${BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, message }),
            })

            if (!res.ok) throw new Error('Failed')

            setEmail('')
            setMessage('')
            onClose()
            alert('Message sent!')

        } catch (error) {
            alert('Failed to send message')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className='fixed inset-0 z-50 focus:outline-none'>
            {/* Backdrop */}
            <div className='fixed inset-0 bg-black/20 w-screen' aria-hidden='true'/>
                
            {/* Modal */}
            <div className='fixed inset-x-0 top-20 justify-center flex items-center text-left'>
                <DialogPanel transition className='w-full bg-white max-w-xl rounded-xl p-6 m-10'>
                    <DialogTitle as="h3" className='text-3xl mb-4 text-left font-semibold text-gray-800'>Contact Us</DialogTitle>
                    <div className='flex flex-col'> 
                        <p className='text-center opacity-40 text-sm'>Need help? Found a bug? Have a suggestion? <br/>Let us know!</p>
                        
                        <label htmlFor='message'>Your message: <br/> </label>
                        <textarea 
                            value={message}
                            placeholder='Describe how we can help!'
                            id="message" 
                            onChange={(e) => setMessage(e.target.value)}
                            className='h-40 border border-gray-300 rounded-lg p-2 my-2 text-sm '/>
                        
                        <label className='mt-1' htmlFor='email'>Your email (optional): <br/> </label>
                        <input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='So we can get back to you!' 
                            type='email' 
                            id="email" 
                            className='text-sm border border-gray-300 rounded-lg p-2 mt-2'/>
                    </div>

                    <div className='text-right mt-4'>
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading} 
                            className='text-center font-semibold px-5 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600'
                        >
                            {loading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}