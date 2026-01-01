import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export function ContactUs( { isOpen, onClose }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className='fixed inset-0 z-50 focus:outline-none'>
            {/* Backdrop */}
            <div className='fixed inset-0 bg-black/10' aria-hidden='true'/>
                
            
        </Dialog>
    )
}