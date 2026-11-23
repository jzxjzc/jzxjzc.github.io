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
  document.title = "Yang Cheng · Robot Manipulation & Control";
  document.querySelector('meta[name="description"]').content =
    "Yang Cheng's robotics portfolio. Whole-body mobile manipulation, dual-arm VLA, force-conditioned policies and vision-guided grasping.";
  for (const element of document.querySelectorAll("[data-en]")) {
    element.textContent = element.dataset.en;
  }
  for (const element of document.querySelectorAll("[data-label-en]")) {
    element.setAttribute("aria-label", element.dataset.labelEn);
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
  link.href = pageUrl(view, link.dataset.langLink, window.location.hash);
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
  const fileLink = document.querySelector("#video-file");
  let opener;

  for (const link of document.querySelectorAll("[data-video]")) {
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();

      const figure = link.closest("figure");
      title.textContent = figure.querySelector("[data-video-heading], figcaption strong").textContent.trim();
      description.textContent = (language === "en" ? link.dataset.noteEn : link.dataset.noteZh)
        ?? figure.querySelector(".demo-note").textContent.trim();
      fileLink.href = link.href;
      video.poster = link.querySelector("img").src;
      video.src = link.href;
      opener = link;
      player.showModal();
    });
  }

  player.addEventListener("close", () => {
    video.pause();
    video.removeAttribute("src");
    video.load();
    opener?.focus({ preventScroll: true });
  });
}
