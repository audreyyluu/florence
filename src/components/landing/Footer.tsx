import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-center mb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <span className="text-xl font-bold">CareCam</span>
          </Link>
        </div>
        <p className="text-center text-sm text-foreground/50">
          © {new Date().getFullYear()} CareCam Hospital Surveillance. All rights reserved.
        </p>
      </div>
    </footer>
  );
}