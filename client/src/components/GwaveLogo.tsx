import React from "react";

interface GwaveLogoProps {
  className?: string;
  size?: number;
}

export function GwaveLogo({ className = "size-9", size = 36 }: GwaveLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-label="Gwave Official Brand Logo"
    >
      <defs>
        {/* Top Leaf Upper Light Gradient */}
        <linearGradient id="gwave-top-light" x1="160" y1="180" x2="860" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#98ce26" />
          <stop offset="50%" stopColor="#84bf25" />
          <stop offset="100%" stopColor="#70ad22" />
        </linearGradient>

        {/* Top Leaf Lower Dark Green Gradient */}
        <linearGradient id="gwave-top-dark" x1="200" y1="240" x2="860" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67a627" />
          <stop offset="60%" stopColor="#4a9528" />
          <stop offset="100%" stopColor="#357e23" />
        </linearGradient>

        {/* Left 'G' Spine Outer Curve Gradient */}
        <linearGradient id="gwave-spine-outer" x1="140" y1="360" x2="480" y2="880" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#98ce26" />
          <stop offset="45%" stopColor="#82bd24" />
          <stop offset="85%" stopColor="#6ea921" />
          <stop offset="100%" stopColor="#559924" />
        </linearGradient>

        {/* Left 'G' Spine Inner Shadow Gradient */}
        <linearGradient id="gwave-spine-inner" x1="200" y1="360" x2="460" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#579d26" />
          <stop offset="50%" stopColor="#428a26" />
          <stop offset="100%" stopColor="#2f7521" />
        </linearGradient>

        {/* Center Upright Leaf Gradient */}
        <linearGradient id="gwave-leaf-center-l" x1="690" y1="450" x2="780" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2ca849" />
          <stop offset="100%" stopColor="#1e7e34" />
        </linearGradient>
        <linearGradient id="gwave-leaf-center-r" x1="720" y1="450" x2="780" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e8236" />
          <stop offset="100%" stopColor="#125622" />
        </linearGradient>

        {/* Left Middle Leaf Gradient */}
        <linearGradient id="gwave-leaf-mid-l" x1="470" y1="530" x2="780" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2ca849" />
          <stop offset="100%" stopColor="#1e7e34" />
        </linearGradient>
        <linearGradient id="gwave-leaf-mid-r" x1="500" y1="540" x2="780" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1c7c32" />
          <stop offset="100%" stopColor="#104f1e" />
        </linearGradient>

        {/* Left Bottom Leaf Gradient */}
        <linearGradient id="gwave-leaf-bot-l" x1="390" y1="790" x2="780" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2ba246" />
          <stop offset="100%" stopColor="#1c7a31" />
        </linearGradient>
        <linearGradient id="gwave-leaf-bot-r" x1="400" y1="810" x2="780" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#18722b" />
          <stop offset="100%" stopColor="#0d4619" />
        </linearGradient>

        {/* Right Base Leaflet Gradient */}
        <linearGradient id="gwave-leaf-base" x1="720" y1="780" x2="780" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#25943f" />
          <stop offset="100%" stopColor="#115520" />
        </linearGradient>
      </defs>

      {/* ======================================================== */}
      {/* 1. TOP CURVED LEAF SWOOSH (Upper Bright & Lower Green)   */}
      {/* ======================================================== */}
      {/* Upper surface of top leaf */}
      <path
        d="M 160 440 C 210 270 360 180 570 180 C 690 180 790 200 864 185 C 865 186 780 280 620 280 C 420 280 280 340 160 440 Z"
        fill="url(#gwave-top-light)"
      />
      {/* Lower underbelly of top leaf */}
      <path
        d="M 160 440 C 280 340 420 280 620 280 C 780 280 865 186 864 185 C 840 250 760 375 620 375 C 440 375 280 350 160 440 Z"
        fill="url(#gwave-top-dark)"
      />

      {/* ======================================================== */}
      {/* 2. MAIN 'G' SPINE SWOOSH (Outer Light & Inner Contour)   */}
      {/* ======================================================== */}
      {/* Outer curve forming the 'G' body */}
      <path
        d="M 160 440 C 140 500 148 620 200 710 C 260 810 350 860 460 870 C 440 855 355 790 330 760 C 255 670 205 570 215 450 C 270 390 360 360 440 355 C 330 360 210 400 160 440 Z"
        fill="url(#gwave-spine-outer)"
      />
      {/* Inner shaded contour and tail */}
      <path
        d="M 215 450 C 205 570 255 670 330 760 C 355 790 440 855 460 870 C 380 840 300 760 260 670 C 220 580 215 490 255 425 C 235 435 220 442 215 450 Z"
        fill="url(#gwave-spine-inner)"
      />
      {/* Upper inner arc cusp of 'G' */}
      <path
        d="M 215 450 C 275 390 370 358 440 355 C 340 365 240 410 215 450 Z"
        fill="#3f8823"
      />

      {/* ======================================================== */}
      {/* 3. BOTANICAL CANNABIS 5-LEAF FAN (Bottom Right Inside)   */}
      {/* ======================================================== */}
      {/* --- LEAF 1: Center Upright Leaf (Pointing to ~1:00) --- */}
      {/* Left half */}
      <path
        d="M 780 865 C 770 730 735 590 715 450 C 695 560 690 710 780 865 Z"
        fill="url(#gwave-leaf-center-l)"
      />
      {/* Right half */}
      <path
        d="M 780 865 C 785 710 780 560 715 450 C 740 580 775 730 780 865 Z"
        fill="url(#gwave-leaf-center-r)"
      />

      {/* --- LEAF 2: Upper Left Leaf (Pointing to ~10:30) --- */}
      {/* Upper half */}
      <path
        d="M 780 865 C 670 750 560 640 470 530 C 530 630 630 750 780 865 Z"
        fill="url(#gwave-leaf-mid-l)"
      />
      {/* Lower half */}
      <path
        d="M 780 865 C 630 750 530 630 470 530 C 580 660 690 770 780 865 Z"
        fill="url(#gwave-leaf-mid-r)"
      />

      {/* --- LEAF 3: Lower Left Leaf (Pointing to ~9:00) --- */}
      {/* Upper half */}
      <path
        d="M 780 865 C 630 810 500 785 390 790 C 490 830 630 855 780 865 Z"
        fill="url(#gwave-leaf-bot-l)"
      />
      {/* Lower half */}
      <path
        d="M 780 865 C 630 855 490 830 390 790 C 510 850 650 865 780 865 Z"
        fill="url(#gwave-leaf-bot-r)"
      />

      {/* --- LEAF 4: Right Lateral Leaflet (Pointing to ~2:00) --- */}
      <path
        d="M 780 865 C 790 780 790 700 780 640 C 770 710 765 790 780 865 Z"
        fill="url(#gwave-leaf-base)"
      />

      {/* --- LEAF 5: Base Fan Node & Radiating Veins --- */}
      <path
        d="M 780 865 C 750 850 710 840 680 850 C 720 860 760 865 780 865 Z"
        fill="#0d4619"
      />
      {/* Central Radiance Anchor */}
      <circle cx="780" cy="865" r="4" fill="#1e7e34" />
    </svg>
  );
}

export default GwaveLogo;
