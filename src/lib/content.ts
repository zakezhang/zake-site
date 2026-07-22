import type { FooterLink, WorkItem } from "@/types/content";

export const site = {
  logo: { head: "zake", tail: ".zhang" },
  clockPrefix: "GMT+8 CN",
  title: "ZAKE©2026",
};

export const hero = {
  discipline: ["Product &", "Storytelling"],
  tagline: "Building in public. Turning life into a series.",
  bio: {
    before: "I'm Zake Zhang, head of ",
    link: { label: "VidMuse", href: "https://vidmuse.ai" },
    after:
      " — an AI video agent. Previously PM at CapCut and OnePlus. Off-screen I climb mountains, swim, and train jiu-jitsu.",
  },
  display: [
    { text: "I turn" },
    { text: "life & code" },
    { text: "into stories", highlight: true },
  ],
  seal: "ZAKE ZHANG • LIFE & CODE INTO STORIES • EST. 1993 • ",
};

export const about = {
  lead: "I explore how AI reshapes content creation — building agents that turn any spark into moving image.",
  body: [
    { text: "I'm building " },
    { text: "VidMuse", href: "https://vidmuse.ai" },
    { text: " with " },
    { text: "Kian", href: "https://www.heykian.com/en" },
    { text: " and " },
    { text: "Vibable", href: "https://vibable.sandaii.cn/" },
    { text: " — ex " },
    { text: "CapCut", href: "https://www.capcut.com" },
    { text: " 0→1, ex " },
    { text: "OnePlus", href: "https://www.youtube.com/live/rQEtyuhLEAA?t=2290" },
    { text: " PM & keynote speaker." },
  ],
  portrait: "/images/portrait.jpg",
  portraitNote: "ZAKE ZHANG — 59.33°N 18.07°E",
  facets: [
    { icon: "mountain", label: "Mountaineer — 7546m" },
    { icon: "belt", label: "Brazilian Jiu-Jitsu — Blue Belt" },
    { icon: "wave", label: "Swimming — 50m in 29.8s" },
    { icon: "film", label: "Building AI products for creators" },
  ],
};

export const careerThread = {
  line: "Ten years, one thread: making images move.",
  ticker:
    "2016 VR GAMES, BOULDER CO → 2018 ONEPLUS IMAGING & KEYNOTES → 2020 CAPCUT 0→1 → 2023 GAP YEAR, SWEDEN → 2025 VIDMUSE",
};

export const introFilm = {
  title: "A Life of Never Settle",
  cover: "/images/work/intro-film.jpg",
  ytId: "BHOpxl1Lxwg",
  bvid: "BV1A4411M76J",
};

export interface WorkGroup {
  label: string;
  items: WorkItem[];
  /** Optional click-to-play film shown above the group's cards */
  film?: {
    title: string;
    cover: string;
    ytId: string;
    bvid: string;
    badge: string;
  };
}

export const workGroups: WorkGroup[] = [
  {
    label: "Now",
    items: [
      {
        no: "01",
        image: "/images/work/vidmuse-2026.jpg",
        title: "VidMuse",
        code: "VIDMUSE",
        years: "2025-NOW",
        href: "https://vidmuse.ai",
        external: true,
        badge: "AI Product",
        aspect: "wide",
        fill: true,
        cols: "col-span-12 lg:col-span-8 lg:row-span-2",
      },
      {
        no: "02",
        image: "/images/work/kian-home.jpg",
        title: "Kian",
        code: "KIAN",
        years: "2026",
        href: "https://www.heykian.com/en",
        external: true,
        badge: "Open Source",
        aspect: "video",
        cols: "col-span-12 lg:col-span-4",
      },
      {
        no: "03",
        image: "/images/work/vibable-home.jpg",
        title: "Vibable",
        code: "VIBABLE",
        years: "2026",
        href: "https://vibable.sandaii.cn/",
        external: true,
        badge: "Coding Agent",
        aspect: "video",
        cols: "col-span-12 lg:col-span-4",
      },
    ],
  },
  {
    label: "Career",
    items: [
      {
        no: "04",
        image: "/images/work/gapyear2.jpg",
        title: "IKEA × KTH Stockholm",
        code: "GAP YEAR",
        years: "2023-2024",
        href: "https://youtu.be/zWAlZcu_BdU",
        external: true,
        badge: "Gap Year",
        tag: "vlog",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
      {
        no: "05",
        image: "/images/work/capcut.jpg",
        title: "CapCut 剪映",
        code: "CAPCUT",
        years: "2020-2022",
        href: "https://www.youtube.com/watch?v=Hb_kz4Nmbfk",
        external: true,
        badge: "0 → 1",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
      {
        no: "06",
        image: "/images/work/oneplus-8pro.jpg",
        title: "OnePlus Imaging",
        code: "ONEPLUS",
        years: "2018-2020",
        href: "https://www.youtube.com/live/rQEtyuhLEAA?t=2290",
        external: true,
        tag: "keynote",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
    ],
  },
  {
    label: "Channels",
    film: {
      title: "Introducing Zake Zhang Pro",
      cover: "/images/work/channels-film.jpg",
      ytId: "FHG5-uivlbc",
      bvid: "BV17h4y1v7jT",
      badge: "Keynote Cut",
    },
    items: [
      {
        no: "07",
        image: "/images/work/youtube-arr.jpg",
        title: "YouTube @zakezhang",
        code: "YT",
        years: "SINCE 2014 · 14.5K SUBS",
        href: "https://www.youtube.com/@zakezhang",
        external: true,
        badge: "Channel",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
      {
        no: "08",
        image: "/images/work/bilibili.jpg",
        title: "Bilibili @张子贺 Zake",
        code: "BILI",
        years: "SINCE 2017 · 108K FANS",
        href: "https://space.bilibili.com/89944567",
        external: true,
        badge: "Channel",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
      {
        no: "09",
        image: "/images/work/red2.jpg",
        title: "RED @张子贺 Zake",
        code: "RED",
        years: "SINCE 2021 · 30K+ FANS",
        href: "https://www.xiaohongshu.com/user/profile/5d3493a000000000100134e5",
        external: true,
        badge: "Channel",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
    ],
  },
  {
    label: "Off-Screen",
    items: [
      {
        no: "10",
        image: "/images/work/muztagh2.jpg",
        title: "Muztagh Ata 慕士塔格攀登",
        code: "MUZTAGH ATA",
        years: "7546M",
        href: "https://www.youtube.com/watch?v=fWKfwCIem4c",
        external: true,
        tag: "climb",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
      {
        no: "11",
        image: "/images/work/bjj2.jpg",
        title: "Brazilian Jiu-Jitsu",
        badge: "Blue Belt",
        code: "BJJ",
        years: "2022-2026",
        href: "https://youtu.be/lK7Rn7fkt3M",
        external: true,
        tag: "life",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
      {
        no: "12",
        image: "/images/work/tmb.jpg",
        title: "Tour du Mont Blanc",
        code: "TMB",
        years: "170KM",
        href: "https://youtu.be/vgYmRSsUKnk",
        external: true,
        tag: "trek",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
      {
        no: "13",
        image: "/images/work/yading.jpg",
        title: "Yading: The Lost Horizon",
        code: "YADING",
        years: "65KM",
        href: "https://youtu.be/h_hsHjeVFcU",
        external: true,
        tag: "trek",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
      {
        no: "14",
        image: "/images/work/dontsettle.jpg",
        title: "Don't Settle",
        code: "RAP",
        years: "RAP",
        href: "https://youtu.be/Ku5Mv_DDU1U",
        external: true,
        tag: "music",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
      {
        no: "15",
        image: "/images/work/pomegranate.jpg",
        title: "Pomegranate",
        code: "FOREST RAP",
        years: "RAP",
        href: "https://youtu.be/gpc8ubpkIjU",
        external: true,
        tag: "music",
        aspect: "video",
        cols: "col-span-12 sm:col-span-6 lg:col-span-4",
      },
    ],
  },
];

export const stickyCta = {
  motto: ["LIFE IS A DRUG"],
  // Summited peaks, marked on the ridgeline (highest first)
  peaks: [
    { name: "MUZTAGH ATA", alt: "7546M" },
    { name: "NAMA", alt: "5588M" },
    { name: "MONT BLANC", alt: "4810M" },
  ],
  // Trekking routes walked, with classic distances
  routes: "Luoke 70km · Kungsleden 110km · TMB 170km · Tre Cime 10km",
};

/** Photo gallery dealt around the motto page — sourced from the
 *  "Zake web" folder. Filenames carry a content hash so caches can
 *  never serve stale pixels; pixels are stored upright (no EXIF
 *  rotation dependence) and `ar` is the exact display ratio. */
export const ctaGallery = [
  { src: "/images/gallery/g01-a0d250.jpg", frame: "w-44 lg:w-60", ar: "1600 / 900" },
  { src: "/images/gallery/g02-1edd12.jpg", frame: "w-40 lg:w-52", ar: "1600 / 900" },
  { src: "/images/gallery/g03-cdcbd3.jpg", frame: "w-28 lg:w-36", ar: "1200 / 1600" },
  { src: "/images/gallery/g04-5d4d77.jpg", frame: "w-36 lg:w-44", ar: "1600 / 1600" },
  { src: "/images/gallery/g05-cfb062.jpg", frame: "w-40 lg:w-48", ar: "1600 / 1466" },
  { src: "/images/gallery/g06-31df30.jpg", frame: "w-32 lg:w-40", ar: "1067 / 1600" },
  { src: "/images/gallery/g07-e107cd.jpg", frame: "w-28 lg:w-32", ar: "1067 / 1600" },
  { src: "/images/gallery/g08-4413e3.jpg", frame: "w-28 lg:w-36", ar: "1066 / 1600" },
  { src: "/images/gallery/g09-758088.jpg", frame: "w-32 lg:w-40", ar: "1066 / 1600" },
  { src: "/images/gallery/g10-eb948c.jpg", frame: "w-28 lg:w-32", ar: "1167 / 1600" },
  { src: "/images/gallery/g11-7b0e1e.jpg", frame: "w-28 lg:w-36", ar: "1200 / 1600" },
  { src: "/images/gallery/g12-a5fb1b.jpg", frame: "w-44 lg:w-56", ar: "1600 / 909" },
  { src: "/images/gallery/g13-35377d.jpg", frame: "w-32 lg:w-40", ar: "1200 / 1600" },
  { src: "/images/gallery/g14-e21d2b.jpg", frame: "w-28 lg:w-32", ar: "1200 / 1600" },
  { src: "/images/gallery/g15-9485dc.jpg", frame: "w-36 lg:w-44", ar: "1600 / 1600" },
  { src: "/images/gallery/g16-4742f2.jpg", frame: "w-36 lg:w-44", ar: "1600 / 1580" },
  { src: "/images/gallery/g17-0bcbbc.jpg", frame: "w-28 lg:w-36", ar: "1200 / 1600" },
  { src: "/images/gallery/g18-02d586.jpg", frame: "w-32 lg:w-40", ar: "1069 / 1600" },
  { src: "/images/gallery/g19-4aec4c.jpg", frame: "w-44 lg:w-60", ar: "1600 / 940" },
] as const;

export const footer = {
  line: "Let's live a life worth remembering",
  email: "zake.august93@gmail.com",
  links: [
    { label: "YouTube", href: "https://www.youtube.com/@zakezhang" },
    { label: "Bilibili", href: "https://space.bilibili.com/89944567" },
    { label: "RED", href: "https://www.xiaohongshu.com" },
  ] satisfies FooterLink[],
};
