import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    quote: "QuickDelivery saved my business during the holiday rush. Their same-day delivery is unmatched!",
    author: "Sarah Johnson",
    role: "Small Business Owner",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
  quote: "I've tried many delivery services, but QuickDelivery's tracking and reliability are the best.",
  author: "Michael Chen",
  role: "Frequent Customer",
  rating: 5,
  image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=200&h=200&q=80"
},

{
  quote: "The customer service team resolved my issue in minutes. Highly recommend!",
  author: "Emma Rodriguez",
  role: "Online Seller",
  rating: 4,
  image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200&q=80"
}

];

// Custom Arrows
const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute left-0 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-200 transition-colors`}
      style={{ ...style, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
    >
      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute right-0 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-200 transition-colors`}
      style={{ ...style, transform: 'translate(50%, -50%)' }}
      onClick={onClick}
    >
      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          
           <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            What Our <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">Customers Says?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
             Don't just take our word for it — hear from our satisfied customers
          </motion.p>
          
          
        </div>

        <div className="relative px-4 sm:px-0">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.15)' }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col mx-2 md:mx-4"
              >
                <div className="flex justify-center mb-6">
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                </div>
                <div className="text-gray-600 dark:text-gray-300 italic mb-6 text-center">
                  "{testimonial.quote}"
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white text-center text-lg">
                  {testimonial.author}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm text-center">
                  {testimonial.role}
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
