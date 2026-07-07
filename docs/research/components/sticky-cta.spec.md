# StickyCta Specification

## Overview
- **Target file:** `src/components/StickyCta.tsx`
- **Interaction model:** scroll-driven（sticky pin + footer reveal）

## DOM Structure（原站精确）
`div.relative.transition-colors.duration-300.ease-out.text-l1`（外层，高度需大于视口以产生钉住区间；复刻取 `h-[160vh]`【推断】）
- `div.top-0.sticky.grid.grid-cols-12.grid-rows-6.px-4.lg:px-14.py-18.h-dvh`
  - `div.flex.flex-col.justify-center.items-center.col-span-12.row-span-6.font-bold.text-[7.2svw]`
    - 三行 span：`Live` / `with` / `intention`（原站 Innovate / with / purpose）

## Styles
- text-[7.2svw] font-bold，行高紧凑 leading-[1.05]，居中
- 背景 bg-b1（保证盖住 -z-1 canvas，直到 footer 露出）

## States & Behaviors
- sticky top-0 钉住一屏；后续 footer `relative z-10` 从下方滑上覆盖（footer-reveal 模式）
- 无点击交互；hover 无

## Responsive
- 全断点同构，仅 padding 4→14 变化
