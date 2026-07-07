# Design Tokens — haoqi.design

提取方式：静态抓取（curl）`https://haoqi.design/` 的 SSR HTML 与 `/_next/static/chunks/635eb04122aa774f.css`。
Chrome MCP 未连接，无法获取运行时 computed style；以下均为源 CSS 中的精确值。

## 字体

| Token | 原站值 | 本项目替代 | 说明 |
|---|---|---|---|
| `--font-sans` | `"tiktok", sans-serif` | TikTok Sans (next/font/google) | 精确同源字体 |
| `--font-mono` | `"mono", monospace`（自托管，未暴露文件） | Fragment Mono | hero 三栏信息文字、卡片标题行 |
| `--font-mono-2` | `"tronica-mono", monospace`（自托管） | Space Mono | 头部导航标签、时间、坐标、徽章 |

字型比例（Tailwind v4 默认刻度被保留）：text-xs .75rem → text-5xl 3rem；
大字号用视口单位：about 段落 `md:text-[4.2svw]`、sticky CTA `text-[7.2svw]`、footer `text-[7.2svw] lg:text-[6svw] xl:text-[5.6svw] 2xl:text-[5svw]`。

## 颜色（双主题，RGB 通道变量 + 透明度层级）

### Light（默认，`:root`，color-scheme: light）
- `--label: 0,0,0`；`--label-d: 54,54,48`（暖灰墨色）
- `--background-deep: 251,250,244`（暖纸白）
- `--label-1: rgba(var(--label),1)` 主文字
- `--label-2: rgba(var(--label-d),.6)` 次级
- `--label-3: rgba(var(--label-d),.32)` 三级
- `--label-4: rgba(var(--label-d),.18)` 四级
- `--line: rgba(var(--label-d),.1)` 分隔线
- `--background-elevated: #efede7`
- `--selection-bg: #c0fe04`（荧光绿，徽章底色 / 文字选中色；支持 lab() 时为 `lab(92.9242% -39.8464 87.367)`）

### Dark（`.dark`，color-scheme: dark）
- `--label: 255,255,255`；`--label-d: 230,232,232`
- `--background-deep: 15,17,17`
- `--label-4` 透明度 .16，`--line` 透明度 .08
- `--background-elevated: #191b1b`

### 工具类映射（原站 @theme）
`--color-l1/l2/l3 → label-1/2/3`，`--color-line → line`，`--color-b1 → background-1`，`--color-be → background-elevated`，`--color-selection → selection-bg`

## 动效

- 标志性缓动 `--cubic-66: cubic-bezier(.66,0,.01,1)`（暴露为 `--ease-66`）
- 默认过渡 `.15s cubic-bezier(.4,0,.2,1)`
- Keyframes：
  - `ltBlink`：`0%{opacity:1} 50%{opacity:0} 100%{opacity:1}` — 时钟冒号闪烁
  - `rtSpin`：0→360deg 旋转 — SOUND 指示 `[|]` 旋转
  - `hsstFadeIn`：`0%{0} 32%{.22} 62%{.55} 100%{1}` — 阶梯式淡入（loader/主题切换）
  - `hsstFadeOut`：`0%{1} 38%{.62} 72%{.28} 100%{0}` — 阶梯式淡出
  - `caret-blink`：输入光标闪烁

## 圆角 / 其它
- `--radius-md: .375rem`，`--radius-xl: .75rem`
- 滚动容器隐藏滚动条（`no-scrollbar`），`overscroll-contain`
- 代码色板（passcode 彩蛋用）：`--code-string/number/keyword/function/tag`，明暗各一套
