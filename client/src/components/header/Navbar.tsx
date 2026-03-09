import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, ArrowUpRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useLogoutMutation } from "@/hooks/auth/useLogout";
import { toast } from "sonner";
import { logout } from "@/store/slices/authSlice";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const { mutate: logoutMutation } = useLogoutMutation();

  /* Scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = async () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        dispatch(logout());
        navigate("/login");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const isActive = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-lg transition-all duration-300 ${
        scrolled
          ? "shadow-sm border-b border-gray-100"
          : "border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* ── Brand ── */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4] transition-all duration-200 group-hover:bg-[#5585A8]">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            Upward
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg ${
                isActive(link.href)
                  ? "text-[#719FC4]"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-1.5 left-4 right-4 h-0.5 rounded-full bg-[#719FC4]" />
              )}
            </Link>
          ))}
        </nav>

        {/* ── Desktop auth ── */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-[#719FC4]/40 hover:shadow-sm focus:outline-none">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback className="bg-[#719FC4] text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border-gray-100 shadow-lg p-1.5"
              >
                <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback className="bg-[#719FC4] text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {user?.name}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-gray-100" />

                <DropdownMenuItem
                  onClick={() => navigate(`/${user?.role}/dashboard`)}
                  className="rounded-lg cursor-pointer gap-2.5 text-sm font-medium text-gray-700 focus:bg-[#EAF2F9] focus:text-[#5585A8]"
                >
                  <User className="h-4 w-4" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-lg cursor-pointer gap-2.5 text-sm font-medium text-gray-700 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-[#719FC4] hover:bg-[#5585A8] text-white text-sm font-semibold px-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile menu ── */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-72 bg-white border-gray-100 p-0"
          >
            <SheetHeader className="px-5 pt-5 pb-4 border-b border-gray-100">
              <SheetTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4]">
                  <ArrowUpRight className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-extrabold text-gray-900">
                  Upward
                </span>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-3 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-[#EAF2F9] text-[#719FC4]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto px-3 pt-6 pb-6 border-t border-gray-100 mx-3 mt-6">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 mb-1">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar || ""} />
                      <AvatarFallback className="bg-[#719FC4] text-white text-xs font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 text-sm font-medium text-gray-600 hover:bg-[#EAF2F9] hover:text-[#719FC4] rounded-xl"
                    onClick={() => {
                      setOpen(false);
                      navigate(`/${user?.role}/dashboard`);
                    }}
                  >
                    <User className="h-4 w-4" /> Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-2">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full text-sm font-semibold border-gray-200 text-gray-700 hover:border-[#719FC4]/50 hover:text-[#719FC4] rounded-xl"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-[#719FC4] hover:bg-[#5585A8] text-white text-sm font-semibold rounded-xl shadow-sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
