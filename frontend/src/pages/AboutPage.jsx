import { NavBar } from '../features/Planner/components/NavBar';

const AboutPage = () => {
  return (
    <div className="bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About UCLA Degree Planner</h1>
        <p className="text-lg text-gray-600 mb-8">
          UCLA Degree Planner is a free tool designed to help UCLA students plan their academic journey.
          Our mission is to provide students with a simple and intuitive way to map out their courses,
          track their progress, and stay on track for graduation.
        </p>
        <p className="text-lg text-gray-600">
          This project was created by students, for students, and we are committed to making it the best
          degree planning tool available.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;