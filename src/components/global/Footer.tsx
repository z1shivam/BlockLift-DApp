import { FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa';
import { henny_penny } from './Header';

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={`text-lg font-semibold ${henny_penny.className}`}>BlockLift</h3>
            <p className="mt-2 text-emerald-300">
              Empowering creators with transparent, secure funding.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="/about" className="hover:text-emerald-400">
                  About
                </a>
              </li>
              <li>
                <a href="/campaigns" className="hover:text-emerald-400">
                  Campaigns
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-emerald-400">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="mt-2 flex space-x-4">
              <a href="https://twitter.com" className="hover:text-emerald-400">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="https://github.com" className="hover:text-emerald-400">
                <FaGithub className="text-2xl" />
              </a>
              <a href="https://discord.com" className="hover:text-emerald-400">
                <FaDiscord className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-emerald-700 pt-4 text-center">
          <p>&copy; 2025 BlockLift Decentralized. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}