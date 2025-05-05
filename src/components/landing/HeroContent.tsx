import React from 'react';
import { AuthButton } from '@/components/auth/AuthButton';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { Eye, Bell, Map, MessageCircle, ChevronDown, Clock, Shield, Zap, Award, CheckCircle, Brain, TrendingUp, HeartPulse, Cpu } from 'lucide-react';

export function HeroContent() {
  const features = [
    {
      icon: Eye,
      title: "Real-Time Monitoring",
      description: "Florence provides intelligent, continuous surveillance that alerts staff only when intervention is needed, reducing alert fatigue and ensuring patients receive timely care.",
      imagePath: "home/patient.png"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Our advanced AI analyzes behavioral patterns, vital signs, and historical patient data to generate predictive insights and identify potential issues before they escalate.",
      imagePath: "home/activity.png"
    },
    {
      icon: HeartPulse,
      title: "Proactive Care",
      description: "Transform your approach from reactive to prediction-guided preventative care, significantly reducing adverse events and improving patient outcomes.",
      imagePath: "home/chat.png"
    },
    {
      icon: Map,
      title: "Comprehensive Dashboard",
      description: "Access a unified view of all patient rooms with intelligent prioritization, ensuring nursing staff can practice at the highest level of their expertise.",
      imagePath: "home/map.png"
    }
  ];

  const differentiators = [
    {
      icon: Clock,
      title: "Operational Efficiency",
      description: "Reduce time spent on routine surveillance, documentation, and coordination tasks, allowing nursing staff to focus on direct patient care."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with end-to-end encryption and full regulatory compliance ensures patient data privacy at all times."
    },
    {
      icon: Cpu,
      title: "Intelligent Alerts",
      description: "Sophisticated algorithms distinguish between routine activities and actual emergencies, dramatically reducing false alarms and alert fatigue."
    },
    {
      icon: TrendingUp,
      title: "Proven Results",
      description: "Hospitals using Florence report significantly improved patient outcomes, operational efficiency, and staff satisfaction."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$499",
      period: "per month",
      description: "Perfect for small healthcare facilities",
      features: [
        "Up to 20 rooms monitored",
        "Basic fall detection",
        "8/5 technical support",
        "7-day data retention"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      price: "$1,499",
      period: "per month",
      description: "Ideal for mid-sized hospitals",
      features: [
        "Up to 100 rooms monitored",
        "Advanced activity prediction",
        "24/7 technical support",
        "30-day data retention",
        "Custom alert configuration"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom Pricing",
      period: "",
      description: "For large healthcare networks",
      features: [
        "Unlimited rooms",
        "Full AI prediction suite",
        "Dedicated support team",
        "Unlimited data retention",
        "Advanced analytics dashboard",
        "Custom EHR integrations"
      ],
      highlighted: false
    }
  ];

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center w-full gap-6 mb-12 min-h-[85vh] relative pt-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="flex flex-col items-center relative z-10 w-full max-w-7xl mx-auto">
          {/* Centered text content */}
          <div className="w-full space-y-6 text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 mx-auto inline-block"
            >
              <div className="px-4 py-1 bg-blue-50 border border-blue-100 rounded-full">
                <p className="text-sm font-medium text-blue-600">Intelligent Patient Monitoring</p>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-medium italic tracking-tighter text-indigo-900 leading-tight"            
            >
              Transform Patient Care with AI Intelligence
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            > 
              Florence is an intelligent, real-time patient monitoring system that optimizes hospital operations, reduces nursing workload, and transforms reactive care into proactive intervention.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-5 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <AuthButton
                trigger={
                  <Button
                    size="lg"
                    className="
                      px-8 py-6
                      text-lg font-medium
                      text-white
                      rounded-full
                      bg-indigo-600
                      hover:bg-indigo-700
                      shadow-md shadow-indigo-500/30
                      transition-colors duration-200
                      w-full sm:w-auto
                    "
                  >
                    Get Started
                  </Button>
                }
              />
              <Button
                size="lg"
                variant="outline"
                className="
                  px-8 py-6
                  text-lg font-medium
                  rounded-full
                  border-indigo-300
                  text-indigo-700
                  hover:bg-indigo-50
                  transition-colors duration-200
                  w-full sm:w-auto
                "
                onClick={scrollToFeatures}
              >
                Learn More
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Dashboard image below text, now larger */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="w-full max-w-7xl mt-12 rounded-2xl overflow-hidden shadow-2xl relative group"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 z-10 pointer-events-none rounded-2xl"></div>
            <img 
              src="/home/dashboard.png" 
              alt="Florence Patient Monitoring Dashboard" 
              className="w-full h-auto object-contain relative z-10 transform transition duration-500 group-hover:scale-[1.02]"
              style={{ maxWidth: 'none' }}
            />
          </motion.div>
        </div>
      </div>
      {/* Features Section */}
      <div className="features-section w-full max-w-7xl mx-auto space-y-28 py-20" id="features">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-indigo-900"
        >
          The Florence Advantage
        </motion.h2>
        
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-16">
          Our advanced AI-powered features that transform patient monitoring and healthcare delivery
        </p>
        
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
      </div>

      {/* Why We Shine Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full py-20"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-indigo-900">Why Florence Shines?</h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-16">The intelligent solution that transforms healthcare operations and improves outcomes</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-5 p-8 bg-white rounded-xl shadow-lg"
              >
                <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-full">
                  <item.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-indigo-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pricing Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full py-20"
        id="pricing"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-indigo-900">Transparent Pricing</h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-16">Choose the plan that best fits your healthcare facility's needs</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col h-full p-8 rounded-2xl shadow-xl ${
                  plan.highlighted 
                    ? 'bg-gradient-to-b from-indigo-600 to-blue-700 text-white relative z-10 transform scale-105' 
                    : 'bg-white'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-indigo-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-indigo-600'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mb-6 ${plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <div className="flex-grow">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className={`h-5 w-5 flex-shrink-0 ${
                          plan.highlighted ? 'text-indigo-200' : 'text-indigo-500'
                        }`} />
                        <span className={plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <AuthButton trigger={
                  <Button 
                    size="lg" 
                    className={`w-full py-6 rounded-xl ${
                      plan.highlighted 
                        ? 'bg-white text-indigo-700 hover:bg-gray-100' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {plan.highlighted ? 'Get Started' : 'Choose Plan'}
                  </Button>
                } />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
        
      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="my-20 w-full max-w-7xl mx-auto px-4"
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-12 rounded-3xl shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Ready to transform patient care?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 text-center">
            Join leading hospitals nationwide that trust Florence to monitor patients, optimize staff time, and improve outcomes.
          </p>
          <div className="flex justify-center">
            <AuthButton trigger={
              <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 px-8 py-6 text-lg font-medium">
                Request Demo
              </Button>
            } />
          </div>
        </div>
      </motion.div>
    </div>
  );
}