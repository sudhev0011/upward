import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[hsl(var(--footer-background))] text-[hsl(var(--footer-foreground))]">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary from-primary to-accent">
                <ArrowUpRight className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">Upward</span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              Your go-to platform for onsite &amp; offsite services. We connect you with skilled professionals to get the job done right.
            </p>
            <div className="flex gap-3 pt-1">
              {["X", "In", "Fb"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[hsl(var(--footer-foreground)/0.2)] text-xs font-bold opacity-60 transition-all hover:opacity-100 hover:border-primary hover:text-primary"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-50">Quick Links</h4>
            <ul className="space-y-2.5">
              {["Home", "Services", "About", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase() === "home" ? "" : link.toLowerCase()}`}
                    className="text-sm opacity-70 transition-all hover:opacity-100 hover:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-50">Support</h4>
            <ul className="space-y-2.5">
              {["FAQ", "Help Center", "Terms of Service", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm opacity-70 transition-all hover:opacity-100 hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-50">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Mail className="h-4 w-4 shrink-0 text-primary" /> hello@upward.com
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Phone className="h-4 w-4 shrink-0 text-primary" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <MapPin className="h-4 w-4 shrink-0 text-primary" /> New York, NY
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[hsl(var(--footer-foreground)/0.1)]">
        <div className="container flex items-center justify-center py-5">
          <p className="text-xs opacity-50">© {year} Upward. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
