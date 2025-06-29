import React from 'react';
import MissionCard from './components/MissionCard';
import BenefitCard from './components/BenefitCard';
import StatsCard from './components/StatsCard';
import DeveloperCard from './components/DeveloperCard';

const AboutUs = () => {
  const developers = [
    {
      name: "Alex Johnson",
      role: "Frontend Developer",
      bio: "Specialized in React and UI/UX design with 5 years of experience.",
      skills: ["React", "Tailwind", "JavaScript"],
      avatar: "👨‍💻"
    },
    {
      name: "Samira Khan",
      role: "Backend Developer",
      bio: "Expert in Node.js and database architecture with a focus on scalability.",
      skills: ["Node.js", "MongoDB", "API Design"],
      avatar: "👩‍💻"
    },
    {
      name: "James Wilson",
      role: "DevOps Engineer",
      bio: "Cloud infrastructure specialist ensuring seamless deployments.",
      skills: ["AWS", "Docker", "CI/CD"],
      avatar: "👨‍🔧"
    }
  ];

  const benefits = [
    {
      title: "Real-time Tracking",
      description: "Live updates on vehicle locations and ETAs",
      icon: "📍"
    },
    {
      title: "Multi-modal Options",
      description: "Compare buses, trains, rideshares in one view",
      icon: "🚌"
    },
    {
      title: "Accessibility Focus",
      description: "Options filtered by accessibility needs",
      icon: "♿"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Our Transportation Platform</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Making urban mobility simpler, smarter, and more sustainable
          </p>
        </div>

        {/* Mission Section */}
        <MissionCard />

        {/* Stats Section */}
        <div className="my-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Impact in Numbers</h2>
          <StatsCard />
        </div>

        {/* Benefits Section */}
        <div className="my-16">
          <h2 className="text-2xl font-bold text-center mb-8">How We Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="my-16">
          <h2 className="text-2xl font-bold text-center mb-8">Meet The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <DeveloperCard key={index} {...dev} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 rounded-lg p-8 text-center my-16">
          <h3 className="text-2xl font-semibold mb-4">Still have questions?</h3>
          <p className="mb-6 text-gray-700">
            We're happy to help you understand how our platform can solve your transportation challenges.
          </p>
          <a 
            href="/contactus" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;