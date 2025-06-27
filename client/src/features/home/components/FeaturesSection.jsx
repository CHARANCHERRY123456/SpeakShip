import React from 'react';
import { motion } from 'framer-motion';
import { 
  
  MapPin, 
  Shield, 
  Clock, 
  
  Users, 
 
  Zap,
  
  Award
} from 'lucide-react';

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Average delivery time of just 30 minutes with our optimized routing system'
    },
    {
      icon: MapPin,
      title: 'Live Tracking',
      description: 'Real-time GPS tracking with live updates and delivery notifications'
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'End-to-end insurance coverage and background-verified drivers'
    },
    {
      icon: Clock,
      title: '24/7 Service',
      description: 'Round-the-clock delivery service available every day of the year'
    },
    {
      icon: Users,
      title: 'Trusted Drivers',
      description: 'All drivers are verified, trained, and rated by our community'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Award-winning service with industry-leading satisfaction rates'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose QuickDelivery?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine cutting-edge technology with human care to deliver your packages 
            safely, quickly, and reliably every single time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;