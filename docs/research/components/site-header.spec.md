# SiteHeader Specification

## Overview
- **Target file:** `src/components/SiteHeader.tsx`（client component）
- **Interaction model:** time-driven（时钟）+ mouse-driven（坐标）+ click-driven（THEME/SOUND）

## DOM Structure
`header.z-50.fixed.inset-0.flex.flex-col.justify-between.font-mono-2.pointer-events-none`
- 上行 `div.flex.justify-between.items-center.px-4.lg:px-14.py-4.lg:py-7.text-base`
  - 左：`a[href=/]`（pointer-events-auto）logo 两段：`zake` + `.zhang`（原站 `haoqi`+`.design`）
  - 右：`div.hidden.lg:flex.gap-x-3.gap-y-2.pointer-events-auto`：Work、Contact 按钮（锚点滚动）、THEME[?]、SOUND[?]
- 下行 `div.flex.justify-between.px-4.lg:px-14.py-4.lg:py-7`
  - 左：时钟。移动端 `--:--`+时间（`lg:hidden`），桌面 `GMT+8 CN HH:MM`（`hidden lg:inline`），p-2 uppercase
  - 右：`0001 X 0001 Y` 鼠标坐标（4 位补零，tabular-nums）

## Styles（源 CSS 精确值）
- 字体 font-mono-2（Space Mono 替代 tronica-mono），text-base
- 可交互元素统一 hover 隐喻：`relative before:content-[''] before:absolute before:inset-0 before:border-2 before:border-dotted before:border-transparent before:pointer-events-none` + `p-2`；hover 时 `before:border-l1`（虚线选框）
- 文字色 text-l1；页面色变过渡 `transition-colors duration-300 ease-out`

## States & Behaviors
- **时钟**：每秒更新；冒号 `animation: ltBlink 1s steps(1) infinite`。SSR 占位 `--:--` 防水合不一致。
- **坐标**：window mousemove → `String(x).padStart(4,'0') + ' X ' + ... + ' Y'`
- **THEME**：点击循环 system→light→dark，标签 [A]/[L]/[D]；写 localStorage `theme`，html.classList toggle `.dark`；system 时跟随 matchMedia
- **SOUND**：播放态标签 `SOUND[|]` 且指示符 `rtSpin 2s linear infinite` 旋转；暂停态 `SOUND[-]` 停转。本站无音频资产 → 纯状态开关（WebAudio 轻环境音可后加）
- **Work/Contact**：滚动容器内锚点平滑滚动至 #work / #contact

## Responsive
- 右侧导航 `hidden lg:flex`；px 4→14、py 4→7；时钟两个变体互斥显隐

## Text Content（Zake 个性化）
logo: `zake` `.zhang`｜nav: Work / Contact / THEME[A] / SOUND[|]｜clock: `GMT+8 CN --:--`｜coords: `0001 X 0001 Y`
