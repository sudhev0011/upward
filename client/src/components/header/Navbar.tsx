import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {user} = useSelector((state:RootState)=> state.auth)
  console.log(user?.email)
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-[hsl(var(--nav-background))] backdrop-blur-xl shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-1.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary from-primary to-accent">
            <ArrowUpRight className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Upward{user?.email}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all after:duration-300 hover:after:left-[20%] hover:after:w-[60%]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="font-medium">
            <Link to={'/login'}>
              Login
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all"
          >
            <Link to={'/register'}>
              Sign Up
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <ArrowUpRight className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-extrabold">Upward</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                <Button variant="outline" className="w-full font-medium">
                  Login
                </Button>
                <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
                  Sign Up
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
