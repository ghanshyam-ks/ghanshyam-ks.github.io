import React, { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

// Inline Button component compatible with shadcn conventions
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
  direction?: "top" | "bottom";
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

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: `all 0.5s ease-out ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

export interface PortfolioHeroProps {
  firstName?: string;
  lastName?: string;
  tagline?: string;
  profileImage?: string;
  accentColor?: string;
}

export default function PortfolioHero({
  firstName = "GHANSHYAM",
  lastName = "SINGH",
  tagline = "Product Manager building 0→1 platforms & scaling high-volume products.",
  profileImage = "/images/profile.jpg",
  accentColor = "#C3E41D",
}: PortfolioHeroProps) {
  const [isDark, setIsDark] = useState(false); // default to clean light mode as preferred by user
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

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
  };

  const menuItems = [
    { label: "HOME", href: "#", highlight: true },
    { label: "CASE STUDIES", href: "#work" },
    { label: "RESUMES", href: "#resumes" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "SKILLS & EDUCATION", href: "#skills" },
    { label: "CONTACT", href: "#contact" },
  ];

  const scrollToContent = () => {
    const target = document.querySelector("#work") || document.querySelector(".metrics-strip");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className="min-h-screen text-foreground transition-colors relative overflow-hidden"
      style={{
        backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)",
        color: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
      }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 backdrop-blur-md bg-opacity-70">
        <nav className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Menu Button */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              className="p-2 transition-colors duration-300 z-50 text-neutral-500 hover:text-black dark:hover:text-white"
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
                className="absolute top-full left-0 w-[220px] md:w-[260px] border border-neutral-200 dark:border-neutral-800 shadow-2xl mt-2 ml-2 p-4 rounded-xl z-[100]"
                style={{
                  backgroundColor: isDark ? "hsl(0 0% 4%)" : "hsl(0 0% 100%)",
                }}
              >
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-base md:text-lg font-bold tracking-tight py-2 px-3 rounded-lg cursor-pointer transition-colors duration-200"
                    style={{
                      color: item.highlight ? accentColor : isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = accentColor;
                      e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = item.highlight ? accentColor : (isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)");
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Signature */}
          <div 
            className="text-4xl select-none font-serif tracking-widest" 
            style={{ 
              color: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)", 
              fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive" 
            }}
          >
            G
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative w-16 h-8 rounded-full hover:opacity-90 transition-all border border-neutral-300 dark:border-neutral-700"
            style={{ backgroundColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)" }}
            aria-label="Toggle theme"
          >
            <div
              className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300 shadow-md"
              style={{
                backgroundColor: isDark ? accentColor : "hsl(0 0% 100%)",
                transform: isDark ? "translateX(2rem)" : "translateX(0)",
              }}
            />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col justify-center items-center">
        {/* Centered Main Name */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 select-none">
          <div className="relative text-center">
            <div>
              <BlurText
                text={firstName}
                delay={80}
                animateBy="letters"
                direction="top"
                className="font-bold text-[72px] sm:text-[110px] md:text-[150px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase justify-center whitespace-nowrap"
                style={{ color: accentColor, fontFamily: "'Fira Code', monospace" }}
              />
            </div>
            <div>
              <BlurText
                text={lastName}
                delay={80}
                animateBy="letters"
                direction="top"
                className="font-bold text-[72px] sm:text-[110px] md:text-[150px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase justify-center whitespace-nowrap"
                style={{ color: accentColor, fontFamily: "'Fira Code', monospace" }}
              />
            </div>

            {/* Center Capsule Profile Picture */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto">
              <div 
                className="w-[70px] h-[115px] sm:w-[95px] sm:h-[155px] md:w-[120px] md:h-[195px] lg:w-[138px] lg:h-[225px] rounded-full overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105 cursor-pointer border-2 border-white dark:border-neutral-900 ring-4 ring-black/5 dark:ring-white/10"
              >
                <img
                  src={profileImage}
                  alt={`${firstName} ${lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-28 left-1/2 -translate-x-1/2 w-full px-6">
          <div className="flex justify-center">
            <BlurText
              text={tagline}
              delay={120}
              animateBy="words"
              direction="top"
              className="text-[14px] sm:text-[17px] md:text-[19px] lg:text-[21px] text-center transition-colors duration-300 text-neutral-500 hover:text-black dark:hover:text-white max-w-2xl font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          type="button"
          onClick={scrollToContent}
          className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 hover:translate-y-1 p-2 animate-bounce"
          aria-label="Scroll down to explore case studies"
        >
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-300" />
        </button>
      </main>
    </div>
  );
}
