// This is the landing page for CareCam hospital surveillance website
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
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="max-w-6xl mx-auto relative px-4">
        <Header />
        <HeroContent />
      </div>
      <Footer />
    </motion.div>
  );
}