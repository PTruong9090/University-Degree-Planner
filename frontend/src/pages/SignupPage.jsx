import { NavBar } from '../features/Planner/components/NavBar';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  return (
    <div className="bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="w-full max-w-md">
          <form className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Create an Account</h1>
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
              <label htmlFor="password" a className="block text-gray-700 font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Your password"
              />
            </div>
            <Button className="w-full">Sign Up</Button>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;