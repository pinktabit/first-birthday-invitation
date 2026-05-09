const PARTY_DATE_TIME = "2026-06-13T16:30:00";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeN5nlH4j-wXPRz5jLv5FExyD4AE3xMDQOfYONWcTxj1Pw0kg/viewform";
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeN5nlH4j-wXPRz5jLv5FExyD4AE3xMDQOfYONWcTxj1Pw0kg/formResponse";
const GOOGLE_FORM_FIELDS = {
  attendance: "entry.355234693",
  name: "entry.1749070286",
  phone: "entry.1550788275",
  guests: "entry.1934757202",
  message: "entry.564547742",
};

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
      showToast("계좌번호가 복사되었습니다.");
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
  if (!rsvpSubmit) return;

  rsvpSubmit.addEventListener("click", (event) => {
    event.preventDefault();

    const selectedAttendance = document.querySelector(".radio-box.is-selected");
    const nameInput = document.querySelector("#rsvpName");
    const phoneInput = document.querySelector("#rsvpPhone");
    const guestsSelect = document.querySelector("#rsvpGuests");
    const messageInput = document.querySelector("#rsvpMessage");

    if (!selectedAttendance) {
      showToast("참석 여부를 선택해 주세요.");
      return;
    }

    if (!nameInput || !nameInput.value.trim()) {
      showToast("성함을 입력해 주세요.");
      nameInput?.focus();
      return;
    }

    let hiddenFrame = document.querySelector("#hiddenGoogleFormFrame");
    if (!hiddenFrame) {
      hiddenFrame = document.createElement("iframe");
      hiddenFrame.id = "hiddenGoogleFormFrame";
      hiddenFrame.name = "hiddenGoogleFormFrame";
      hiddenFrame.style.display = "none";
      document.body.appendChild(hiddenFrame);
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = GOOGLE_FORM_ACTION_URL;
    form.target = "hiddenGoogleFormFrame";
    form.style.display = "none";

    const payload = {
      [GOOGLE_FORM_FIELDS.attendance]: selectedAttendance.textContent.trim(),
      [GOOGLE_FORM_FIELDS.name]: nameInput.value.trim(),
      [GOOGLE_FORM_FIELDS.phone]: phoneInput?.value.trim() || "",
      [GOOGLE_FORM_FIELDS.guests]: guestsSelect?.value || "본인 외 0명",
      [GOOGLE_FORM_FIELDS.message]: messageInput?.value.trim() || "",
    };

    Object.entries(payload).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    form.remove();

    showToast("참석 여부가 전달되었습니다.");

    window.setTimeout(() => {
      document.querySelectorAll(".radio-box").forEach((item) => {
        item.classList.remove("is-selected");
      });
      nameInput.value = "";
      if (phoneInput) phoneInput.value = "";
      if (guestsSelect) guestsSelect.selectedIndex = 0;
      if (messageInput) messageInput.value = "";
    }, 200);
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

updateCountdown();
window.setInterval(updateCountdown, 1000);
bindAccountCopy();
bindRsvpForm();
bindMapLinks();
