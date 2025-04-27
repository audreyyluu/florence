import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-center mb-4">
          <Link href="/" className="flex items-center gap-2">
            <Image alt="logo" src="/florence_logo.png" width={140} height={110}></Image>
          </Link>
        </div>
        <p className="text-center text-sm text-foreground/50">
          © {new Date().getFullYear()} Florence. All rights reserved.
        </p>
      </div>
    </footer>
  );
}