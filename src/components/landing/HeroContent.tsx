import React from 'react';
import { AuthButton } from '@/components/auth/AuthButton';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { Eye, Bell, Activity, MessageCircle } from 'lucide-react';

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
      icon: Activity,
      title: "Vitals Accessibility",
      description: "Displays patients' vitals and medical history for quick access and visibility.",
      imagePath: "home/vitals.png"
    },
    {
      icon: MessageCircle,
      title: "Convenient Communication",
      description: "Chat with healthcare staff to notify them when patients need attention, allowing for quicker assistance.",
      imagePath: "home/chat.png"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-between min-h-[500px] pt-8 px-4 sm:px-6 lg:px-8 gap-8">
      <div className="flex flex-col items-center justify-center w-full gap-8 mb-16 h-[85vh] py-0">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 w-full max-w-4xl mx-auto lg:mx-0 space-y-6 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 mx-auto lg:mx-0"
            >
              <p className="text-xs font-medium text-blue-600">Advanced Hospital Surveillance</p>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter"
            >
              Enhancing Patient Care with Florence
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-600 max-w-xl"
            >
              Florence is an AI agent that provides advanced surveillance solutions for hospitals, enabling medical staff to monitor patients remotely and respond quickly to emergencies.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
            </motion.div>
          </div>

          <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="lg:w-1/2 w-full mt-8 lg:mt-0 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
              <div className="flex flex-col items-center justify-center z-10">
              <Eye className="h-16 w-16 text-blue-400 mb-4" />
              <p className="text-white text-lg">Video Surveillance Demo</p>
              <p className="text-gray-400 text-sm mt-2">Live monitoring of patient rooms</p>
              </div>
            </div>
          </motion.div>
        </div>
      <br />
      <Button 
        onClick={() => {
        const featuresSection = document.querySelector('.features-section');
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
        }}
      >
        Explore Features
      </Button>
      </div>

      <div className="features-section">
      {features.map((feature, index) => (
        <motion.div 
        key={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center w-full py-16 gap-8`}
        >
        <div className="lg:w-1/2 w-full">
          <img 
          src={feature.imagePath} 
          alt={feature.title} 
          className="rounded-lg shadow-md w-full h-auto object-cover"
          />
        </div>
        <div className="lg:w-1/2 w-full space-y-4">
          <div className="flex items-center gap-2 mb-2">
          <feature.icon className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">{feature.title}</h2>
          </div>
          <p className="text-lg text-gray-600">{feature.description}</p>
        </div>
        </motion.div>
      ))}
      </div>
    </div>
  );
}