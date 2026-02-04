import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Coder Ride
            </h3>
            <p className="text-slate-400">
              A community of passionate developers building amazing projects together.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/members" className="hover:text-primary transition-colors">
                  Members
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="/terms-privacy" className="hover:text-primary transition-colors">
                  Terms of Service and Privacy Policy
                </a>
              </li>
              <li>
                <Link href="https://svist.org" className="hover:text-primary transition-colors">
                  College Main
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Social</h4>
            <div className="flex gap-4">
              <Link
                href="https://github.com/Coding-Club-SVIST"
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <Github size={20} />
              </Link>
              <a
                href="#"
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Coder Ride. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
