import { NavBar } from '../features/Planner/components/NavBar';
import { Button } from '../components/ui/Button';

const ContactPage = () => {
  return (
    <div className="bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          Have a question or a suggestion? We'd love to hear from you.
        </p>
        <form className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Your name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Your message"
            ></textarea>
          </div>
          <Button>Send Message</Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;