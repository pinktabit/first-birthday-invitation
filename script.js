// 여기 수정: 실제 행사 날짜/시간으로 바꾸면 카운트다운이 자동으로 계산됩니다.
const PARTY_DATE_TIME = "2026-06-13T16:30:00";

// 여기 수정: Google Form 주소가 생기면 # 대신 넣어 주세요.
const GOOGLE_FORM_URL = "#";

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function updateCountdown() {
  const target = new Date(PARTY_DATE_TIME).getTime();
  const diff = Math.max(target - Date.now(), 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  setText("#countDays", String(days));
  setText("#countHours", String(hours).padStart(2, "0"));
  setText("#countMinutes", String(minutes).padStart(2, "0"));
  setText("#countSeconds", String(seconds).padStart(2, "0"));
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

function bindAccountCopy() {
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(`#${button.dataset.copyTarget}`);
      if (!target) return;

      copyText(target.textContent.trim());
      showToast("계좌번호가 복사되었습니다");
    });
  });
}

function bindRsvpForm() {
  document.querySelectorAll(".radio-box").forEach((box) => {
    box.addEventListener("click", () => {
      box.parentElement.querySelectorAll(".radio-box").forEach((item) => {
        item.classList.remove("is-selected");
      });
      box.classList.add("is-selected");
    });
  });

  const rsvpSubmit = document.querySelector("#rsvpSubmit");
  if (rsvpSubmit) {
    rsvpSubmit.addEventListener("click", (event) => {
      if (GOOGLE_FORM_URL === "#") {
        event.preventDefault();
        showToast("Google Form 링크를 script.js에서 연결해 주세요");
        return;
      }

      rsvpSubmit.href = GOOGLE_FORM_URL;
      rsvpSubmit.target = "_blank";
      rsvpSubmit.rel = "noopener";
    });
  }
}

function bindMapLinks() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  document.querySelectorAll(".map-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const appLink = link.dataset.appLink;
      const webFallback = link.dataset.webFallback || link.href;

      if (!appLink) return;

      event.preventDefault();

      if (!isMobile) {
        window.open(webFallback, "_blank", "noopener");
        return;
      }

      const now = Date.now();
      const fallbackTimer = window.setTimeout(() => {
        if (Date.now() - now < 1800) {
          window.location.href = webFallback;
        }
      }, 1200);

      window.addEventListener(
        "pagehide",
        () => window.clearTimeout(fallbackTimer),
        { once: true }
      );

      window.location.href = appLink;
    });
  });
}

function bindGuestBookMock() {
  const guestSubmit = document.querySelector("#guestSubmit");
  if (!guestSubmit) return;

  guestSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("방명록 저장 기능은 나중에 연결할 수 있어요");
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1000);
bindAccountCopy();
bindRsvpForm();
bindMapLinks();
bindGuestBookMock();
