# AboutSection Specification

## Overview
- **Target file:** `src/components/AboutSection.tsx`
- **Interaction model:** static + 签名描边入场 + 链接 hover

## DOM Structure（原站精确栅格）
`div.grid.grid-cols-12.px-4.lg:px-14.py-18.lg:py-24.lg:pb-28.w-full`
- 左 `div.relative.col-span-12.sm:col-span-4.lg:col-span-3.p-2`
  - `svg.svg-sign.-top-1/32.-left-1/12.absolute.w-3/4.pointer-events-none`（手写签名，stroke 动画）
  - `div.aspect-square`（原站为肖像/占位区；复刻版：bg-be 色块 + 底部 font-mono-2 小字坐标注记）
- 右 `div.flex.flex-col.justify-start.items-start.gap-6.col-span-12.sm:col-span-7.lg:col-span-8`
  - p1 `p.p-2.w-full.text-l1.md:text-[4.2svw].text-xl.leading-[1.3].md:leading-none.select-text`
  - p2 同上但 `text-l2`，内嵌链接：`a.inline.text-l1.underline.underline-offset-[0.08em].decoration-solid.decoration-(--label-3).transition-[text-decoration-color].duration-150` hover → `decoration-l1`

## States & Behaviors
- 签名：进入视口时 stroke-dashoffset 从全长到 0，~1.2s ease-66（IntersectionObserver once）
- 链接 hover：decoration-color label-3 → label-1，150ms

## Text Content（Zake）
- p1：`I explore how AI reshapes filmmaking — building agents that turn a song, a script, a spark into moving image.`
- p2：`I'm building VidMuse™(→vidmuse.ai), with Kian(→#) and Viable(→#), and previously shaped CapCut(→capcut.com) at ByteDance.`

## Responsive
- <sm：左栏 col-span-12 在上；sm 起 4/7 分栏；字号 xl → md:4.2svw
