import React from 'react';
import { motion } from 'framer-motion';
import MissionCard from './components/MissionCard';
import BenefitCard from './components/BenefitCard';
import TeamCarousel from './components/TeamCarousel';
// Import team member images
import PushpalathaImg from './assests/pushpa.jpg';
import CharanImg from './assests/charan.jpeg';
import MeghanaImg from './assests/meghana.jpeg';


const AboutUs = () => {
  const developers = [
    {
      name: "S.Pushpalatha",
      role: "Frontend Developer",
      bio: "Specialized in React and UI/UX design",
      skills: ["React", "Tailwind", "JavaScript"],
      image: PushpalathaImg
    },
    {
      name: "C.V.Charan",
      role: "Backend Developer",
      bio: "Expert in Node.js and database architecture with a focus on scalability.",
      skills: ["Node.js", "MongoDB", "API Design"],
      image: CharanImg
    },
    {
      name: "Ch.MeghanaDevi",
      role: "Fullstack Developer",
      bio: "Expert in both frontend and backend",
      skills: ["React", "Node.js", "MongoDB"],
      image: MeghanaImg
    }
  ];

  const benefits = [
    {
      title: "Real-time Vehicle Tracking",
      description: "Live GPS updates on all vehicles with accurate ETAs and route optimization",
      icon: "📍",
      bgColor: "bg-blue-100"
    },
    {
      title: "Emergency Dispatch",
      description: "Priority routing for time-sensitive medical supplies and emergency deliveries",
      icon: "🚨",
      bgColor: "bg-red-100"
    },
    {
      title: "Express Delivery Network",
      description: "Dedicated fleet for urgent packages with guaranteed delivery windows",
      icon: "⚡",
      bgColor: "bg-yellow-100"
    },
    {
      title: "24/7 Monitoring",
      description: "Round-the-clock shipment tracking with instant anomaly alerts",
      icon: "👁️",
      bgColor: "bg-purple-100"
    },
    {
      title: "Priority Routing",
      description: "AI-powered dynamic routing that adapts to traffic and weather conditions",
      icon: "🧠",
      bgColor: "bg-green-100"
    },
    {
      title: "Critical Asset Transport",
      description: "Specialized handling for sensitive medical equipment and pharmaceuticals",
      icon: "💊",
      bgColor: "bg-indigo-100"
    }
  ];

  const headingVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h1
            variants={headingVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            About Our <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">Speakship</span> Quickdelivery
          </motion.h1>
       
        </motion.div>

        {/* Mission Section */}
        <MissionCard />

        {/* Benefits Section */}
        <motion.div 
          className="my-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2
            variants={headingVariants}
            className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-900"
          >
            How We <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">Help</span> You
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          className="my-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2
            variants={headingVariants}
            className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-900"
          >
            Meet  <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">Speakship</span> Team
          </motion.h2>
          <TeamCarousel developers={developers} />
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div 
          className="rounded-xl p-8 md:p-12 text-center my-16 bg-gradient-to-br from-blue-50 to-indigo-30 border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold mb-6 text-gray-800"
          >
            Need <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">Digital Solutions?</span>
          </motion.h3>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              {/* Platform Support CTA */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Platform Questions?</h4>
                <p className="text-gray-600 mb-4">
                  Get answers about our transportation solutions and how they can work for you.
                </p>
                <motion.a
                  href="/contactus"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                >
                  Contact Support
                </motion.a>
              </div>

              {/* Web Development CTA */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Need a Website?</h4>
                <p className="text-gray-600 mb-4">
                  Our team also builds custom websites and web applications tailored to your needs.
                </p>
                <motion.a
                  href="/contactus"
                  className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                >
                  Discuss Your Project
                </motion.a>
              </div>
            </motion.div>

            <motion.p
              className="text-gray-500 text-sm mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Both services include free initial consultation. We typically respond within 24 hours.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;