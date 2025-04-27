import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-white to-blue-50/50 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image alt="logo" src="/florence_logo.png" width={120} height={90} className="dark:invert" />
            </Link>
          </motion.div>
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Florence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}