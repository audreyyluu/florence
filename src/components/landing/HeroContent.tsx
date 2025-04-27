import React from 'react';
import { AuthButton } from '@/components/auth/AuthButton';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { Eye, Bell, Map, MessageCircle, ChevronDown } from 'lucide-react';

export function HeroContent() {
  const features = [
    {
      icon: Eye,
      title: "Real-Time Monitoring",
      description: "Monitor patient rooms in real-time with advanced video surveillance to ensure patient safety and proper care.",
      imagePath: "home/patient.png"
    },
    {
      icon: Bell,
      title: "Activity Detection",
      description: "Automatically detect potentially dangerous activities like falls, coughing, or distress using AI-powered analysis.",
      imagePath: "home/activity.png"
    },
    {
      icon: MessageCircle,
      title: "Convenient Communication",
      description: "Chat with healthcare staff to notify them when patients need attention, allowing for quicker assistance.",
      imagePath: "home/chat.png"
    },
    {
      icon: Map,
      title: "Hospital Map",
      description: "Displays map of the hospital and the location status of every patient's room.",
      imagePath: "home/map.png"
    }
  ];

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full gap-6 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center w-full gap-6 mb-12 min-h-[75vh] relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10 w-full max-w-7xl mx-auto">
          <div className="lg:w-1/2 w-full space-y-4 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 mx-auto lg:mx-0 inline-block"
            >
              <div className="px-4 py-1 bg-blue-50 border border-blue-100 rounded-full">
                <p className="text-sm font-medium text-blue-600">Advanced Hospital Surveillance</p>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Enhancing Patient Care with Florence
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0"
            >
              Florence is an AI agent that provides advanced surveillance solutions for hospitals, enabling medical personnel to monitor patients remotely and respond quickly to emergencies.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-5 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <AuthButton trigger={
                <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 px-8 py-6 text-lg font-medium">
                  Get Started
                </Button>
              } />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="lg:w-1/2 w-full rounded-2xl overflow-hidden shadow-2xl relative group"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 z-10 pointer-events-none rounded-2xl"></div>
            <img 
              src="/home/dashboard.png" 
              alt="Dashboard preview" 
              className="w-full h-auto object-contain relative z-10 transform transition duration-500 group-hover:scale-[1.02]"
            />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToFeatures}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-500">Explore Features</span>
            <ChevronDown className="h-6 w-6 text-gray-500 animate-bounce" />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="features-section w-full max-w-7xl mx-auto space-y-28 pb-20 mt-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Powerful Features for Healthcare Professionals
        </motion.h2>
        
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 relative`}
          >
            {/* Feature decorations */}
            <div className={`absolute -z-10 ${index % 2 === 0 ? 'left-0' : 'right-0'} top-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20`}></div>
            
            <div className="lg:w-1/2 w-full">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <img 
                  src={feature.imagePath} 
                  alt={feature.title} 
                  className="rounded-xl shadow-lg w-full h-auto object-cover relative z-10 transform transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
            <div className="lg:w-1/2 w-full space-y-6">
              <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-blue-50 rounded-full">
                <feature.icon className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-600">{feature.title}</h2>
              </div>
              <p className="text-lg text-gray-600">{feature.description}</p>
            </div>
          </motion.div>
        ))}
        
        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="my-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-12 rounded-3xl shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to elevate patient care?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join hospitals nationwide that trust Florence to monitor and care for their patients.
            </p>
            <AuthButton trigger={
              <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 px-8 py-6 text-lg font-medium">
                Get Started Today
              </Button>
            } />
          </div>
        </motion.div>
      </div>
    </div>
  );
}