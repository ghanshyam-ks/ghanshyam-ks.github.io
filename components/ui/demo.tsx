import React from "react";
import PortfolioHero from "@/components/ui/portfolio-hero";

export default function Demo() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@700&family=Inter:wght@400;500;600;700&family=Antic&display=swap"
      />
      <div className="w-full">
        <PortfolioHero
          firstName="GHANSHYAM"
          lastName="SINGH"
          tagline="Product Manager building 0→1 platforms & scaling high-volume products."
          profileImage="/images/profile.jpg"
          accentColor="#C3E41D"
        />
      </div>
    </>
  );
}
