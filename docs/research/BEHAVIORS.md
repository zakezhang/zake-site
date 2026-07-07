# Behaviors — haoqi.design

来源：SSR HTML 的类名/aria 标签 + CSS keyframes 推断。Chrome MCP 未连接，无法运行时验证的项已标注【推断】。

## 全局
- **滚动**：页面不滚动，`fixed` 容器内 `overflow-y-auto`，`no-scrollbar` 隐藏滚动条，`overscroll-contain`。未发现 Lenis/Locomotive 类（无 `.lenis` 等类名）。
- **Loader**：居中 140px 进度条，`bg-l3` 轨道 / `bg-l1` 填充；完成后 hsstFadeOut【推断：阶梯式淡出后移除】。
- **噪点层**：z-30 全屏 canvas，pointer-events-none，动态颗粒【推断：requestAnimationFrame 重绘噪点】。
- **背景 canvas**：-z-1 固定，h-dvh；滚动到 footer 时露出（footer 上方内容有 bg-b1，footer 区域透出 canvas）【推断】。

## Header
- **时钟**：`GMT+8 CN --:--`，SSR 时为占位 `--:--`，客户端水合后显示实时时间；冒号 `ltBlink` 1s 闪烁【推断：animation: ltBlink 1s infinite】。移动端仅 `--:--`+时间。
- **坐标**：`0001 X 0001 Y` — 鼠标位置追踪，4 位补零 tabular-nums【推断：mousemove 监听】。
- **THEME[A]**：aria "Theme: system"。点击循环 system → light → dark，标签相应变为 [A]/[L]/[D]【推断】。切换时页面颜色 `transition-colors duration-300 ease-out`（内容容器上有该类）。
- **SOUND[|]**：aria "Sound playing, click to pause"。指示符 `[|]` 旋转（rtSpin）表示播放中，暂停时停止【推断】。
- **hover**：logo/导航/坐标等元素 `before:` 伪元素 `border-2 border-dotted border-transparent`，hover 时变可见（虚线选框，设计师的"选中"隐喻）【推断：lg:hover:before:border-l1 类似 footer 的实现，但 dotted】。

## Hero
- 打码公司名：6 个 `■`（tabular-nums, min-w-[0.62em]），aria "Protected — enter passcode to reveal"，点击进入输入密码彩蛋（caret-blink 光标、code-* 色板）。**本复刻版实现为静态趣味元素 + title 提示，不做密码逻辑。**
- 文案元素有入场动画【推断：span 双层嵌套结构是字行 reveal 动画的典型标记 — 外层 overflow-hidden、内层 translateY 上移入场，配 --ease-66】。

## About
- 手写签名 SVG：`svg-sign` 类，stroke 描边动画【推断：stroke-dashoffset 入场绘制】。
- 链接下划线：`decoration-(--label-3)`，hover → decoration 变浓，`transition-[text-decoration-color] duration-150`。

## Work
- 卡片 hover：`group` 标记【推断：封面图微缩放/变亮，标题行保持】。
- 徽章：`bg-selection`（荧光绿）`px-1 font-mono-2 text-black`，绝对定位右上。
- 外链卡片年份旁有 `tools ↗` 标签（lg 以上显示）。

## Sticky CTA + Footer
- CTA `sticky top-0`：滚动经过时钉住，footer（`relative z-10`）从下方滑上盖过 — 经典 footer-reveal。
- Footer 链接 hover：`before:border-2 border-transparent` → `lg:hover:before:border-l1`（实线选框）。

## Responsive
- lg(1024) 为主断点：导航显隐、padding 4↔14、字号切换；sm(640) 影响 work 卡片与 about 左栏；footer 字号 md/xl/2xl 逐级微调。
