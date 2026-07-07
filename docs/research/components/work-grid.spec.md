# WorkGrid Specification

## Overview
- **Target file:** `src/components/WorkGrid.tsx` + `src/components/WorkCard.tsx`
- **Interaction model:** static + hover

## DOM Structure
`section#work.px-4.lg:px-14.py-18.lg:py-24.w-full > div.grid.grid-cols-12.w-full`
每张卡 `article`（列位见下表）> `a.group.block.space-y-3.p-2`
- 封面 `div.relative.w-full.pointer-events-none.select-none`（内含 aspect 容器；可选徽章 `span.top-0.right-0.z-10.absolute.bg-selection.px-1.font-mono-2.text-black`）
- 标题行 `div.flex.justify-between.items-center.gap-3.min-w-0.text-xs.lg:text-sm.uppercase`
  - `span.flex-1.min-w-0.truncate` 标题
  - `div.flex.items-center.gap-2.sm:gap-3.font-mono-2.tabular-nums.whitespace-nowrap.shrink-0` 年份（+ 外链卡片 `span.hidden.lg:inline-flex.items-center.gap-1` 标签 `tag ↗`）

## 列位（原站精确值 → Zake 内容映射）

| # | 列位（col-span / start） | 原站 | Zake 替换 | 徽章 | 年份 | 标签 |
|---|---|---|---|---|---|---|
| 1 | 12 / lg:8 start-5 | Reunimos™ | VidMuse™ → vidmuse.ai | AI Product | 2024-2026 | — |
| 2 | 12 / lg:6 xl:5 start-1 | Inspire Mono | Kian | Open Source | 2025 | — |
| 3 | 12 / lg:6 xl:5 lg:start-7 | Wasm design utils | Viable | Coding Agent | 2025 | — |
| 4 | 6 / lg:4 start-5 xl:3 start-6 | VectorSymbols | YouTube @zakezhang → youtube.com/@zakezhang | Channel | 2024-2026 | video ↗ |
| 5 | 6 / lg:4 start-9 xl:3 start-10 | DarkSide | Bilibili 张子贺 → space.bilibili.com/89944567 | Channel | 2019-2026 | video ↗ |
| 6 | 12 / lg:4 start-1 xl:3 start-1 | aDrive 阿里云盘 | CapCut 剪映 → capcut.com | — | 2021-2024 | — |
| 7 | 6 / lg:4 start-5 xl:3 start-5 | Shore Icon | RED zake_august → xiaohongshu.com | — | 2024-2026 | — |
| 8 | 6 / lg:4 start-9 xl:3 start-9 | Teambition | OnePlus Keynote | — | 2019 | — |
| 9 | 6 / lg:4 start-5 xl:3 start-6 | FoF: See Hear Touch | Alpine: National Grade-1 | — | 2015-2020 | life ↗ |
| 10 | 6 / lg:4 start-9 xl:3 start-10 | FoF: Design System | BJJ Blue Belt | — | 2022-2026 | life ↗ |

年份中 CapCut/OnePlus/Alpine/BJJ 为待用户确认的估值（记忆中无精确年份）。

## 封面（个性化实现）
原站封面图为客户端加载（静态 HTML 未含 img src）。复刻版：`aspect-[16/10]`（#1）/`aspect-[4/3]`（其余）容器，bg-be 底 + 居中 font-mono-2 uppercase 编号+项目代号（`No.01 — VIDMUSE`）+ 细 line 边框；hover: `group-hover` 时封面 `scale-[1.015]`，600ms ease-66。用户后续可替换为真实截图（public/images/work/）。

## Responsive
- <lg：#1-3 col-span-12，#4-10 col-span-6；标题行 text-xs
