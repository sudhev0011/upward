import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Home, ArrowLeft, UserPlus, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect users to providers page with search query
      navigate(`/providers?category=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/providers");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-zinc-950 flex flex-col items-center justify-center py-16 px-4 md:px-8">
      {/* Dynamic Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-[#719FC4]/15 blur-[80px] dark:bg-[#719FC4]/10"
        />
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-[#FF6363]/15 blur-[80px] dark:bg-[#FF6363]/10"
        />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl relative z-10 text-center flex flex-col items-center"
      >
        {/* Animated 404 Typography */}
        <div className="flex justify-center gap-2 mb-4 select-none">
          {["4", "0", "4"].map((char, index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
              className="text-8xl md:text-[10rem] font-black tracking-tighter bg-gradient-to-b from-[#719FC4] to-[#5585A8] bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(113,159,196,0.15)] dark:from-[#A0C4E1] dark:to-[#719FC4]"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Text Details */}
        <motion.div variants={itemVariants} className="max-w-md mx-auto mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-zinc-50 mb-3 tracking-tight">
            Looks like you're a bit lost!
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">
            This page has climbed out of reach or doesn't exist anymore. Let's get you back on track.
          </p>
        </motion.div>

        {/* Search Bar - Interactive Utility */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSearchSubmit}
          className="w-full max-w-md mb-10 px-2"
        >
          <div className="relative flex items-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-zinc-800/80 shadow-lg shadow-gray-100/30 dark:shadow-none p-1.5 focus-within:border-[#719FC4]/50 focus-within:ring-2 focus-within:ring-[#719FC4]/10 transition-all duration-300">
            <div className="pl-3 pr-2 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search for service categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 dark:text-zinc-100 placeholder-gray-400 font-medium outline-none border-none px-1 text-sm md:text-base py-2"
            />
            <Button
              type="submit"
              className="bg-[#719FC4] hover:bg-[#5585A8] text-white font-bold text-xs md:text-sm px-4 py-2 h-auto rounded-xl transition-all shadow-md shadow-[#719FC4]/10"
            >
              Search
            </Button>
          </div>
        </motion.form>

        {/* Navigation Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 w-full max-w-md px-2"
        >
          <Link to="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full h-12 md:h-14 gap-2 bg-[#719FC4] text-white font-bold rounded-xl shadow-lg shadow-[#719FC4]/20 hover:bg-[#5585A8] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Home className="h-5 w-5" />
              Take Me Home
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto h-12 md:h-14 gap-2 border-2 border-gray-200 dark:border-zinc-800 bg-transparent text-gray-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
        </motion.div>

        {/* Suggestion Cards */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-left px-2"
        >
          <Link
            to="/providers"
            className="group flex gap-4 p-5 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md border border-gray-100 dark:border-zinc-900/50 rounded-2xl transition-all duration-300 hover:bg-[#719FC4]/5 hover:border-[#719FC4]/30 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2F9] dark:bg-zinc-900 text-[#719FC4] group-hover:scale-110 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm group-hover:text-[#719FC4] transition-colors">
                Explore Services
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Browse our curated categories of skilled pros.
              </p>
            </div>
          </Link>

          <Link
            to="/register"
            className="group flex gap-4 p-5 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md border border-gray-100 dark:border-zinc-900/50 rounded-2xl transition-all duration-300 hover:bg-[#FF6363]/5 hover:border-[#FF6363]/30 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-zinc-900 text-[#FF6363] group-hover:scale-110 transition-transform">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm group-hover:text-[#FF6363] transition-colors">
                Become a Provider
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                List your skills and start getting bookings.
              </p>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
