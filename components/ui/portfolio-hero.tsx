import React, { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

// Inline Button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// BlurText animation component
interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "none";
  className?: string;
  style?: React.CSSProperties;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  const getYTranslation = () => {
    if (direction === "top") return "-20px";
    if (direction === "bottom") return "20px";
    return "0px";
  };

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : `translateY(${getYTranslation()})`,
            transition: `all 0.6s ease-out ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

export default function PortfolioHero() {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const menuItems = [
    { label: "HOME", href: "#hero", highlight: true },
    { label: "OVERVIEW", href: "#executive-overview" },
    { label: "WORK", href: "#work" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "DECISIONS", href: "#decisions" },
    { label: "RESUME", href: "#resume-download" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <div 
      className="min-h-screen text-foreground transition-colors relative flex flex-col justify-between overflow-hidden"
      style={{
        backgroundColor: isDark ? "hsl(222 47% 7%)" : "hsl(0 0% 98%)",
        color: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
      }}
    >
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 backdrop-blur-md bg-opacity-70">
        <nav className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Menu Trigger */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              className="p-2 transition-colors duration-300 z-50 text-neutral-400 hover:text-white"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              ) : (
                <Menu className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              )}
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute top-full left-0 w-[220px] md:w-[260px] border border-neutral-800 shadow-2xl mt-2 ml-2 p-4 rounded-xl z-[100]"
                style={{
                  backgroundColor: isDark ? "hsl(222 47% 9%)" : "hsl(0 0% 98%)",
                }}
              >
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-base md:text-lg font-bold tracking-tight py-2 px-3 rounded-md cursor-pointer transition-colors duration-200"
                    style={{
                      color: item.highlight ? "#6366F1" : isDark ? "hsl(0 0% 90%)" : "hsl(0 0% 15%)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#6366F1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = item.highlight ? "#6366F1" : (isDark ? "hsl(0 0% 90%)" : "hsl(0 0% 15%)");
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Monogram / Logo */}
          <div className="text-2xl font-bold tracking-tighter" style={{ color: "#6366F1", fontFamily: "'JetBrains Mono', monospace" }}>
            GKS.PM
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full hover:opacity-90 transition-opacity border border-neutral-700"
            style={{ backgroundColor: isDark ? "hsl(222 47% 12%)" : "hsl(0 0% 90%)" }}
            aria-label="Toggle theme"
          >
            <div
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center text-xs"
              style={{
                backgroundColor: isDark ? "#6366F1" : "hsl(0 0% 10%)",
                transform: isDark ? "translateX(1.75rem)" : "translateX(0)",
              }}
            />
          </button>
        </nav>
      </header>

      {/* Main Hero Container: Two Columns (Image Left, 3-Row Typography Right) */}
      <main className="flex-1 flex items-center max-w-screen-2xl mx-auto w-full px-6 sm:px-10 md:px-14 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[440px_1fr] gap-12 lg:gap-16 items-center w-full">
          
          {/* LEFT SIDE: Profile Picture & Status Badge */}
          <div className="flex flex-col items-center lg:items-start justify-center">
            <div className="relative group">
              <div className="w-[260px] h-[340px] sm:w-[320px] sm:h-[400px] md:w-[350px] md:h-[440px] rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-500/30 transition-transform duration-500 group-hover:scale-[1.02] group-hover:border-indigo-400 bg-neutral-900">
                <img
                  src="images/profile.jpg"
                  alt="Ghanshyam Kumar Singh"
                  className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.02]"
                />
                
                {/* Floating Availability Status */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/40 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available / 15–30 Days</span>
                </div>
              </div>

              {/* Quick Credentials Strip */}
              <div className="mt-4 flex items-center gap-3 text-xs font-mono text-neutral-400">
                <span className="px-2.5 py-1 rounded-md bg-neutral-800/80 border border-neutral-700">4+ Yrs PM</span>
                <span className="px-2.5 py-1 rounded-md bg-neutral-800/80 border border-neutral-700">50M+ Scale</span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-bold">+167% Rev</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: 3-Row Animated Typography + Role + Subheadline */}
          <div className="flex flex-col items-start text-left">
            <span className="text-xs sm:text-sm font-mono tracking-wider uppercase text-indigo-400 mb-2 font-semibold">
              Product Management · Consumer Growth · AI Products
            </span>

            {/* 3-Row Massive Typography Animation in Parallel */}
            <div className="flex flex-col leading-[0.88] select-none my-1">
              {/* Row 1: GHANSHYAM (Coming from top) */}
              <div className="overflow-visible">
                <BlurText
                  text="GHANSHYAM"
                  delay={40}
                  animateBy="letters"
                  direction="top"
                  className="font-black text-[46px] sm:text-[76px] md:text-[98px] lg:text-[110px] xl:text-[132px] tracking-tight uppercase"
                  style={{ color: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                />
              </div>

              {/* Row 2: KUMAR (Fading in place) */}
              <div className="overflow-visible">
                <BlurText
                  text="KUMAR"
                  delay={40}
                  animateBy="letters"
                  direction="none"
                  className="font-black text-[46px] sm:text-[76px] md:text-[98px] lg:text-[110px] xl:text-[132px] tracking-tight uppercase"
                  style={{ color: "#6366F1", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                />
              </div>

              {/* Row 3: SINGH (Coming from bottom) */}
              <div className="overflow-visible">
                <BlurText
                  text="SINGH"
                  delay={40}
                  animateBy="letters"
                  direction="bottom"
                  className="font-black text-[46px] sm:text-[76px] md:text-[98px] lg:text-[110px] xl:text-[132px] tracking-tight uppercase"
                  style={{ color: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                />
              </div>
            </div>

            {/* Role Banner Directly Below Name */}
            <div className="mt-5 text-sm sm:text-base md:text-lg font-mono font-semibold text-emerald-400 tracking-wide">
              Product Manager | Growth, Retention, Monetization &amp; 0→1 GenAI
            </div>

            {/* Strategic Tagline */}
            <p className="mt-4 text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-medium leading-relaxed">
              I build products that turn ambiguous problems into measurable business outcomes.
            </p>

            {/* Fast Action Row */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#executive-overview"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-indigo-500/25"
              >
                <span>Explore Executive Overview</span>
                <span>↓</span>
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-semibold text-sm transition-all"
              >
                <span>Selected Case Studies</span>
                <span>→</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Scroll Indicator */}
      <div className="pb-6 flex justify-center w-full">
        <a
          href="#executive-overview"
          className="transition-colors duration-300 text-neutral-500 hover:text-indigo-400 flex flex-col items-center gap-1 font-mono text-xs"
          aria-label="Scroll to Executive Overview"
        >
          <span>Scroll to Overview</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </div>
  );
}
