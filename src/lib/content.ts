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
      " — an AI video agent that turns music into film. Previously PM at CapCut and OnePlus. Off-screen I climb mountains, swim, and train jiu-jitsu.",
  },
  display: [
    { text: "I turn" },
    { text: "life & code" },
    { text: "into stories", highlight: true },
  ],
  seal: "ZAKE ZHANG • LIFE & CODE INTO STORIES • EST. 1993 • ",
};

export const about = {
  lead: "I explore how AI reshapes filmmaking — building agents that turn a song, a script, a spark into moving image.",
  body: [
    { text: "I'm building " },
    { text: "VidMuse™", href: "https://vidmuse.ai" },
    { text: ", with " },
    { text: "Kian", href: "https://www.heykian.com/en" },
    { text: " and " },
    { text: "Vibable", href: "https://vibable.sandaii.cn/" },
    { text: ", and previously shaped " },
    { text: "CapCut", href: "https://www.capcut.com" },
    { text: " at ByteDance." },
  ],
  portrait: "/images/portrait.jpg",
  portraitNote: "ZAKE ZHANG — 59.33°N 18.07°E",
  facets: [
    { icon: "mountain", label: "Mountaineer — 7546m" },
    { icon: "belt", label: "Brazilian Jiu-Jitsu — Blue Belt" },
    { icon: "wave", label: "Swimming — 50m in 29.8s" },
    { icon: "film", label: "AI Filmmaking" },
  ],
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
}

export const workGroups: WorkGroup[] = [
  {
    label: "Now",
    items: [
      {
        no: "01",
        image: "/images/work/vidmuse-2026.jpg",
        title: "VidMuse™",
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
        href: "https://www.capcut.com",
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
    items: [
      {
        no: "07",
        image: "/images/work/youtube-arr.jpg",
        title: "YouTube @zakezhang",
        code: "YT",
        years: "14.5K SUBS",
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
        years: "108K FANS",
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
        years: "30K+ FANS",
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

export const footer = {
  line: "Let's live a life worth remembering",
  email: "zake.august93@gmail.com",
  links: [
    { label: "YouTube", href: "https://www.youtube.com/@zakezhang" },
    { label: "Bilibili", href: "https://space.bilibili.com/89944567" },
    { label: "RED", href: "https://www.xiaohongshu.com" },
  ] satisfies FooterLink[],
};
