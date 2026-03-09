import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Home",     href: "/" },
    { label: "Services", href: "/services" },
    { label: "About",    href: "/about" },
    { label: "Contact",  href: "/contact" },
  ],
  support: [
    { label: "FAQ",              href: "#" },
    { label: "Help Center",      href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy",   href: "#" },
  ],
};

const socials = [
  {
    label: "X",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">

      {/* ── Main content ── */}
      <div className="container mx-auto px-4 md:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand col */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4] transition-colors duration-200 group-hover:bg-[#5585A8]">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">Upward</span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400 mb-6 max-w-[220px]">
              Your go-to platform for onsite &amp; offsite services. Connect with skilled professionals to get the job done right.
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-all duration-200 hover:bg-[#719FC4] hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              Contact
            </h4>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#719FC4]/15 text-[#719FC4]">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-gray-400">hello@upward.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#719FC4]/15 text-[#719FC4]">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#719FC4]/15 text-[#719FC4]">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-gray-400">New York, NY</span>
              </li>
            </ul>

            {/* Mini newsletter */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2.5">Stay in the loop</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#719FC4]/50 focus:bg-white/8 transition-all duration-200"
                />
                <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#719FC4] text-white transition-all duration-200 hover:bg-[#5585A8] hover:shadow-md">
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
          <p className="text-xs text-gray-600">
            © {year} Upward. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-gray-600 transition-colors duration-200 hover:text-gray-400"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;