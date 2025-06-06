import React from 'react'; // Removed useState as deliveryAddress is no longer needed
import { ArrowRight } from 'lucide-react'; // Removed MapPin as address input is removed

// The HomePage component displays a welcome message, a call to action, and an image.
// It no longer includes an address input.
function HomePage({ userEmail, userRole}) {

  // Handle the "Get Started" button click.
  // This is now a simple action, without requiring an address.
  const handleGetStarted = () => {
    console.log('Get Started button clicked!');
    // Here you would typically navigate to a delivery options page
    // or trigger an API call to start the delivery process.
    alert('Welcome! Let\'s get your delivery started.'); // Using alert for demonstration, replace with a custom modal in production.
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 bg-gray-50 font-inter">
      {/* Left Section: Text Content */}
      <div className="w-full md:w-1/2 flex flex-col items-start text-left p-8"> {/* Changed to items-start and text-left for universal left alignment */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4 animate-fade-in-down">
          Quick <span className="text-sky-600">Delivery</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-md animate-fade-in-up">
          Experience lightning-fast delivery right to your doorstep! We bring your favorite items, fresh and hot,
          exactly when you need them. Say goodbye to waiting and hello to convenience.
        </p>

        {/* Get Started Button */}
        <div className="w-full max-w-sm flex justify-start animate-fade-in"> {/* Changed to justify-start for universal left alignment */}
          <button
            onClick={handleGetStarted}
            className="group relative flex items-center justify-center rounded-lg bg-sky-600 px-8 py-3 text-lg font-semibold text-white hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 shadow-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 h-6 w-6 text-sky-300 group-hover:text-sky-200" />
          </button>
        </div>

        {/* User Info */}
        {userEmail && (
          <p className="mt-8 text-sm text-gray-600">
            Welcome, <span className="font-semibold">{userEmail}</span>! You are logged in as{' '}
            <span className="font-semibold capitalize">{userRole}</span>.
          </p>
        )}
      </div>

      {/* Right Section: Attractive Image */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <img
          src="/cover.jpg" // Changed image source to cover.jpg from public directory
          alt="Fast Delivery Service"
          className="rounded-lg shadow-xl w-full max-w-xl h-auto object-cover animate-fade-in-right"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Available"; }} // Fallback image
        />
      </div>

      {/* Tailwind CSS custom animations (add these to your main CSS file or inline in <style> if not using PostCSS) */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.2s; /* Delay for staggered effect */
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
          animation-delay: 0.4s; /* Delay for staggered effect */
        }
      `}</style>
    </div>
  );
}

export default HomePage;
