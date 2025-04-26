import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AuthButton } from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";

export function FeaturesSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="container py-24 px-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="mx-auto max-w-2xl text-center"
      >
        <h3 className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">Hospital Surveillance</h3>
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Comprehensive Monitoring Solutions
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          CareCam provides advanced surveillance technology designed specifically for healthcare environments, 
          helping medical staff provide better care through enhanced monitoring capabilities.
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10"
        >
          <AuthButton trigger={<Button size="lg" className="mx-2">Get Started</Button>} />
          <Button variant="outline" size="lg" className="mx-2" asChild>
            <a href="#features">Learn More</a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}