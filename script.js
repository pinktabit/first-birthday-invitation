const PARTY_DATE_TIME = "2026-06-13T16:30:00";

const DEFAULT_CONFIG = {
  appsScriptUrl: "",
};

function getConfig() {
  return {
    ...DEFAULT_CONFIG,
    ...(window.INVITATION_CONFIG || {}),
  };
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
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
      showToast("계좌번호가 복사되었습니다.");
    });
  });
}

function collectRsvpPayload() {
  const selectedAttendance = document.querySelector(".radio-box.is-selected");
  const nameInput = document.querySelector("#rsvpName");
  const phoneInput = document.querySelector("#rsvpPhone");
  const guestsSelect = document.querySelector("#rsvpGuests");
  const messageInput = document.querySelector("#rsvpMessage");

  if (!selectedAttendance) {
    showToast("참석 여부를 선택해 주세요.");
    return null;
  }

  if (!nameInput || !nameInput.value.trim()) {
    showToast("성함을 입력해 주세요.");
    nameInput?.focus();
    return null;
  }

  return {
    attendance: selectedAttendance.textContent.trim(),
    name: nameInput.value.trim(),
    phone: phoneInput?.value.trim() || "",
    guests: guestsSelect?.value || "본인 외 0명",
    message: messageInput?.value.trim() || "",
    submittedAt: new Date().toISOString(),
  };
}

function resetRsvpForm() {
  document.querySelectorAll(".radio-box").forEach((item) => {
    item.classList.remove("is-selected");
  });

  const nameInput = document.querySelector("#rsvpName");
  const phoneInput = document.querySelector("#rsvpPhone");
  const guestsSelect = document.querySelector("#rsvpGuests");
  const messageInput = document.querySelector("#rsvpMessage");

  if (nameInput) nameInput.value = "";
  if (phoneInput) phoneInput.value = "";
  if (guestsSelect) guestsSelect.selectedIndex = 0;
  if (messageInput) messageInput.value = "";
}

async function submitRsvp(payload) {
  const { appsScriptUrl } = getConfig();

  if (!appsScriptUrl) {
    showToast("RSVP 연결 주소를 먼저 설정해 주세요.");
    return false;
  }

  await fetch(appsScriptUrl, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
  return true;
}

function bindRsvpForm() {
  document.querySelectorAll(".radio-box").forEach((box) => {
    box.addEventListener("click", () => {
      const siblings = box.parentElement?.querySelectorAll(".radio-box") || [];
      siblings.forEach((item) => item.classList.remove("is-selected"));
      box.classList.add("is-selected");
    });
  });

  const rsvpSubmit = document.querySelector("#rsvpSubmit");
  if (!rsvpSubmit) return;

  rsvpSubmit.addEventListener("click", async (event) => {
    event.preventDefault();

    const payload = collectRsvpPayload();
    if (!payload) return;

    rsvpSubmit.classList.add("is-loading");
    rsvpSubmit.setAttribute("aria-disabled", "true");

    try {
      const saved = await submitRsvp(payload);
      if (!saved) {
        throw new Error("Save failed");
      }

      resetRsvpForm();
      showToast("참석 여부가 전달되었습니다.");
    } catch (error) {
      console.error(error);
      showToast("전달 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      rsvpSubmit.classList.remove("is-loading");
      rsvpSubmit.removeAttribute("aria-disabled");
    }
  });
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

      const startedAt = Date.now();
      const fallbackTimer = window.setTimeout(() => {
        if (Date.now() - startedAt < 1800) {
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

updateCountdown();
window.setInterval(updateCountdown, 1000);
bindAccountCopy();
bindRsvpForm();
bindMapLinks();
