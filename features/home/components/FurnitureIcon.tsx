"use client";
import { memo } from "react";

interface FurnitureIconProps {
  slug: string;
  size?: number;
  className?: string;
}

export const FurnitureIcon = memo(function FurnitureIcon({ slug, size = 36, className }: FurnitureIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      style={{ overflow: "visible" }}
      className={className}
    >
      <FurnitureShape slug={slug} />
    </svg>
  );
});

function FurnitureShape({ slug }: { slug: string }) {
  switch (slug) {
    case "furniture_couch":
      return (
        <g>
          {/* Back cushion */}
          <rect x="6" y="10" width="48" height="22" rx="7" fill="#8B7355" />
          {/* Left arm */}
          <rect x="4" y="16" width="10" height="30" rx="5" fill="#9B8364" />
          {/* Right arm */}
          <rect x="46" y="16" width="10" height="30" rx="5" fill="#9B8364" />
          {/* Seat base */}
          <rect x="4" y="28" width="52" height="18" rx="5" fill="#7B6554" />
          {/* Left seat cushion */}
          <rect x="14" y="28" width="14" height="16" rx="4" fill="#A08870" />
          {/* Right seat cushion */}
          <rect x="32" y="28" width="14" height="16" rx="4" fill="#A08870" />
          {/* Cushion divider */}
          <line x1="30" y1="29" x2="30" y2="43" stroke="#7B6554" strokeWidth="1.5" />
          {/* Legs */}
          <rect x="10" y="46" width="5" height="10" rx="2" fill="#5C4A2A" />
          <rect x="45" y="46" width="5" height="10" rx="2" fill="#5C4A2A" />
          {/* Back cushion highlight */}
          <rect x="14" y="13" width="12" height="14" rx="4" fill="#9B8877" opacity="0.6" />
          <rect x="34" y="13" width="12" height="14" rx="4" fill="#9B8877" opacity="0.6" />
        </g>
      );

    case "furniture_table":
      return (
        <g>
          {/* Tabletop */}
          <rect x="4" y="14" width="52" height="10" rx="4" fill="#A0784A" />
          {/* Tabletop shine */}
          <rect x="8" y="16" width="44" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
          {/* Legs */}
          <rect x="9" y="24" width="5" height="28" rx="2" fill="#8B6438" />
          <rect x="46" y="24" width="5" height="28" rx="2" fill="#8B6438" />
          {/* Cross brace */}
          <rect x="10" y="38" width="40" height="4" rx="2" fill="#A0784A" />
          {/* Coffee cup on top */}
          <rect x="26" y="8" width="8" height="8" rx="3" fill="#fafafa" />
          <rect x="27" y="9" width="6" height="5" rx="1" fill="#c8860a" opacity="0.8" />
          <path d="M34 11 Q37 11 37 13 Q37 15 34 15" fill="none" stroke="#fafafa" strokeWidth="1.2" />
        </g>
      );

    case "furniture_bookshelf":
      return (
        <g>
          {/* Frame */}
          <rect x="5" y="4" width="50" height="52" rx="3" fill="#7B5B3A" />
          <rect x="7" y="6" width="46" height="48" rx="2" fill="#6B4E30" />
          {/* Shelves */}
          <rect x="7" y="24" width="46" height="3" fill="#7B5B3A" />
          <rect x="7" y="40" width="46" height="3" fill="#7B5B3A" />
          {/* Bottom shelf books */}
          <rect x="9" y="43" width="7" height="9" rx="1" fill="#E74C3C" />
          <rect x="17" y="44" width="5" height="8" rx="1" fill="#3498DB" />
          <rect x="23" y="43" width="8" height="9" rx="1" fill="#27AE60" />
          <rect x="32" y="44" width="6" height="8" rx="1" fill="#F39C12" />
          <rect x="39" y="43" width="7" height="9" rx="1" fill="#9B59B6" />
          <rect x="47" y="44" width="5" height="8" rx="1" fill="#E67E22" />
          {/* Middle shelf books */}
          <rect x="9" y="27" width="6" height="10" rx="1" fill="#1ABC9C" />
          <rect x="16" y="28" width="8" height="9" rx="1" fill="#E74C3C" />
          <rect x="25" y="27" width="5" height="10" rx="1" fill="#F1C40F" />
          <rect x="31" y="27" width="7" height="10" rx="1" fill="#2980B9" />
          <rect x="39" y="28" width="6" height="9" rx="1" fill="#8E44AD" />
          <rect x="46" y="27" width="7" height="10" rx="1" fill="#16A085" />
          {/* Top shelf books */}
          <rect x="9" y="10" width="7" height="11" rx="1" fill="#C0392B" />
          <rect x="17" y="11" width="5" height="10" rx="1" fill="#2C3E50" />
          <rect x="23" y="10" width="8" height="11" rx="1" fill="#27AE60" />
          <rect x="32" y="11" width="6" height="10" rx="1" fill="#D35400" />
          <rect x="39" y="10" width="7" height="11" rx="1" fill="#8E44AD" />
          <rect x="47" y="11" width="6" height="10" rx="1" fill="#16A085" />
        </g>
      );

    case "furniture_plant":
      return (
        <g>
          {/* Pot */}
          <path d="M20 42 L18 56 L42 56 L40 42 Z" fill="#C0784A" />
          <rect x="18" y="40" width="24" height="5" rx="2" fill="#D4894E" />
          {/* Soil */}
          <ellipse cx="30" cy="42" rx="12" ry="4" fill="#5C3D1A" />
          {/* Stem */}
          <line x1="30" y1="42" x2="30" y2="20" stroke="#2ECC71" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaves */}
          <ellipse cx="30" cy="20" rx="12" ry="10" fill="#27AE60" />
          <ellipse cx="18" cy="28" rx="9" ry="7" fill="#2ECC71" transform="rotate(-30 18 28)" />
          <ellipse cx="42" cy="28" rx="9" ry="7" fill="#2ECC71" transform="rotate(30 42 28)" />
          <ellipse cx="22" cy="17" rx="8" ry="6" fill="#27AE60" transform="rotate(-20 22 17)" />
          <ellipse cx="38" cy="17" rx="8" ry="6" fill="#27AE60" transform="rotate(20 38 17)" />
          {/* Pot highlight */}
          <line x1="24" y1="43" x2="22" y2="54" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case "furniture_bed":
      return (
        <g>
          {/* Bed frame */}
          <rect x="4" y="20" width="52" height="34" rx="5" fill="#8B6438" />
          {/* Headboard */}
          <rect x="4" y="10" width="14" height="28" rx="4" fill="#A07850" />
          {/* Mattress */}
          <rect x="6" y="22" width="48" height="30" rx="4" fill="#ECE0D5" />
          {/* Pillow */}
          <rect x="8" y="24" width="14" height="12" rx="4" fill="#FAFAFA" />
          <rect x="9" y="25" width="12" height="10" rx="3" fill="#f0f0f0" />
          {/* Blanket */}
          <rect x="8" y="36" width="48" height="14" rx="4" fill="#5B8DB8" />
          <rect x="8" y="36" width="48" height="5" rx="3" fill="#6B9DC8" />
          {/* Blanket fold lines */}
          <line x1="20" y1="38" x2="20" y2="50" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
          <line x1="32" y1="38" x2="32" y2="50" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
          <line x1="44" y1="38" x2="44" y2="50" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
        </g>
      );

    case "furniture_tv":
      return (
        <g>
          {/* TV back/body */}
          <rect x="4" y="8" width="52" height="34" rx="5" fill="#2C3E50" />
          {/* Screen */}
          <rect x="7" y="11" width="46" height="28" rx="3" fill="#1A252F" />
          {/* Screen glow (content) */}
          <rect x="8" y="12" width="44" height="26" rx="2" fill="#1a3a5c" />
          {/* Screen pixels / content suggestion */}
          <rect x="12" y="15" width="20" height="14" rx="1" fill="#2980B9" opacity="0.7" />
          <rect x="34" y="15" width="14" height="6" rx="1" fill="#27AE60" opacity="0.6" />
          <rect x="34" y="23" width="14" height="6" rx="1" fill="#E74C3C" opacity="0.5" />
          {/* Screen shine */}
          <path d="M9 13 L21 13 L14 22 Z" fill="rgba(255,255,255,0.06)" />
          {/* Stand pole */}
          <rect x="26" y="42" width="8" height="8" rx="2" fill="#34495E" />
          {/* Stand base */}
          <rect x="18" y="50" width="24" height="5" rx="3" fill="#2C3E50" />
          {/* Power button */}
          <circle cx="51" cy="37" r="2" fill="#27AE60" />
        </g>
      );

    case "furniture_rug":
      return (
        <g>
          {/* Outer rug */}
          <rect x="3" y="12" width="54" height="36" rx="6" fill="#8B4513" />
          {/* Inner rug (main field) */}
          <rect x="6" y="15" width="48" height="30" rx="4" fill="#A0522D" />
          {/* Pattern border */}
          <rect x="8" y="17" width="44" height="26" rx="3" fill="none" stroke="#D4884A" strokeWidth="1.5" />
          {/* Corner ornaments */}
          <circle cx="12" cy="21" r="3" fill="#D4884A" />
          <circle cx="48" cy="21" r="3" fill="#D4884A" />
          <circle cx="12" cy="39" r="3" fill="#D4884A" />
          <circle cx="48" cy="39" r="3" fill="#D4884A" />
          {/* Center medallion */}
          <circle cx="30" cy="30" r="8" fill="#7B3F1A" />
          <circle cx="30" cy="30" r="5" fill="#D4884A" />
          <circle cx="30" cy="30" r="2.5" fill="#F5A060" />
          {/* Side diamonds */}
          <polygon points="30,18 34,22 30,26 26,22" fill="#D4884A" />
          <polygon points="30,34 34,38 30,42 26,38" fill="#D4884A" />
          <polygon points="18,30 22,26 26,30 22,34" fill="#D4884A" />
          <polygon points="42,30 38,26 34,30 38,34" fill="#D4884A" />
          {/* Fringe */}
          <g stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round">
            {[5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53].map((x) => (
              <g key={x}>
                <line x1={x} y1="12" x2={x - 1} y2="7" />
                <line x1={x} y1="48" x2={x - 1} y2="53" />
              </g>
            ))}
          </g>
        </g>
      );

    case "furniture_lamp":
      return (
        <g>
          {/* Warm glow halo */}
          <ellipse cx="30" cy="24" rx="18" ry="10" fill="#FFF8E1" opacity="0.3" />
          {/* Shade */}
          <path d="M17 28 L22 14 L38 14 L43 28 Z" fill="#F0A030" />
          <path d="M17 28 L43 28" stroke="#D4882A" strokeWidth="1.5" />
          <path d="M22 14 L38 14" stroke="#D4882A" strokeWidth="1.5" />
          {/* Shade inner */}
          <path d="M18 27 L23 15 L37 15 L42 27 Z" fill="#FFBD44" opacity="0.5" />
          {/* Bulb glow */}
          <ellipse cx="30" cy="24" rx="6" ry="5" fill="#FFF176" opacity="0.7" />
          {/* Pole */}
          <rect x="28.5" y="28" width="3" height="20" rx="1.5" fill="#7B5B3A" />
          {/* Base */}
          <ellipse cx="30" cy="48" rx="10" ry="5" fill="#6B4E30" />
          <ellipse cx="30" cy="48" rx="7" ry="3" fill="#8B6848" />
        </g>
      );

    case "furniture_window":
      return (
        <g>
          {/* Curtain left */}
          <path d="M4 6 Q8 16 6 54 L12 54 Q10 16 14 6 Z" fill="#E74C3C" />
          <path d="M4 6 Q12 10 14 6" fill="#C0392B" />
          {/* Curtain right */}
          <path d="M56 6 Q52 16 54 54 L48 54 Q50 16 46 6 Z" fill="#E74C3C" />
          <path d="M56 6 Q48 10 46 6" fill="#C0392B" />
          {/* Window frame */}
          <rect x="11" y="6" width="38" height="48" rx="3" fill="#8B6438" />
          {/* Sky / glass */}
          <rect x="13" y="8" width="34" height="44" rx="2" fill="#87CEEB" />
          {/* Sky gradient suggestion */}
          <rect x="13" y="8" width="34" height="20" rx="2" fill="#6BB8E8" />
          {/* Cross bars */}
          <rect x="11" y="29" width="38" height="3" fill="#8B6438" />
          <rect x="28.5" y="8" width="3" height="44" fill="#8B6438" />
          {/* Clouds */}
          <ellipse cx="22" cy="18" rx="6" ry="4" fill="white" opacity="0.8" />
          <ellipse cx="26" cy="16" rx="5" ry="3" fill="white" opacity="0.8" />
          <ellipse cx="40" cy="22" rx="5" ry="3" fill="white" opacity="0.7" />
          {/* Sun */}
          <circle cx="38" cy="14" r="5" fill="#F1C40F" opacity="0.9" />
        </g>
      );

    case "furniture_cat":
      return (
        <g>
          {/* Body */}
          <ellipse cx="30" cy="42" rx="16" ry="12" fill="#F0A040" />
          {/* Head */}
          <circle cx="30" cy="25" r="14" fill="#F0A040" />
          {/* Ears */}
          <polygon points="18,16 14,6 24,14" fill="#F0A040" />
          <polygon points="42,16 46,6 36,14" fill="#F0A040" />
          <polygon points="19,15 16,8 23,14" fill="#FFB6C1" />
          <polygon points="41,15 44,8 37,14" fill="#FFB6C1" />
          {/* Tail */}
          <path d="M44 44 Q56 36 54 28 Q52 22 48 26" stroke="#D4882A" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="24" cy="24" rx="3.5" ry="4" fill="#2ECC71" />
          <ellipse cx="36" cy="24" rx="3.5" ry="4" fill="#2ECC71" />
          <ellipse cx="24" cy="24" rx="1.5" ry="3" fill="#1a1a1a" />
          <ellipse cx="36" cy="24" rx="1.5" ry="3" fill="#1a1a1a" />
          <circle cx="25" cy="23" r="1" fill="white" />
          <circle cx="37" cy="23" r="1" fill="white" />
          {/* Nose */}
          <polygon points="30,29 28,31 32,31" fill="#E91E8C" />
          {/* Mouth */}
          <path d="M28 31 Q30 34 32 31" stroke="#E91E8C" strokeWidth="1" fill="none" />
          {/* Whiskers */}
          <line x1="16" y1="28" x2="26" y2="29" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="16" y1="31" x2="26" y2="30" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="44" y1="28" x2="34" y2="29" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="44" y1="31" x2="34" y2="30" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />
          {/* Paws */}
          <ellipse cx="20" cy="51" rx="6" ry="4" fill="#F0A040" />
          <ellipse cx="40" cy="51" rx="6" ry="4" fill="#F0A040" />
          {/* Stripes */}
          <path d="M22 40 Q30 38 38 40" stroke="#D4882A" strokeWidth="1.5" fill="none" />
          <path d="M20 44 Q30 42 40 44" stroke="#D4882A" strokeWidth="1.5" fill="none" />
        </g>
      );

    case "furniture_dog":
      return (
        <g>
          {/* Body */}
          <ellipse cx="30" cy="42" rx="16" ry="13" fill="#C8A070" />
          {/* Head */}
          <circle cx="30" cy="24" r="15" fill="#C8A070" />
          {/* Floppy ears */}
          <ellipse cx="17" cy="26" rx="7" ry="12" fill="#A07848" />
          <ellipse cx="43" cy="26" rx="7" ry="12" fill="#A07848" />
          {/* Snout */}
          <ellipse cx="30" cy="30" rx="8" ry="6" fill="#D4A878" />
          {/* Nose */}
          <ellipse cx="30" cy="27" rx="4.5" ry="3" fill="#1a1a1a" />
          <circle cx="28.5" cy="26.5" r="1" fill="white" opacity="0.5" />
          {/* Eyes */}
          <circle cx="22" cy="21" r="4" fill="white" />
          <circle cx="38" cy="21" r="4" fill="white" />
          <circle cx="23" cy="22" r="2.5" fill="#4A3000" />
          <circle cx="39" cy="22" r="2.5" fill="#4A3000" />
          <circle cx="23.8" cy="21.2" r="1" fill="white" />
          <circle cx="39.8" cy="21.2" r="1" fill="white" />
          {/* Eyebrows */}
          <path d="M19 17 Q22 15 25 17" stroke="#8B6438" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M35 17 Q38 15 41 17" stroke="#8B6438" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Mouth */}
          <path d="M26 31 Q30 35 34 31" stroke="#7B5030" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Tongue */}
          <ellipse cx="30" cy="34" rx="4" ry="3" fill="#E74C3C" />
          {/* Tail (wagging) */}
          <path d="M44 40 Q56 32 52 22" stroke="#A07848" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Paws */}
          <ellipse cx="19" cy="51" rx="7" ry="5" fill="#C8A070" />
          <ellipse cx="41" cy="51" rx="7" ry="5" fill="#C8A070" />
          {/* Paw toes */}
          <circle cx="16" cy="53" r="1.5" fill="#B89060" />
          <circle cx="19" cy="54" r="1.5" fill="#B89060" />
          <circle cx="22" cy="53" r="1.5" fill="#B89060" />
        </g>
      );

    case "furniture_piano":
      return (
        <g>
          {/* Piano body */}
          <rect x="3" y="10" width="54" height="38" rx="4" fill="#1a1a1a" />
          {/* Lid top (slightly lighter) */}
          <rect x="3" y="10" width="54" height="8" rx="4" fill="#2a2a2a" />
          {/* White keys background */}
          <rect x="5" y="30" width="50" height="16" rx="2" fill="#f5f0e8" />
          {/* Individual white keys */}
          {[5, 12, 19, 26, 33, 40, 47].map((x, i) => (
            <rect key={i} x={x} y="30" width="7" height="16" rx="1" fill="#fafaf5" stroke="#ddd" strokeWidth="0.5" />
          ))}
          {/* Black keys */}
          {[9.5, 16.5, 30.5, 37.5, 44.5].map((x, i) => (
            <rect key={i} x={x} y="30" width="5" height="10" rx="1" fill="#1a1a1a" />
          ))}
          {/* Fallboard (cover above keys) */}
          <rect x="5" y="26" width="50" height="5" rx="1" fill="#2a2a2a" />
          {/* Music stand */}
          <rect x="20" y="13" width="20" height="12" rx="2" fill="#333" />
          <rect x="21" y="14" width="18" height="10" rx="1" fill="#1a1a1a" />
          {/* Sheet music lines */}
          <line x1="22" y1="16" x2="38" y2="16" stroke="#555" strokeWidth="0.8" />
          <line x1="22" y1="18" x2="38" y2="18" stroke="#555" strokeWidth="0.8" />
          <line x1="22" y1="20" x2="38" y2="20" stroke="#555" strokeWidth="0.8" />
          {/* Legs */}
          <rect x="6" y="48" width="6" height="10" rx="2" fill="#1a1a1a" />
          <rect x="48" y="48" width="6" height="10" rx="2" fill="#1a1a1a" />
          {/* Pedals */}
          <rect x="24" y="56" width="5" height="4" rx="1" fill="#888" />
          <rect x="31" y="56" width="5" height="4" rx="1" fill="#888" />
        </g>
      );

    case "furniture_fireplace":
      return (
        <g>
          {/* Mantle shelf */}
          <rect x="2" y="6" width="56" height="8" rx="3" fill="#A07850" />
          {/* Brick surround */}
          <rect x="6" y="14" width="48" height="40" rx="3" fill="#8B4C2A" />
          {/* Brick pattern */}
          {[0, 1, 2, 3, 4].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={6 + col * 12 + (row % 2 === 0 ? 0 : 6)}
                y={14 + row * 8}
                width="11"
                height="7"
                rx="1"
                fill={row % 2 === 0 ? (col % 2 === 0 ? "#9B5535" : "#8B4525") : (col % 2 === 0 ? "#8B4525" : "#9B5535")}
              />
            ))
          )}
          {/* Arch opening */}
          <path d="M14 54 L14 30 Q14 16 30 16 Q46 16 46 30 L46 54 Z" fill="#2C1810" />
          {/* Fireback (back of fireplace) */}
          <path d="M16 54 L16 32 Q16 20 30 20 Q44 20 44 32 L44 54 Z" fill="#1a0f0a" />
          {/* Fire - outer */}
          <path d="M22 52 Q20 42 26 36 Q28 32 30 28 Q32 32 34 36 Q40 42 38 52 Z" fill="#E74C3C" />
          {/* Fire - middle */}
          <path d="M24 52 Q23 44 28 38 Q30 34 30 30 Q32 34 32 38 Q37 44 36 52 Z" fill="#E67E22" />
          {/* Fire - inner */}
          <path d="M26 52 Q26 46 29 40 Q30 36 30 32 Q31 36 31 40 Q34 46 34 52 Z" fill="#F1C40F" />
          {/* Ember glow on floor */}
          <ellipse cx="30" cy="53" rx="10" ry="3" fill="#E74C3C" opacity="0.4" />
          {/* Mantle decoration */}
          <rect x="4" y="7" width="52" height="5" rx="2" fill="rgba(255,255,255,0.1)" />
          {/* Logs */}
          <ellipse cx="24" cy="53" rx="6" ry="2.5" fill="#5C3A1A" />
          <ellipse cx="36" cy="53" rx="6" ry="2.5" fill="#5C3A1A" />
        </g>
      );

    default:
      return (
        <g>
          <rect x="10" y="10" width="40" height="40" rx="6" fill="#4a4a6a" />
          <text x="30" y="35" fontSize="20" textAnchor="middle" fill="white" opacity="0.5">?</text>
        </g>
      );
  }
}
