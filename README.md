# 程扬 · 机器人操作与控制

中英双语作品集。包含移动机械臂毕设、北京人形机器人创新中心的双臂 VLA 与接触控制，以及航佳机器人的视觉引导抓取。

## 预览与发布

- 本地预览可用浏览器打开 `docs/index.html`。也可在项目目录运行 `python3 -m http.server 8000 --bind 127.0.0.1 --directory docs`，再打开 `http://127.0.0.1:8000/`。
- GitHub Pages 可从包含此项目文件的仓库分支发布。在仓库 **Settings → Pages** 中选择 **Deploy from a branch**，再选择上传文件的分支与 **/docs**。详见 [GitHub Pages 发布源设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
- 中文项目页使用 `?view=research&lang=zh`，英文项目页使用 `?view=research&lang=en`。经历页将 `view` 改为 `experience`。

## 编辑

文字、视频和对应的英文内容在 `docs/index.html`。样式在 `docs/style.css`，语言、视图和播放器交互在 `docs/site.js`。网页可直接部署，无需构建或安装依赖。

## 演示素材

| 文件 | 内容 | 剪辑 |
| --- | --- | --- |
| `r59-hardware.mp4` | 双箱绕行与腕部观测三视角 | 完整回合，6 倍速 |
| `ppo-simulation.mp4` | 联合 PPO 单箱留出场景 | 完整仿真回放 |
| `vla-folding.mp4` | π0.5 双臂叠衣 | 取横屏叠蓝色衬衫的片段 |
| `vla-laundry.mp4` | 洗衣场景衣物转移 | 选取一次连续操作，约 2.5 倍速 |
| `force-wiping.mp4` | 力觉擦板和接触力对比 | 视觉基线、力觉策略与对应力曲线 |
| `wrc-admittance.mp4` | WRC 展台导纳控制 | 去片头，3 倍速 |
| `hangjia-grasp.mp4` | 航佳移动抓取与放置 | 2 倍速 |

`docs/media` 内的视频统一为静音 H.264 MP4，封面均为实拍或仿真画面截帧。页面在点击播放时才加载视频。

线上版的大视频以连续文件分片存放。播放器打开后取回分片，并按原始顺序合成 MP4，画面与原成片相同。
