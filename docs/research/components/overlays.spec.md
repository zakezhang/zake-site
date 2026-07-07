# Overlays Specification（Loader / GrainOverlay / BackgroundCanvas）

## Loader
- **Target:** `src/components/Loader.tsx`（client）
- DOM：`div.fixed.left-1/2.top-1/2.z-40.flex.h-4.w-[140px].-translate-x-1/2.-translate-y-1/2`
  - 轨道 `div.relative.h-1.5.w-full.overflow-hidden.rounded-full.bg-l3`
  - 填充 `div.absolute.inset-y-0.left-0.rounded-full.bg-l1`，width 0→100%
- 行为：挂载后 ~0.9s 内推进到 100%（ease-66），随后整体 `hsstFadeOut .5s` 并卸载；期间内容层不可见（配合 body 上的 loading 态 class，内容 hsstFadeIn 入场）

## GrainOverlay
- **Target:** `src/components/GrainOverlay.tsx`（client）
- DOM：`div.z-30.fixed.inset-0.pointer-events-none > canvas`（原站同构）
- 行为：低分辨率 canvas（devicePixelRatio/3）每 ~80ms 重绘随机灰度噪点，opacity ~0.05（light）/0.07（dark），mix-blend 无（原站直接低透明度）【推断】
- prefers-reduced-motion：静帧噪点

## BackgroundCanvas
- **Target:** `src/components/BackgroundCanvas.tsx`（client）
- DOM：`div.top-0.left-0.-z-1.fixed.w-full.h-dvh.lg:h-screen > div > div > canvas`
- 原站为 WebGL 背景（细节不可静态提取）。复刻实现：2D canvas 缓慢漂移的点阵/等高线风场，颜色用 label-4 透明度级，滚到 footer 区域时露出（footer 之前的内容自带 bg-b1 遮挡）
- prefers-reduced-motion：静态点阵
