const params = new URLSearchParams(window.location.search);
const language = params.get("lang") === "en" ? "en" : "zh";
const view = params.get("view") === "experience" ? "experience" : "research";

function pageUrl(nextView, nextLanguage, hash = "") {
  const url = new URL(window.location.href);
  url.search = new URLSearchParams({ view: nextView, lang: nextLanguage }).toString();
  url.hash = hash;
  return url.href;
}

if (language === "en") {
  document.documentElement.lang = "en";
  document.title = "Yang Cheng · Dual-Arm VLA & Robot Manipulation";
  document.querySelector('meta[name="description"]').content =
    "Yang Cheng's robotics portfolio. Dual-arm VLA, hardware deployment, force-conditioned policies and admittance control at the Beijing Humanoid Robot Innovation Center.";
  for (const element of document.querySelectorAll("[data-en]")) {
    element.textContent = element.dataset.en;
  }
  for (const element of document.querySelectorAll("[data-label-en]")) {
    element.setAttribute("aria-label", element.dataset.labelEn);
  }
  for (const image of document.querySelectorAll("[data-alt-en]")) {
    image.alt = image.dataset.altEn;
  }
}

for (const section of document.querySelectorAll("[data-view]")) {
  section.hidden = section.dataset.view !== view;
}
for (const link of document.querySelectorAll("[data-view-link]")) {
  link.href = pageUrl(link.dataset.viewLink, language);
  link.removeAttribute("aria-current");
  if (link.dataset.viewLink === view) link.setAttribute("aria-current", "page");
}
for (const link of document.querySelectorAll("[data-lang-link]")) {
  const url = new URL(pageUrl(view, link.dataset.langLink, window.location.hash));
  if (params.has("demo")) url.searchParams.set("demo", params.get("demo"));
  link.href = url.href;
  link.removeAttribute("aria-current");
  if (link.dataset.langLink === language) link.setAttribute("aria-current", "true");
}
for (const link of document.querySelectorAll("[data-project-link]")) {
  link.href = pageUrl("research", language, link.hash);
}
document.querySelector("[data-brand]").href = pageUrl("research", language);

const player = document.querySelector("#video-dialog");
if (typeof player.showModal === "function") {
  const video = player.querySelector("video");
  const title = document.querySelector("#video-title");
  const description = document.querySelector("#video-description");
  const status = document.querySelector("#video-status");
  const fileLink = document.querySelector("#video-file");
  const defaultFileLabel = fileLink.textContent;
  let opener;
  let download;
  let objectUrl;

  async function loadParts(source, link) {
    const request = new AbortController();
    download = request;
    status.textContent = language === "en" ? "Loading video…" : "正在加载视频…";
    try {
      const urls = Array.from({ length: Number(link.dataset.parts) }, (_, index) =>
        new URL(`${source.pathname}.part${index}`, source));
      const parts = await Promise.all(urls.map(async (url) => {
        const response = await fetch(url, { signal: request.signal });
        if (!response.ok) throw new Error("Video part download failed");
        return response.arrayBuffer();
      }));
      if (request.signal.aborted) return;
      const clip = new Blob(parts, { type: "video/mp4" });
      if (clip.size !== Number(link.dataset.bytes)) throw new Error("Incomplete video");
      objectUrl = URL.createObjectURL(clip);
      video.src = objectUrl;
      fileLink.href = objectUrl;
      fileLink.download = source.pathname.split("/").pop();
      fileLink.textContent = language === "en" ? "Download video" : "下载视频";
      fileLink.hidden = false;
      status.textContent = "";
    } catch {
      if (request.signal.aborted) return;
      request.abort();
      status.textContent = language === "en"
        ? "Could not load the video. Close the player and open it again to retry."
        : "视频加载失败。关闭播放器后重新打开可重试。";
    }
  }

  function openVideo(link, source) {
    const figure = link.closest("figure");
    title.textContent = figure.querySelector("[data-video-heading], figcaption strong").textContent.trim();
    description.textContent = (language === "en" ? link.dataset.noteEn : link.dataset.noteZh)
      ?? figure.querySelector(".demo-note").textContent.trim();
    video.poster = link.querySelector("img").src;
    fileLink.hidden = Boolean(link.dataset.parts);
    fileLink.removeAttribute("download");
    fileLink.textContent = defaultFileLabel;
    opener = link;
    player.showModal();
    if (link.dataset.parts) {
      loadParts(source, link);
    } else {
      fileLink.href = source.href;
      video.src = source.href;
    }
  }

  for (const link of document.querySelectorAll("[data-video]")) {
    const source = new URL(link.dataset.source || link.href, window.location.href);
    const demoName = source.pathname.split("/").pop().replace(/\.mp4$/, "");
    if (link.dataset.parts) {
      const url = new URL(pageUrl("research", language));
      url.searchParams.set("demo", demoName);
      link.href = url.href;
    }
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openVideo(link, source);
    });
    if (view === "research" && params.get("demo") === demoName) openVideo(link, source);
  }

  player.addEventListener("close", () => {
    download?.abort();
    download = undefined;
    video.pause();
    video.removeAttribute("src");
    video.load();
    fileLink.removeAttribute("href");
    status.textContent = "";
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = undefined;
    opener?.focus({ preventScroll: true });
  });
}
