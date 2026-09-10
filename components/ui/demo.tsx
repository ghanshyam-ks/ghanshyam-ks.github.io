import React from "react";
import PortfolioHero from "./portfolio-hero";

export default function Demo() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=JetBrains+Mono:wght@500;700&display=swap"
      />
      <div className="w-full min-h-screen">
        <PortfolioHero />
      </div>
    </>
  );
}
