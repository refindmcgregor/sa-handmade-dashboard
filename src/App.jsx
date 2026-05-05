import { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Search,
  Target,
  Flame,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Hash,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
 
// ============ FALLBACK PRODUCT DATA ============
// This sample data shows when no live sheet is connected.
// Once you publish your Google Sheet (see SETUP_GUIDE.md), the dashboard
// will fetch your real data and ignore this list.
const fallbackProducts = [
  // ---------- SEWING (PRIMARY) ----------
  { name: "Shweshwe Cushion Covers", category: "Sewing", priceMin: 220, priceMax: 480, demand: 86, speed: 90, skill: 100, margin: 82, mentions: 1820, sentiment: 0.89, trend: 44, timeToMake: "1-1.5 hrs", competition: "Low" },
  { name: "Reusable Fabric Gift Bags", category: "Sewing", priceMin: 80, priceMax: 180, demand: 81, speed: 92, skill: 100, margin: 84, mentions: 1180, sentiment: 0.86, trend: 38, timeToMake: "45 min", competition: "Low" },
  { name: "Ankara Tote Bags", category: "Sewing", priceMin: 220, priceMax: 580, demand: 78, speed: 80, skill: 100, margin: 74, mentions: 1640, sentiment: 0.71, trend: 22, timeToMake: "2-3 hrs", competition: "Medium" },
  { name: "Padded Laptop Sleeves", category: "Sewing", priceMin: 280, priceMax: 540, demand: 74, speed: 78, skill: 100, margin: 76, mentions: 920, sentiment: 0.78, trend: 28, timeToMake: "2-3 hrs", competition: "Medium" },
  { name: "Scrunchies (set of 5)", category: "Sewing", priceMin: 120, priceMax: 240, demand: 72, speed: 98, skill: 100, margin: 88, mentions: 940, sentiment: 0.82, trend: 24, timeToMake: "30-45 min", competition: "High" },
  { name: "Patchwork Quilts", category: "Sewing", priceMin: 1200, priceMax: 3800, demand: 68, speed: 25, skill: 100, margin: 82, mentions: 820, sentiment: 0.88, trend: 17, timeToMake: "20-30 hrs", competition: "Low" },
  { name: "Linen Aprons", category: "Sewing", priceMin: 380, priceMax: 720, demand: 64, speed: 85, skill: 100, margin: 78, mentions: 580, sentiment: 0.77, trend: 14, timeToMake: "2-3 hrs", competition: "Low" },
  { name: "Linen Table Runners", category: "Sewing", priceMin: 320, priceMax: 680, demand: 58, speed: 88, skill: 100, margin: 80, mentions: 480, sentiment: 0.84, trend: 11, timeToMake: "1-2 hrs", competition: "Low" },

  // ---------- CROCHET / KNIT (SECONDARY) ----------
  { name: "Crochet Granny Square Cardigan", category: "Crochet", priceMin: 850, priceMax: 1950, demand: 96, speed: 35, skill: 95, margin: 78, mentions: 2680, sentiment: 0.83, trend: 52, timeToMake: "12-18 hrs", competition: "Medium" },
  { name: "Crochet Bucket Hat", category: "Crochet", priceMin: 280, priceMax: 650, demand: 92, speed: 88, skill: 95, margin: 72, mentions: 3120, sentiment: 0.84, trend: 47, timeToMake: "3-4 hrs", competition: "High" },
  { name: "Crochet Tote Bag", category: "Crochet", priceMin: 220, priceMax: 540, demand: 84, speed: 75, skill: 95, margin: 68, mentions: 2210, sentiment: 0.81, trend: 38, timeToMake: "5-7 hrs", competition: "High" },
  { name: "Chunky Knit Throw", category: "Knit", priceMin: 680, priceMax: 1850, demand: 78, speed: 45, skill: 95, margin: 74, mentions: 1740, sentiment: 0.86, trend: 31, timeToMake: "8-12 hrs", competition: "Low" },
  { name: "Crochet Plant Hangers", category: "Crochet", priceMin: 180, priceMax: 380, demand: 71, speed: 80, skill: 95, margin: 76, mentions: 1240, sentiment: 0.82, trend: 26, timeToMake: "2-3 hrs", competition: "Medium" },

  // ---------- STICKERS & PRINTS ----------
  { name: "Vinyl Sticker Packs", category: "Stickers & Prints", priceMin: 60, priceMax: 180, demand: 88, speed: 95, skill: 60, margin: 86, mentions: 2140, sentiment: 0.87, trend: 41, timeToMake: "design once, print on demand", competition: "High" },
  { name: "A4 Botanical Art Prints", category: "Stickers & Prints", priceMin: 120, priceMax: 320, demand: 76, speed: 90, skill: 65, margin: 82, mentions: 1480, sentiment: 0.85, trend: 33, timeToMake: "design once, print on demand", competition: "Medium" },
  { name: "Custom Name Stickers", category: "Stickers & Prints", priceMin: 40, priceMax: 120, demand: 82, speed: 92, skill: 60, margin: 88, mentions: 1820, sentiment: 0.83, trend: 36, timeToMake: "10-15 min per order", competition: "Medium" },
  { name: "Affirmation Card Decks", category: "Stickers & Prints", priceMin: 180, priceMax: 380, demand: 70, speed: 85, skill: 65, margin: 80, mentions: 980, sentiment: 0.89, trend: 28, timeToMake: "design once, print run", competition: "Low" },

  // ---------- PLANTS ----------
  { name: "Propagated String of Pearls", category: "Plants", priceMin: 80, priceMax: 220, demand: 84, speed: 70, skill: 55, margin: 88, mentions: 1620, sentiment: 0.86, trend: 39, timeToMake: "6-8 weeks growing", competition: "Medium" },
  { name: "Air Plant Arrangements", category: "Plants", priceMin: 180, priceMax: 480, demand: 72, speed: 88, skill: 60, margin: 76, mentions: 1140, sentiment: 0.83, trend: 26, timeToMake: "30 min per arrangement", competition: "Low" },
  { name: "Terrariums (small)", category: "Plants", priceMin: 280, priceMax: 580, demand: 78, speed: 80, skill: 65, margin: 72, mentions: 1380, sentiment: 0.88, trend: 32, timeToMake: "1-2 hrs", competition: "Low" },
  { name: "Succulent Starter Kits", category: "Plants", priceMin: 220, priceMax: 480, demand: 66, speed: 75, skill: 55, margin: 74, mentions: 920, sentiment: 0.81, trend: 19, timeToMake: "20 min assembly", competition: "Medium" },

  // ---------- CANDLES ----------
  { name: "Soy Wax Candles (scented)", category: "Candles", priceMin: 180, priceMax: 420, demand: 89, speed: 88, skill: 50, margin: 82, mentions: 2480, sentiment: 0.88, trend: 46, timeToMake: "45 min + 24hr cure", competition: "High" },
  { name: "Beeswax Pillar Candles", category: "Candles", priceMin: 220, priceMax: 580, demand: 74, speed: 78, skill: 55, margin: 76, mentions: 1240, sentiment: 0.91, trend: 31, timeToMake: "1 hr + cure", competition: "Medium" },
  { name: "Travel Tin Candles", category: "Candles", priceMin: 80, priceMax: 180, demand: 82, speed: 95, skill: 50, margin: 84, mentions: 1820, sentiment: 0.85, trend: 38, timeToMake: "30 min + cure", competition: "High" },
  { name: "Massage Candles", category: "Candles", priceMin: 240, priceMax: 480, demand: 68, speed: 82, skill: 55, margin: 80, mentions: 720, sentiment: 0.87, trend: 24, timeToMake: "1 hr + cure", competition: "Low" },

  // ---------- SOAPS & BATH ----------
  { name: "Cold-process Goat Milk Soap", category: "Soap & Bath", priceMin: 60, priceMax: 140, demand: 78, speed: 50, skill: 50, margin: 84, mentions: 1480, sentiment: 0.89, trend: 34, timeToMake: "1 hr + 4-6 wk cure", competition: "Medium" },
  { name: "Bath Salts & Soaks", category: "Soap & Bath", priceMin: 120, priceMax: 280, demand: 81, speed: 95, skill: 55, margin: 88, mentions: 1680, sentiment: 0.86, trend: 41, timeToMake: "20-30 min", competition: "Medium" },
  { name: "Shower Steamers", category: "Soap & Bath", priceMin: 80, priceMax: 180, demand: 84, speed: 92, skill: 55, margin: 86, mentions: 1920, sentiment: 0.88, trend: 47, timeToMake: "30 min + dry", competition: "Low" },
  { name: "Body Butter & Balms", category: "Soap & Bath", priceMin: 140, priceMax: 320, demand: 76, speed: 85, skill: 50, margin: 82, mentions: 1340, sentiment: 0.87, trend: 32, timeToMake: "45 min", competition: "Medium" },

  // ---------- BEADWORK & JEWELRY ----------
  { name: "Zulu Beaded Earrings", category: "Beadwork & Jewelry", priceMin: 180, priceMax: 450, demand: 88, speed: 78, skill: 60, margin: 80, mentions: 2840, sentiment: 0.89, trend: 42, timeToMake: "2-3 hrs", competition: "Medium" },
  { name: "Beaded Bracelets (Xhosa style)", category: "Beadwork & Jewelry", priceMin: 120, priceMax: 320, demand: 82, speed: 88, skill: 60, margin: 82, mentions: 2140, sentiment: 0.86, trend: 38, timeToMake: "1-2 hrs", competition: "High" },
  { name: "Wire & Bead Keychains", category: "Beadwork & Jewelry", priceMin: 60, priceMax: 140, demand: 70, speed: 92, skill: 55, margin: 86, mentions: 980, sentiment: 0.83, trend: 22, timeToMake: "30-45 min", competition: "High" },
  { name: "Beaded Statement Necklaces", category: "Beadwork & Jewelry", priceMin: 380, priceMax: 950, demand: 72, speed: 55, skill: 60, margin: 78, mentions: 1180, sentiment: 0.91, trend: 28, timeToMake: "4-6 hrs", competition: "Low" },

  // ---------- WOVEN & BASKETRY ----------
  { name: "Sisal Bowl Baskets", category: "Woven & Basketry", priceMin: 280, priceMax: 780, demand: 76, speed: 35, skill: 45, margin: 78, mentions: 1240, sentiment: 0.92, trend: 33, timeToMake: "8-15 hrs", competition: "Low" },
  { name: "Telephone Wire Bowls", category: "Woven & Basketry", priceMin: 380, priceMax: 1200, demand: 68, speed: 30, skill: 45, margin: 76, mentions: 880, sentiment: 0.94, trend: 21, timeToMake: "10-20 hrs", competition: "Low" },
  { name: "Woven Wall Baskets (Tonga style)", category: "Woven & Basketry", priceMin: 320, priceMax: 880, demand: 80, speed: 35, skill: 45, margin: 80, mentions: 1480, sentiment: 0.93, trend: 38, timeToMake: "6-12 hrs", competition: "Low" },
  { name: "Grass Placemats (set of 4)", category: "Woven & Basketry", priceMin: 220, priceMax: 480, demand: 64, speed: 60, skill: 50, margin: 74, mentions: 620, sentiment: 0.88, trend: 16, timeToMake: "2-3 hrs each", competition: "Low" },

  // ---------- CERAMICS & POTTERY ----------
  { name: "Hand-thrown Ceramic Mugs", category: "Ceramics", priceMin: 180, priceMax: 420, demand: 84, speed: 50, skill: 40, margin: 74, mentions: 1820, sentiment: 0.91, trend: 36, timeToMake: "1 hr + firing", competition: "Medium" },
  { name: "Stoneware Dinner Plates", category: "Ceramics", priceMin: 280, priceMax: 680, demand: 72, speed: 45, skill: 40, margin: 70, mentions: 980, sentiment: 0.89, trend: 24, timeToMake: "1 hr + firing", competition: "Low" },
  { name: "Decorative Vases", category: "Ceramics", priceMin: 380, priceMax: 1200, demand: 68, speed: 40, skill: 40, margin: 72, mentions: 1140, sentiment: 0.88, trend: 22, timeToMake: "2 hrs + firing", competition: "Low" },

  // ---------- LEATHER ----------
  { name: "Leather Card Holders", category: "Leather", priceMin: 220, priceMax: 480, demand: 74, speed: 80, skill: 45, margin: 80, mentions: 1080, sentiment: 0.85, trend: 26, timeToMake: "1-2 hrs", competition: "Medium" },
  { name: "Leather Sandals", category: "Leather", priceMin: 450, priceMax: 1100, demand: 70, speed: 50, skill: 45, margin: 72, mentions: 1240, sentiment: 0.74, trend: 11, timeToMake: "4-6 hrs", competition: "Medium" },
  { name: "Veg-tan Leather Journals", category: "Leather", priceMin: 380, priceMax: 880, demand: 76, speed: 65, skill: 45, margin: 78, mentions: 1320, sentiment: 0.89, trend: 31, timeToMake: "2-3 hrs", competition: "Low" },

  // ---------- WOOD & CARVING ----------
  { name: "Wooden Salad Bowls", category: "Wood & Carving", priceMin: 380, priceMax: 950, demand: 62, speed: 40, skill: 40, margin: 70, mentions: 540, sentiment: 0.86, trend: 8, timeToMake: "3-5 hrs", competition: "Low" },
  { name: "Hand-carved Cheese Boards", category: "Wood & Carving", priceMin: 280, priceMax: 680, demand: 70, speed: 60, skill: 40, margin: 76, mentions: 820, sentiment: 0.88, trend: 19, timeToMake: "2-3 hrs", competition: "Low" },
  { name: "Animal Wood Carvings", category: "Wood & Carving", priceMin: 320, priceMax: 1400, demand: 58, speed: 30, skill: 40, margin: 72, mentions: 720, sentiment: 0.91, trend: 12, timeToMake: "6-12 hrs", competition: "Low" },

  // ---------- WIREWORK ----------
  { name: "Beaded Wire Animals", category: "Wirework", priceMin: 180, priceMax: 580, demand: 64, speed: 55, skill: 45, margin: 78, mentions: 680, sentiment: 0.93, trend: 14, timeToMake: "3-5 hrs", competition: "Low" },
  { name: "Wire Wall Art", category: "Wirework", priceMin: 420, priceMax: 1200, demand: 60, speed: 45, skill: 45, margin: 76, mentions: 540, sentiment: 0.87, trend: 8, timeToMake: "5-8 hrs", competition: "Low" },

  // ---------- TEA & HERBAL BLENDS ----------
  { name: "Rooibos Wellness Blends", category: "Tea & Herbal", priceMin: 80, priceMax: 220, demand: 86, speed: 92, skill: 50, margin: 80, mentions: 2240, sentiment: 0.91, trend: 42, timeToMake: "1-2 hrs blending", competition: "Medium" },
  { name: "Honeybush Tea Sampler", category: "Tea & Herbal", priceMin: 120, priceMax: 280, demand: 72, speed: 88, skill: 50, margin: 78, mentions: 980, sentiment: 0.89, trend: 31, timeToMake: "2 hrs blending", competition: "Low" },
  { name: "Buchu Herbal Tea", category: "Tea & Herbal", priceMin: 100, priceMax: 220, demand: 64, speed: 90, skill: 50, margin: 82, mentions: 620, sentiment: 0.86, trend: 24, timeToMake: "1-2 hrs", competition: "Low" },
  { name: "Chai Spice Blends", category: "Tea & Herbal", priceMin: 80, priceMax: 180, demand: 78, speed: 95, skill: 50, margin: 84, mentions: 1340, sentiment: 0.88, trend: 36, timeToMake: "1 hr blending", competition: "Medium" },
  { name: "Loose Leaf Gift Tins", category: "Tea & Herbal", priceMin: 220, priceMax: 480, demand: 70, speed: 85, skill: 50, margin: 76, mentions: 880, sentiment: 0.90, trend: 28, timeToMake: "30 min assembly", competition: "Low" },

  // ---------- COFFEE ----------
  { name: "Single-origin Roasted Beans (250g)", category: "Coffee", priceMin: 120, priceMax: 240, demand: 84, speed: 80, skill: 35, margin: 68, mentions: 1820, sentiment: 0.89, trend: 38, timeToMake: "1-2 hr roast (small batch)", competition: "High" },
  { name: "Cold Brew Concentrate", category: "Coffee", priceMin: 80, priceMax: 180, demand: 76, speed: 70, skill: 35, margin: 74, mentions: 1240, sentiment: 0.85, trend: 32, timeToMake: "12-24 hr steep", competition: "Medium" },
  { name: "Coffee Subscription Box", category: "Coffee", priceMin: 280, priceMax: 580, demand: 80, speed: 75, skill: 35, margin: 72, mentions: 1480, sentiment: 0.87, trend: 34, timeToMake: "monthly assembly", competition: "Medium" },
  { name: "Drip Coffee Bags (single-serve)", category: "Coffee", priceMin: 60, priceMax: 140, demand: 68, speed: 88, skill: 35, margin: 76, mentions: 720, sentiment: 0.84, trend: 26, timeToMake: "30 min/batch", competition: "Low" },
];

// ============ LIVE DATA CONFIG ============
// Paste your published Google Sheet CSV URLs below.
// To get these: File → Share → Publish to web → choose the tab → CSV format
// Leave them as empty strings ("") to use the fallback data above.
const SHEET_URLS = {
  products: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4QeT-Cn7-0PpIIifYDyRUqGRsj4sQNEAXpB8sb7502KzMXya1zbUl7H4fYn84z7kwcP3K85BuacQJ/pub?gid=0&single=true&output=csv",
  sales: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4QeT-Cn7-0PpIIifYDyRUqGRsj4sQNEAXpB8sb7502KzMXya1zbUl7H4fYn84z7kwcP3K85BuacQJ/pub?gid=812119574&single=true&output=csv",
};

// Tiny CSV parser — handles quoted values with commas inside
const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = [];
    let cur = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === "," && !inQuotes) { cells.push(cur); cur = ""; }
      else cur += ch;
    }
    cells.push(cur);
    const row = {};
    headers.forEach((h, i) => { row[h] = (cells[i] || "").trim(); });
    return row;
  });
};

// Convert a CSV row into the product shape the dashboard expects
const rowToProduct = (row) => ({
  name: row.name,
  category: row.category,
  priceMin: Number(row.priceMin) || 0,
  priceMax: Number(row.priceMax) || 0,
  demand: Number(row.demand) || 0,
  speed: Number(row.speed) || 0,
  skill: Number(row.skill) || 0,
  margin: Number(row.margin) || 0,
  mentions: Number(row.mentions) || 0,
  sentiment: Number(row.sentiment) || 0,
  trend: Number(row.trend) || 0,
  timeToMake: row.timeToMake || "",
  competition: row.competition || "Medium",
});

// User's ranked priorities (1 = highest)
const PRIORITY_WEIGHTS = {
  demand: 0.40,  // 1st: Fastest growing demand
  speed: 0.30,   // 2nd: Quickest to make/sell
  skill: 0.20,   // 3rd: Best fit for my skills
  margin: 0.10,  // 4th: Highest profit margin
};

// ============ TREND CHART DATA ============
const trendData = [
  { week: "W1", sewing: 1100, crochet: 1400, stickers: 800, plants: 950 },
  { week: "W2", sewing: 1280, crochet: 1780, stickers: 1020, plants: 1080 },
  { week: "W3", sewing: 1520, crochet: 2240, stickers: 1340, plants: 1260 },
  { week: "W4", sewing: 1840, crochet: 2890, stickers: 1680, plants: 1480 },
  { week: "W5", sewing: 2180, crochet: 3640, stickers: 2080, plants: 1740 },
  { week: "W6", sewing: 2680, crochet: 4280, stickers: 2620, plants: 2040 },
];

const categories = ["All", "Sewing", "Crochet", "Knit", "Stickers & Prints", "Plants", "Candles", "Soap & Bath", "Beadwork & Jewelry", "Woven & Basketry", "Ceramics", "Leather", "Wood & Carving", "Wirework", "Tea & Herbal", "Coffee"];

// ============ HELPERS ============
const calcScore = (p) =>
  p.demand * PRIORITY_WEIGHTS.demand +
  p.speed * PRIORITY_WEIGHTS.speed +
  p.skill * PRIORITY_WEIGHTS.skill +
  p.margin * PRIORITY_WEIGHTS.margin;

const getRecommendation = (score) => {
  if (score >= 80) return { label: "MAKE NOW", color: "bg-emerald-700 text-white", icon: CheckCircle2 };
  if (score >= 70) return { label: "STRONG OPPORTUNITY", color: "bg-emerald-600 text-white", icon: CheckCircle2 };
  if (score >= 60) return { label: "WORTH CONSIDERING", color: "bg-amber-500 text-stone-900", icon: AlertCircle };
  return { label: "SKIP FOR NOW", color: "bg-stone-400 text-stone-900", icon: XCircle };
};

const TrendArrow = ({ value }) => {
  if (value > 0) return <ArrowUpRight className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />;
  if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-700" strokeWidth={2.5} />;
  return <Minus className="w-4 h-4 text-stone-500" strokeWidth={2.5} />;
};

// ============ SA-FOCUSED LINK HELPERS ============
// Build a hashtag/keyword string skewed to SA so results are local
const saTag = (productName) => {
  const tag = productName.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return tag;
};

// Per-product example links — SA only
const productLinks = (p) => {
  const tag = saTag(p.name);
  const search = encodeURIComponent(p.name + " south africa");
  return [
    { label: "Instagram", url: `https://www.instagram.com/explore/tags/${tag}sa/` },
    { label: "TikTok", url: `https://www.tiktok.com/search?q=${encodeURIComponent(p.name + " South Africa")}` },
    { label: "Aya Africa", url: `https://aya.africa/search?q=${search}` },
    { label: "Pinterest SA", url: `https://za.pinterest.com/search/pins/?q=${search}` },
  ];
};

// Per-category "browse SA sellers" links
const categoryLinks = {
  "Sewing": [
    { label: "#sewingSA on IG", url: "https://www.instagram.com/explore/tags/sewingsa/" },
    { label: "Hello Pretty — Sewing", url: "https://aya.africa/search?q=handmade+sewn" },
    { label: "#shweshwe on IG", url: "https://www.instagram.com/explore/tags/shweshwe/" },
  ],
  "Crochet": [
    { label: "#crochetSA on IG", url: "https://www.instagram.com/explore/tags/crochetsa/" },
    { label: "#crochetsouthafrica on TikTok", url: "https://www.tiktok.com/tag/crochetsouthafrica" },
    { label: "Hello Pretty — Crochet", url: "https://aya.africa/search?q=crochet" },
  ],
  "Knit": [
    { label: "#knitSA on IG", url: "https://www.instagram.com/explore/tags/knitsa/" },
    { label: "Hello Pretty — Knitwear", url: "https://aya.africa/search?q=knit" },
    { label: "#mohairSA on IG", url: "https://www.instagram.com/explore/tags/mohairsa/" },
  ],
  "Stickers & Prints": [
    { label: "#stickersSA on IG", url: "https://www.instagram.com/explore/tags/stickerssa/" },
    { label: "Hello Pretty — Prints", url: "https://aya.africa/search?q=art+print" },
    { label: "#sastationery on IG", url: "https://www.instagram.com/explore/tags/sastationery/" },
  ],
  "Plants": [
    { label: "#plantsofsa on IG", url: "https://www.instagram.com/explore/tags/plantsofsa/" },
    { label: "#capetownplants on IG", url: "https://www.instagram.com/explore/tags/capetownplants/" },
    { label: "#proplifeza on IG", url: "https://www.instagram.com/explore/tags/proplifeza/" },
  ],
  "Candles": [
    { label: "#candlesSA on IG", url: "https://www.instagram.com/explore/tags/candlessa/" },
    { label: "#soywaxsa on IG", url: "https://www.instagram.com/explore/tags/soywaxsa/" },
    { label: "Hello Pretty — Candles", url: "https://aya.africa/search?q=candle" },
  ],
  "Soap & Bath": [
    { label: "#handmadesoapsa on IG", url: "https://www.instagram.com/explore/tags/handmadesoapsa/" },
    { label: "#bathandbodysa on IG", url: "https://www.instagram.com/explore/tags/bathandbodysa/" },
    { label: "Faithful to Nature", url: "https://www.faithful-to-nature.co.za/search?keyword=handmade+soap" },
  ],
  "Beadwork & Jewelry": [
    { label: "#zulubeadwork on IG", url: "https://www.instagram.com/explore/tags/zulubeadwork/" },
    { label: "#beadworkSA on IG", url: "https://www.instagram.com/explore/tags/beadworksa/" },
    { label: "African Mamas Crafts", url: "https://africanmamascrafts.co.za/" },
  ],
  "Woven & Basketry": [
    { label: "#zulubaskets on IG", url: "https://www.instagram.com/explore/tags/zulubaskets/" },
    { label: "#telephonewireart on IG", url: "https://www.instagram.com/explore/tags/telephonewireart/" },
    { label: "Hello Pretty — Baskets", url: "https://aya.africa/search?q=basket" },
  ],
  "Ceramics": [
    { label: "#ceramicsSA on IG", url: "https://www.instagram.com/explore/tags/ceramicssa/" },
    { label: "#sapottery on IG", url: "https://www.instagram.com/explore/tags/sapottery/" },
    { label: "Hello Pretty — Ceramics", url: "https://aya.africa/search?q=ceramic" },
  ],
  "Leather": [
    { label: "#leathersa on IG", url: "https://www.instagram.com/explore/tags/leathersa/" },
    { label: "#sahandmade on IG", url: "https://www.instagram.com/explore/tags/sahandmade/" },
    { label: "Hello Pretty — Leather", url: "https://aya.africa/search?q=leather" },
  ],
  "Wood & Carving": [
    { label: "#woodworkSA on IG", url: "https://www.instagram.com/explore/tags/woodworksa/" },
    { label: "#sawoodworking on IG", url: "https://www.instagram.com/explore/tags/sawoodworking/" },
    { label: "Hello Pretty — Wood", url: "https://aya.africa/search?q=wood" },
  ],
  "Wirework": [
    { label: "#wireartSA on IG", url: "https://www.instagram.com/explore/tags/wireartsa/" },
    { label: "#beadedwireart on IG", url: "https://www.instagram.com/explore/tags/beadedwireart/" },
    { label: "African Crafts Market", url: "https://www.africancraftsmarket.com" },
  ],
  "Tea & Herbal": [
    { label: "#rooibossa on IG", url: "https://www.instagram.com/explore/tags/rooibossa/" },
    { label: "#honeybushtea on IG", url: "https://www.instagram.com/explore/tags/honeybushtea/" },
    { label: "Faithful to Nature — Tea", url: "https://www.faithful-to-nature.co.za/search?keyword=rooibos+tea" },
  ],
  "Coffee": [
    { label: "#sacoffee on IG", url: "https://www.instagram.com/explore/tags/sacoffee/" },
    { label: "#capetowncoffee on IG", url: "https://www.instagram.com/explore/tags/capetowncoffee/" },
    { label: "#specialitycoffeesa on IG", url: "https://www.instagram.com/explore/tags/specialitycoffeesa/" },
  ],
};

// ============ MAIN COMPONENT ============
export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(fallbackProducts);
  const [sales, setSales] = useState([]);
const [dataStatus, setDataStatus] = useState("loading"); // "loading" | "sample" | "live" | "error"  
  const [lastUpdated, setLastUpdated] = useState(null);
  // Fetch live data from your Google Sheet on load
  useEffect(() => {
    const loadData = async () => {
      // Products tab
      if (SHEET_URLS.products) {
        try {
          const res = await fetch(SHEET_URLS.products);
          if (!res.ok) throw new Error("Fetch failed");
          const text = await res.text();
          const rows = parseCSV(text).filter((r) => r.name);
          if (rows.length > 0) {
            setProducts(rows.map(rowToProduct));
            setDataStatus("live");
            setLastUpdated(new Date());
          }
        } catch (e) {
          console.warn("Could not load live products, using sample data:", e);
          setDataStatus("error");
        }
      }
      // Sales tab
      if (SHEET_URLS.sales) {
        try {
          const res = await fetch(SHEET_URLS.sales);
          if (!res.ok) throw new Error("Fetch failed");
          const text = await res.text();
          const rows = parseCSV(text).filter((r) => r.product);
          setSales(rows.map((r) => ({
            date: r.date,
            product: r.product,
            category: r.category,
            quantity: Number(r.quantity) || 0,
            revenue: Number(r.revenue) || 0,
            channel: r.channel || "",
          })));
        } catch (e) {
          console.warn("Could not load sales data:", e);
        }
      }
    };
    loadData();
  }, []);

  // Compute sales summary by category
  const salesByCategory = useMemo(() => {
    const map = {};
    sales.forEach((s) => {
      if (!map[s.category]) map[s.category] = { revenue: 0, units: 0 };
      map[s.category].revenue += s.revenue;
      map[s.category].units += s.quantity;
    });
    return Object.entries(map)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0);
  const totalUnits = sales.reduce((sum, s) => sum + s.quantity, 0);

  const scoredProducts = useMemo(() => {
    return products
      .map((p) => ({ ...p, score: calcScore(p) }))
      .sort((a, b) => b.score - a.score);
  }, [products]);

  const filteredProducts = scoredProducts.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const topPicks = scoredProducts.slice(0, 3);

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "#dde5d5",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-10 border-b-2 border-stone-900 pb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-800 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-stone-700 font-sans">
              Live · {new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-stone-900 leading-none tracking-tight">
            What should I<br />
            <span className="italic font-light">make next?</span>
          </h1>
          <p className="mt-4 text-stone-700 text-lg max-w-2xl leading-relaxed">
            Ranked product recommendations for your shop, scored by demand growth, speed-to-make, skill fit, and margin.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-sans uppercase tracking-wider">
            <span className="text-stone-600 self-center">Your priorities:</span>
            <span className="bg-stone-900 text-stone-50 px-2 py-1">1. Demand</span>
            <span className="bg-stone-700 text-stone-50 px-2 py-1">2. Speed</span>
            <span className="bg-stone-600 text-stone-50 px-2 py-1">3. Skill fit</span>
            <span className="bg-stone-500 text-stone-50 px-2 py-1">4. Margin</span>
          </div>
        </header>

        {/* DATA STATUS BANNER */}
        <div className={`mb-8 px-4 py-3 flex items-center justify-between flex-wrap gap-2 text-sm font-sans ${
          dataStatus === "live" ? "bg-emerald-50 border border-emerald-200" :
          dataStatus === "error" ? "bg-amber-50 border border-amber-200" :
          "bg-stone-100 border border-stone-200"
        }`} style={{ borderRadius: "6px" }}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              dataStatus === "live" ? "bg-emerald-600" :
              dataStatus === "error" ? "bg-amber-600" : "bg-stone-400"
            }`} />
            <span className="text-stone-800">
              {dataStatus === "live" && <>Live data connected · <strong>{products.length}</strong> products tracked</>}
              {dataStatus === "error" && <>Couldn't reach your sheet — showing sample data</>}
              {dataStatus === "sample" && <>Sample data · See SETUP_GUIDE.md to connect your Google Sheet</>}
            </span>
          </div>
          {lastUpdated && (
            <span className="text-stone-500 text-xs">
              Updated {lastUpdated.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {/* MY SALES SUMMARY */}
        {sales.length > 0 && (
          <section className="mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-stone-700 mb-3 font-sans">§ 00 — My shop performance</div>
            <h2 className="text-3xl md:text-4xl font-light italic text-stone-900 mb-6">What's actually selling.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-stone-50 border border-stone-200 p-5" style={{ borderRadius: "6px", boxShadow: "0 2px 8px rgba(28, 25, 23, 0.08)" }}>
                <div className="text-xs uppercase tracking-wider text-stone-500 font-sans mb-1">Total revenue</div>
                <div className="text-3xl font-bold text-stone-900">R{totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-stone-600 mt-1">{sales.length} sales recorded</div>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-5" style={{ borderRadius: "6px", boxShadow: "0 2px 8px rgba(28, 25, 23, 0.08)" }}>
                <div className="text-xs uppercase tracking-wider text-stone-500 font-sans mb-1">Total units sold</div>
                <div className="text-3xl font-bold text-stone-900">{totalUnits}</div>
                <div className="text-xs text-stone-600 mt-1">across all categories</div>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-5" style={{ borderRadius: "6px", boxShadow: "0 2px 8px rgba(28, 25, 23, 0.08)" }}>
                <div className="text-xs uppercase tracking-wider text-stone-500 font-sans mb-1">Avg. order value</div>
                <div className="text-3xl font-bold text-stone-900">R{sales.length ? Math.round(totalRevenue / sales.length).toLocaleString() : 0}</div>
                <div className="text-xs text-stone-600 mt-1">per sale</div>
              </div>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-5" style={{ borderRadius: "6px", boxShadow: "0 2px 8px rgba(28, 25, 23, 0.08)" }}>
              <h3 className="text-sm uppercase tracking-wider text-stone-700 font-sans mb-4">Revenue by category</h3>
              <div className="space-y-3">
                {salesByCategory.map((c) => {
                  const pct = totalRevenue ? (c.revenue / totalRevenue) * 100 : 0;
                  return (
                    <div key={c.category}>
                      <div className="flex items-center justify-between mb-1 text-sm font-sans">
                        <span className="font-medium text-stone-900">{c.category}</span>
                        <span className="text-stone-700">R{c.revenue.toLocaleString()} · {c.units} units</span>
                      </div>
                      <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* TOP 3 PICKS */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-emerald-800" />
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-700 font-sans">Top 3 picks for you this week</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topPicks.map((p, i) => {
              const rec = getRecommendation(p.score);
              return (
                <div
                  key={i}
                  className="bg-stone-50 border border-stone-200 p-6 relative"
                  style={{ borderRadius: "6px", boxShadow: "0 2px 8px rgba(28, 25, 23, 0.08)" }}
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-800 text-white rounded-full flex items-center justify-center font-bold text-xl border-2 border-white" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
                    {i + 1}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-stone-500 font-sans mb-2 mt-1">
                    {p.category}
                  </div>
                  <h3 className="text-xl font-medium text-stone-900 leading-tight mb-3">{p.name}</h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-sans font-bold uppercase tracking-wider mb-4 ${rec.color}`}>
                    <rec.icon className="w-3 h-3" />
                    {rec.label}
                  </div>
                  <div className="space-y-2 text-sm font-sans">
                    <div className="flex justify-between border-b border-stone-300 pb-1">
                      <span className="text-stone-600">Score</span>
                      <span className="font-bold text-stone-900">{p.score.toFixed(0)}/100</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-300 pb-1">
                      <span className="text-stone-600">Time to make</span>
                      <span className="font-semibold text-stone-900">{p.timeToMake}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-300 pb-1">
                      <span className="text-stone-600">Sell price</span>
                      <span className="font-semibold text-stone-900">R{p.priceMin}–{p.priceMax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Demand trend</span>
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        <TrendingUp className="w-3 h-3" /> +{p.trend}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Category trend chart */}
        <section className="mb-12 bg-stone-900 text-stone-50 p-8 md:p-10" style={{ borderRadius: "2px" }}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-300 mb-2 font-sans">§ 01 — Category momentum</div>
              <h2 className="text-3xl md:text-4xl font-light italic">Six weeks in motion.</h2>
            </div>
            <div className="flex gap-4 text-xs font-sans flex-wrap">
              {[
                { name: "Sewing", color: "#f9a8d4" },
                { name: "Crochet", color: "#047857" },
                { name: "Stickers", color: "#fde68a" },
                { name: "Plants", color: "#86efac" },
              ].map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ backgroundColor: s.color }} />
                  <span className="uppercase tracking-wider">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f9a8d4" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#f9a8d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#047857" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#047857" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fde68a" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#fde68a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#86efac" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#86efac" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#44403c" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="week" stroke="#a8a29e" tick={{ fontFamily: "monospace", fontSize: 11 }} />
              <YAxis stroke="#a8a29e" tick={{ fontFamily: "monospace", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#1c1917",
                  border: "1px solid #57534e",
                  borderRadius: "2px",
                  fontFamily: "monospace",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="sewing" stroke="#f9a8d4" strokeWidth={2} fill="url(#g1)" />
              <Area type="monotone" dataKey="crochet" stroke="#047857" strokeWidth={2} fill="url(#g2)" />
              <Area type="monotone" dataKey="stickers" stroke="#fde68a" strokeWidth={2} fill="url(#g3)" />
              <Area type="monotone" dataKey="plants" stroke="#86efac" strokeWidth={2} fill="url(#g4)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="mt-6 text-stone-400 text-sm italic font-light max-w-2xl">
            Crochet leads on raw growth, but sewing and stickers are climbing steadily with less competition —
            often a better bet for a new product line.
          </p>
        </section>

        {/* Browse SA sellers by category */}
        <section className="mb-12">
          <div className="text-xs uppercase tracking-[0.3em] text-stone-700 mb-3 font-sans">§ 02 — Scout the competition</div>
          <h2 className="text-3xl md:text-4xl font-light italic text-stone-900 mb-2">SA sellers, by category.</h2>
          <p className="text-stone-700 mb-6 max-w-2xl">
            Tap into local maker communities to see what's selling, what's priced well, and what gaps you can fill.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryLinks).map(([cat, links]) => (
              <div
                key={cat}
                className="bg-stone-50 border border-stone-200 p-5"
                style={{ borderRadius: "6px", boxShadow: "0 2px 8px rgba(28, 25, 23, 0.08)" }}
              >
                <div className="text-xs uppercase tracking-widest text-stone-500 font-sans mb-1">Category</div>
                <h3 className="text-xl font-medium text-stone-900 mb-4">{cat}</h3>
                <div className="space-y-2">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-stone-300 hover:bg-amber-50 hover:border-stone-900 transition-colors text-sm font-sans text-stone-900 group"
                      style={{ borderRadius: "2px" }}
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-4 h-4 text-stone-500 group-hover:text-emerald-800" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="text-xs uppercase tracking-[0.3em] text-stone-700 mb-3 font-sans">§ 03 — All opportunities, ranked</div>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <h2 className="text-3xl md:text-4xl font-light italic text-stone-900">The full shortlist.</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-stone-50 border border-stone-400 text-sm font-sans text-stone-900 focus:outline-none focus:border-stone-900 w-48"
                style={{ borderRadius: "2px" }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-sans border transition-colors ${
                  selectedCategory === cat
                    ? "bg-stone-900 text-stone-50 border-stone-900"
                    : "bg-transparent text-stone-700 border-stone-500 hover:border-stone-900"
                }`}
                style={{ borderRadius: "2px" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Ranked product list */}
        <section className="mb-12 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-stone-50 p-10 text-center text-stone-600 italic border border-stone-200" style={{ borderRadius: "6px" }}>
              No products match your filters.
            </div>
          ) : (
            filteredProducts.map((p, i) => {
              const rec = getRecommendation(p.score);
              const overallRank = scoredProducts.indexOf(p) + 1;
              return (
                <article
                  key={i}
                  className="bg-stone-50 border border-stone-200 p-5 hover:bg-amber-50 hover:border-stone-300 transition-colors"
                  style={{ borderRadius: "6px", boxShadow: "0 1px 4px rgba(28, 25, 23, 0.06)" }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1 min-w-[280px]">
                      <div className="text-3xl font-mono font-bold text-stone-400 leading-none mt-1">
                        {String(overallRank).padStart(2, "0")}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs uppercase tracking-widest text-stone-500 font-sans mb-1">
                          {p.category}
                        </div>
                        <h3 className="text-xl font-medium text-stone-900 leading-tight mb-2">{p.name}</h3>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-sans font-bold uppercase tracking-wider ${rec.color}`}>
                          <rec.icon className="w-3 h-3" />
                          {rec.label}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-sans">
                      <div className="text-center">
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Score</div>
                        <div className="text-2xl font-bold text-stone-900">{p.score.toFixed(0)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-stone-500 uppercase tracking-wider flex items-center gap-1 justify-center">
                          <TrendingUp className="w-3 h-3" /> Demand
                        </div>
                        <div className="text-lg font-bold text-emerald-700">+{p.trend}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-stone-500 uppercase tracking-wider flex items-center gap-1 justify-center">
                          <Clock className="w-3 h-3" /> Time
                        </div>
                        <div className="text-sm font-semibold text-stone-900">{p.timeToMake}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Price</div>
                        <div className="text-sm font-semibold text-stone-900">R{p.priceMin}–{p.priceMax}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-stone-300 grid grid-cols-2 md:grid-cols-4 gap-4 font-sans text-xs">
                    {[
                      { label: "Demand", value: p.demand, color: "bg-emerald-800" },
                      { label: "Speed", value: p.speed, color: "bg-blue-600" },
                      { label: "Skill fit", value: p.skill, color: "bg-emerald-600" },
                      { label: "Margin", value: p.margin, color: "bg-purple-600" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-stone-600 uppercase tracking-wider">{m.label}</span>
                          <span className="font-bold text-stone-900">{m.value}</span>
                        </div>
                        <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div className={`h-full ${m.color}`} style={{ width: `${m.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-200 flex flex-wrap gap-4 text-xs font-sans text-stone-600">
                    <span><Hash className="w-3 h-3 inline mr-1" />{p.mentions.toLocaleString()} mentions</span>
                    <span>Sentiment: <span className="font-bold text-emerald-700">+{(p.sentiment * 100).toFixed(0)}%</span></span>
                    <span>Competition: <span className={`font-bold ${
                      p.competition === "Low" ? "text-emerald-700" :
                      p.competition === "Medium" ? "text-amber-700" : "text-red-700"
                    }`}>{p.competition}</span></span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs font-sans">
                    <span className="text-stone-600 uppercase tracking-wider mr-2">See SA examples →</span>
                    {productLinks(p).map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-stone-900 text-stone-50 hover:bg-emerald-800 transition-colors uppercase tracking-wider"
                        style={{ borderRadius: "2px" }}
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* Methodology */}
        <section className="mb-12 bg-stone-50 border border-stone-200 p-6 md:p-8" style={{ borderRadius: "6px", boxShadow: "0 2px 8px rgba(28, 25, 23, 0.08)" }}>
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-emerald-800 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-medium text-stone-900 mb-2">How the scoring works</h3>
              <p className="text-sm text-stone-700 leading-relaxed mb-4">
                Every product gets a score out of 100, weighted by your priorities:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-sans text-sm">
                <div className="bg-white p-3 border border-stone-300">
                  <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">1st priority</div>
                  <div className="font-bold text-stone-900">Demand</div>
                  <div className="text-xs text-stone-600">40% of score</div>
                </div>
                <div className="bg-white p-3 border border-stone-300">
                  <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">2nd priority</div>
                  <div className="font-bold text-stone-900">Speed</div>
                  <div className="text-xs text-stone-600">30% of score</div>
                </div>
                <div className="bg-white p-3 border border-stone-300">
                  <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">3rd priority</div>
                  <div className="font-bold text-stone-900">Skill fit</div>
                  <div className="text-xs text-stone-600">20% of score</div>
                </div>
                <div className="bg-white p-3 border border-stone-300">
                  <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">4th priority</div>
                  <div className="font-bold text-stone-900">Margin</div>
                  <div className="text-xs text-stone-600">10% of score</div>
                </div>
              </div>
              <p className="text-xs text-stone-600 mt-4 italic">
                Sewing items get a 100% skill match (your primary craft), crochet/knit gets 95%, stickers/prints and plants score lower since they're newer to you.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-stone-900 pt-6 pb-10 flex items-center justify-between flex-wrap gap-4 font-sans text-xs uppercase tracking-widest text-stone-700">
          <div>What should I make next? · Sample data · Replace with live feeds</div>
          <div>For your shop · {new Date().getFullYear()}</div>
        </footer>
      </div>
    </div>
  );
}
