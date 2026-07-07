# HeroSection Specification

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Interaction model:** static + 入场 reveal + click（打码彩蛋）

## DOM Structure（原站精确栅格）
`div.grid.grid-cols-12.grid-rows-[auto_1fr].px-4.lg:px-14.py-18.lg:py-24.w-full.min-h-dvh`
- 信息行 `div.flex.flex-col.order-2.lg:order-1.lg:grid.lg:grid-cols-12.col-span-12.font-mono`
  - A `span.hidden.lg:block.lg:col-span-3.xl:col-span-2.lg:col-start-1.p-2.font-sans`：两行 `Product &` `Storytelling`
  - B `span.hidden.lg:block.lg:col-span-3.xl:col-span-2.lg:col-start-4.xl:col-start-5.p-2.text-balance`：tagline
  - C `span.col-span-12.lg:col-span-6.xl:col-span-4.lg:col-start-7.xl:col-start-9.mt-auto.lg:mt-0.p-2`：bio 段 + 打码彩蛋（6×`■`，`inline-block.min-w-[0.62em].text-center.text-l1.tabular-nums`）
- 展示行 `div.flex.flex-col.self-end.order-1.lg:order-2.col-span-12.px-2.font-bold`：三行大字（每行双层 span：外层 overflow-hidden，内层 translateY reveal 入场，--ease-66，逐行 delay）

## Styles
- 大字：font-bold，字号 `text-[13svw] lg:text-[9svw] leading-[0.98] tracking-tight`【推断：原站类被内联动画库处理，静态 HTML 未暴露字号，按截图比例估算】
- 信息字：font-mono text-sm/base，text-l1；tagline text-balance

## States & Behaviors
- 入场：大字三行依次 translateY(110%)→0，600ms ease-66，delay 60ms 递增；信息行 hsstFadeIn
- 彩蛋：`■■■■■■` title="Protected — ask me over coffee"，点击在 `■■■■■■` 与 `$10M+ ARR` 间切换（个性化改造，原站为密码输入）

## Text Content（Zake）
- A：`Product &` / `Storytelling`
- B：`Building in public. Turning life into a series.`
- C：`I'm Zake Zhang, founder of VidMuse — an AI video agent that turns music into film, now past ■■■■■■. Previously PM at CapCut. Off-screen I climb mountains and train jiu-jitsu.`（VidMuse 链接 vidmuse.ai）
- 大字：`I turn` / `life & code` / `into stories`

## Responsive
- 移动端：A/B 隐藏，大字在前（order-1），bio 贴底；py-18；大字 13svw
