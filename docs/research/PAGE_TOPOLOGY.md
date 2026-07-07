# Page Topology — haoqi.design

单页作品集。页面本身不滚动，滚动发生在一个 `fixed inset-0` 的内部容器里（隐藏滚动条）。

## 层级（z-index 从高到低）

| 层 | 定位 | 内容 | 交互模型 |
|---|---|---|---|
| z-50 Header | `fixed inset-0 flex flex-col justify-between`，`pointer-events-none`（子元素 auto） | 上行：logo `haoqi`+`.design`｜右侧 Work / Contact / THEME[A] / SOUND[\|]（lg 以上显示）。下行：`GMT+8 CN --:--` 实时时钟（移动端只显示 `--:--`）｜`0001 X 0001 Y` 鼠标坐标 | 时钟 time-driven；坐标 mouse-driven；THEME 点击循环；SOUND 点击开关；hover 出现虚线框 |
| z-40 Loader | `fixed left-1/2 top-1/2 w-[140px] h-4` | 进度条：`h-1.5 rounded-full bg-l3` 轨道 + `bg-l1` 填充 | time-driven，加载完成后 hsstFadeOut 消失 |
| z-30 Grain | `fixed inset-0 pointer-events-none` + canvas | 全屏噪点/颗粒 | time-driven 动画噪点 |
| 滚动容器 | `fixed inset-0` > `overflow-y-auto no-scrollbar overscroll-contain` | 全部内容 section | scroll |
| -z-1 背景 canvas | `fixed top-0 left-0 w-full h-dvh` | WebGL/canvas 背景，位于内容之后，滚到底部（footer 区域）露出 | time-driven |

## 内容 section 顺序（滚动容器内）

1. **Hero** — `grid grid-cols-12 grid-rows-[auto_1fr] px-4 lg:px-14 py-18 lg:py-24`
   - 信息行（mobile 排第二 / desktop 排第一）：三栏 font-mono 小字 —
     a) `Design & / Engineering`（font-sans，lg:col 1-3）
     b) 一句 tagline（lg:col 4-6，text-balance）
     c) 自我介绍段（col 7-12，含"打码公司名"彩蛋 ■×6，aria: Protected — enter passcode to reveal）
   - 展示行（mobile 排第一）：三行超大 font-bold 标语 "I bring / craft & taste / to digital work"
2. **About** — `grid grid-cols-12 px-4 lg:px-14 py-18 lg:py-24 lg:pb-28`
   - 左（sm:col-span-4 lg:col-span-3）：手写签名 SVG（绝对定位，`w-3/4 -top-1/32 -left-1/12`）叠在 `aspect-square` 容器上
   - 右（sm:col-span-7 lg:col-span-8）：两段超大文字 `md:text-[4.2svw] leading-none`，第一段 text-l1，第二段 text-l2 且内嵌下划线链接（decoration 色 label-3，hover 过渡 decoration-color 150ms）
3. **Work** — `section grid grid-cols-12`，10 张卡片错落排布（见 work-grid.spec.md 的精确列位）
   - 卡片 = 封面区（`relative w-full`，右上角可有 `bg-selection px-1 font-mono-2 text-black` 徽章）+ 标题行（`flex justify-between text-xs lg:text-sm uppercase`，左标题 truncate，右年份 font-mono-2 tabular-nums；外链卡片带 `tools ↗` 类标签）
4. **Sticky CTA** — 外层 `relative`，内层 `sticky top-0 grid grid-rows-6 py-18` 居中三行大字 "Innovate / with / purpose"（font-bold text-[7.2svw]），滚动时钉住、被 footer 盖过（footer z-10 relative）
5. **Footer** — `relative z-10 flex flex-col justify-center p-6 lg:p-16`
   - 大字四段错位栅格："Let's"(左) "Create"(右) / "Something"(左) / "Extraordinary"(右)
   - 底部一行：邮箱（左）+ Twitter/X、Figma、GitHub（右），hover 出现 2px 实线框（`lg:hover:before:border-l1`）

## 响应式
- 断点主用 `lg`(1024px)，部分 `sm`/`md`/`xl`
- 移动端：header 右侧导航隐藏（`hidden lg:flex`）、时钟只显示 `--:--`、hero 大字先于信息栏、work 卡片多数变 col-span-12 或 6、footer 字号 7.2svw
