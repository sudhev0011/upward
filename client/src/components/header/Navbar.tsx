import React, { useLayoutEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { gsap } from "gsap";

import { LogOut, User, ArrowUpRight, ChevronDown } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";

// UI Components

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Auth & Store

import type { RootState } from "@/store/store";

import { useLogoutMutation } from "@/hooks/auth/useLogout";

import { logout } from "@/store/slices/authSlice";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user, activeRole } = useSelector((state: RootState) => state.auth);

  const { mutate: logoutMutation } = useLogoutMutation();

  const navRef = useRef<HTMLDivElement | null>(null);

  const cardsRef = useRef<HTMLDivElement[]>([]);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const handleLogout = async () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        dispatch(logout());

        // setIsExpanded(false);

        navigate("/login");
      },

      onError: (error) => toast.error(error.message),
    });
  };

  // --- GSAP Card Animation ---

  useLayoutEffect(() => {
    const navEl = navRef.current;

    if (!navEl) return;

    gsap.set(navEl, { height: 64, overflow: "hidden" });

    gsap.set(cardsRef.current, { y: 30, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: window.matchMedia("(max-width: 768px)").matches ? 480 : 300,

      duration: 0.4,

      ease: "power3.inOut",
    });

    tl.to(
      cardsRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.1,
      },
      "-=0.2",
    );

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent hover conflicts

    if (!isExpanded) {
      setIsExpanded(true);

      tlRef.current?.play();
    } else {
      tlRef.current?.reverse().eventCallback("onReverseComplete", () => {
        setIsExpanded(false);
      });
    }
  };

  const navItems = [
    {
      label: "Platform",

      bgColor: "#719FC4",

      textColor: "#ffffff",

      links: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/providers?category=Photography" },
      ],
    },

    {
      label: "Connect",

      bgColor: "#f3f4f6",

      textColor: "#111827",

      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  // Logic: Should the navbar be visible?

  // It's visible if the mouse is hovering over it OR if the menu is clicked open.

  const isVisible = isHovered || isExpanded;

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 w-[95%] max-w-[1200px] z-[99] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]

        ${isVisible ? "top-1" : "top-[-50px]"}

      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- The Thin Line Handle --- */}

      {/* This stays at the top edge when the navbar is hidden */}

      <div
        className={`absolute left-1/2 -translate-x-1/2 w-20 h-5 transition-all duration-300 cursor-pointer

          ${isVisible ? "top-[68px] opacity-0" : "top-[58px] opacity-100"}

        `}
      >
        <ChevronDown className="w-full h-5  rounded-full shadow-[0_0_10px_rgba(113,159,196,0.5)]" />
      </div>

      <nav
        ref={navRef}
        className={`relative rounded-2xl transition-all duration-300 shadow-2xl backdrop-blur-sm border-0`}
      >
        {/* --- Top Bar --- */}

        <div className=" h-[64px] flex items-center justify-between px-6">

          {/* Hamburger Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="flex flex-col items-center justify-center w-10 h-10 gap-1.5 rounded-xl hover:bg-black/5 transition-colors"
          >
            <div
              className={`w-6 h-0.5 bg-gray-900 transition-all ${isExpanded ? "rotate-45 translate-y-2" : ""}`}
            />

            <div
              className={`w-6 h-0.5 bg-gray-900 transition-all ${isExpanded ? "opacity-0" : ""}`}
            />

            <div
              className={`w-6 h-0.5 bg-gray-900 transition-all ${isExpanded ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4] shadow-md group-hover:scale-110 transition-transform">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>

            <span className="text-xl font-black tracking-tighter text-gray-900">
              UPWARD
            </span>
          </Link>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 text-sm font-bold text-gray-700 hover:shadow-md transition-all">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || ""} />

                      <AvatarFallback className="bg-[#719FC4] text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <span className="max-w-[100px] truncate hidden sm:inline">
                      {user?.name}
                    </span>

                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-2 shadow-2xl border-gray-100"
                >
                  <DropdownMenuItem
                    onClick={() => navigate(`/${activeRole}/dashboard`)}
                    className="rounded-xl p-3 cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl p-3 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" className="font-bold rounded-xl">
                    Log In
                  </Button>
                </Link>

                <Link to="/register">
                  <Button className="bg-[#719FC4] hover:bg-[#5585A8] rounded-xl font-bold shadow-lg px-6 text-white">
                    Join
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
        </div>

        {/* --- Card Content (GSAP Animated) --- */}

        <div
          className={`px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {navItems.map((item, idx) => (
            <div
              key={item.label}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el;
              }}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
              className="p-8 rounded-3xl flex flex-col justify-between min-h-[180px] shadow-sm"
            >
              <h3 className="text-3xl font-black tracking-tight">
                {item.label}
              </h3>

              <div className="flex flex-wrap gap-4">
                {item.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => {
                      tlRef.current?.reverse();

                      setIsExpanded(false);
                    }}
                    className="flex items-center gap-1 text-sm font-bold hover:underline underline-offset-4"
                  >
                    {link.label} <ArrowUpRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
