// This is the landing page for Florence intelligent patient monitoring system
"use client"
import { HeroContent } from "@/components/landing/HeroContent";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #f9fafb, #ffffff)",
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '15px 15px'
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto relative px-6 z-10 w-full py-0">
        <Header />
        
        {/* Main content with section IDs */}
        <section id="hero">
          <HeroContent />
        </section>
      </div>
      
      {/* Hidden anchor tags for navigation */}
      <div className="hidden">
        <div id="features"></div>
        <div id="benefits"></div>
        <div id="pricing"></div>
      </div>
      
      <Footer />
    </motion.div>
  );
}