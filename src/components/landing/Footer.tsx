import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Case Studies", href: "#" },
        { name: "Documentation", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Contact", href: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "HIPAA Compliance", href: "#" },
        { name: "Security", href: "#" },
      ]
    },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-white to-blue-50/50 pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Company Info */}
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="inline-flex"
            >
              <Link href="/" className="flex items-center gap-2">
                <Image alt="Florence logo" src="/Florence.svg" width={30} height={30} className="dark:invert" />
                <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">Florence</h1>
              </Link>
            </motion.div>
            <p className="text-gray-600 pr-4">
              Intelligent patient monitoring system transforming healthcare with AI-powered analysis and proactive care.
            </p>
            <div className="flex items-center gap-2 text-gray-600 pt-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:info@florence-health.ai" className="text-sm hover:text-indigo-700 transition-colors">
                info@florence-health.ai
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <a href="tel:+1234567890" className="text-sm hover:text-indigo-700 transition-colors">
                (123) 456-7890
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Pasadena, CA 91125</span>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-indigo-900 mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-indigo-700 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Florence. All rights reserved.
          </p>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-gray-500 hover:text-indigo-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.97 }}
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}