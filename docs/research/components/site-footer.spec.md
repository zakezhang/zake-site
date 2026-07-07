# SiteFooter Specification

## Overview
- **Target file:** `src/components/SiteFooter.tsx`
- **Interaction model:** static + hover（链接选框）

## DOM Structure（原站精确）
`footer#contact.z-10.relative.flex.flex-col.justify-center.p-6.lg:p-16.w-full.min-h-dvh`（footer 需至少一屏高以完成 reveal；背景透出 -z-1 canvas，故不设 bg）
- 大字三组 `div.gap-2.grid.grid-cols-12.font-bold.text-[7.2svw].lg:text-[6svw].xl:text-[5.6svw].2xl:text-[5svw]`
  1. `span.col-span-6.md:col-span-5.xl:col-span-4.md:col-start-2.xl:col-start-3.text-left`：`Let's`｜`span.col-span-6.md:col-span-5.xl:col-span-4.text-right`：`Make`
  2. `span.col-span-12.md:col-start-2.xl:col-start-3.text-left`：`Something`
  3. `span.col-span-12.md:col-end-12.xl:col-end-11.text-right`：`Worth Telling`
- 联系行 `div.absolute.inset-0.flex.flex-col.justify-end.px-4.lg:px-14.py-18`
  - `div.flex.lg:flex-row.flex-col.justify-between.w-full`
    - 邮箱 `a[mailto:hi@vidmuse.ai]`（占位，待确认）
    - 右组：YouTube / Bilibili / RED 三链接
  - 链接样式：`block.relative.p-2.before:absolute.before:inset-0.before:border-2.before:border-transparent.lg:hover:before:border-l1`，font-mono-2

## 原站文案 → Zake
- `Let's Create Something Extraordinary` → `Let's Make Something Worth Telling`
- `curiosity.wen@gmail.com` → `hi@vidmuse.ai`（占位）
- Twitter/X, Figma, GitHub → YouTube, Bilibili, RED

## States & Behaviors
- 链接 hover：透明 2px 边框 → 实线 border-l1（duration-150）
- footer 为 reveal 层：z-10 relative，滑上盖过 sticky CTA

## Responsive
- <lg：联系行纵向堆叠；大字 7.2svw；p-6
