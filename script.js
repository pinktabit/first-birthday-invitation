/*
  초대장 내용은 이 파일 맨 위 INVITATION만 수정하면 대부분 바뀝니다.
  "여기 수정"이라고 적힌 부분을 실제 정보로 바꿔 주세요.
*/
const INVITATION = {
  // 여기 수정: 아기 이름
  babyName: "엘리야",

  // 여기 수정: 첫 화면과 일정에 표시될 날짜 정보
  dateText: "2026년 6월 20일 토요일",
  timeText: "오후 12시",

  // 여기 수정: D-day와 카운트다운 계산용 날짜입니다.
  ddayDate: "2026-06-20",
  ddayDateTime: "2026-06-20T12:00:00",

  // 여기 수정: 장소 정보
  venueName: "○○호텔 연회장",
  address: "서울특별시 ○○구 ○○로 123",

  // 여기 수정: 초대 문구. 줄바꿈은 그대로 화면에 반영됩니다.
  greeting: `작고 소중한 우리 아이가 어느덧 첫 번째 생일을 맞이합니다.
사랑으로 지켜봐 주신 감사한 분들을 모시고
따뜻한 시간을 함께 나누고자 합니다.`,

  // 여기 수정: 연락처. 숫자와 하이픈을 같이 적어도 됩니다.
  momPhone: "010-0000-0000",
  dadPhone: "010-1111-1111",

  // 여기 수정: 계좌 정보
  momAccount: "국민은행 000000-00-000000 김○○",
  dadAccount: "신한은행 000-000-000000 김○○",

  // 여기 수정: 지도 링크. 실제 링크를 넣으면 버튼이 새 창으로 열립니다.
  mapLinks: {
    naver: "#",
    kakao: "#",
    tmap: "#"
  },

  // 여기 수정: Google Form 참석 여부 링크
  googleFormLink: "#",

  // 여기 수정: 메인 사진 경로. 실제 사진을 images 폴더에 넣고 파일명을 바꿔 주세요.
  mainPhoto: "images/main-photo.svg",

  // 여기 수정: 갤러리 사진 경로. 사진을 추가하려면 아래 줄을 복사해 더 넣으면 됩니다.
  galleryImages: [
    "images/gallery-1.svg",
    "images/gallery-2.svg",
    "images/gallery-3.svg",
    "images/gallery-4.svg",
    "images/gallery-5.svg",
    "images/gallery-6.svg"
  ],

  // 여기 수정: 성장 이야기 내용을 바꿀 수 있습니다.
  timeline: [
    {
      date: "2025.06.20",
      title: "처음 만난 날",
      text: "작고 소중한 우리 아기가 가족에게 찾아온 날"
    },
    {
      date: "2025.09.28",
      title: "첫 웃음",
      text: "환하게 웃어주던 순간, 집 안이 사랑으로 가득 찼습니다."
    },
    {
      date: "2026.01.05",
      title: "100일의 축복",
      text: "하루하루 건강히 자라준 고마운 시간"
    },
    {
      date: "2026.06.20",
      title: "1ST BIRTHDAY",
      text: "사랑과 축복 속에서 맞이하는 첫 생일"
    }
  ]
};

const $ = (selector) => document.querySelector(selector);

function onlyNumber(phone) {
  return phone.replace(/\D/g, "");
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function setLink(selector, href) {
  const element = $(selector);
  if (element) element.href = href || "#";
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
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
    showToast(successMessage);
  }
}

function getDayDifference() {
  const today = new Date();
  const target = new Date(`${INVITATION.ddayDate}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function updateDday() {
  const ddayElement = $("#dday");
  const day = getDayDifference();

  if (day > 0) {
    ddayElement.textContent = `D-${day}`;
  } else if (day === 0) {
    ddayElement.textContent = "D-Day";
  } else {
    ddayElement.textContent = `D+${Math.abs(day)}`;
  }
}

function updateCountdown() {
  const target = new Date(INVITATION.ddayDateTime).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  setText("#countDays", String(days));
  setText("#countHours", String(hours).padStart(2, "0"));
  setText("#countMinutes", String(minutes).padStart(2, "0"));
  setText("#countSeconds", String(seconds).padStart(2, "0"));

  const day = getDayDifference();
  const message = day >= 0
    ? `${INVITATION.babyName}의 생일파티가 ${day}일 남았습니다.`
    : `${INVITATION.babyName}의 첫 생일을 함께 축하해 주셔서 감사합니다.`;
  setText("#countdownMessage", message);
}

function renderTimeline() {
  const timeline = $("#timeline");
  timeline.innerHTML = "";

  INVITATION.timeline.forEach((item) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <time>${item.date}</time>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    `;
    timeline.appendChild(article);
  });
}

function renderGallery() {
  const gallery = $("#gallery");
  gallery.innerHTML = "";

  INVITATION.galleryImages.forEach((src, index) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    image.src = src;
    image.alt = `${INVITATION.babyName} 갤러리 사진 ${index + 1}`;
    image.loading = "lazy";

    figure.appendChild(image);
    gallery.appendChild(figure);
  });
}

function renderCoverGallery() {
  const coverGallery = $("#coverGallery");
  coverGallery.innerHTML = "";

  INVITATION.galleryImages.slice(0, 3).forEach((src, index) => {
    const image = document.createElement("img");
    image.src = src;
    image.alt = `${INVITATION.babyName} 작은 사진 ${index + 1}`;
    image.loading = "lazy";
    coverGallery.appendChild(image);
  });
}

function fillInvitation() {
  document.title = `${INVITATION.babyName}의 첫 번째 생일에 초대합니다`;

  $("#mainPhoto").src = INVITATION.mainPhoto;
  $("#mainPhoto").alt = `${INVITATION.babyName} 메인 사진`;

  setText("#coverBabyName", INVITATION.babyName);
  setText("#familyBabyName", INVITATION.babyName);
  setText("#partyDateText", `${INVITATION.dateText} ${INVITATION.timeText}`);
  setText("#coverVenue", INVITATION.venueName);
  setText("#greetingMessage", INVITATION.greeting);
  setText("#dateInfo", `${INVITATION.dateText} ${INVITATION.timeText}`);
  setText("#scheduleDate", INVITATION.dateText);
  setText("#timeInfo", INVITATION.timeText);
  setText("#venueInfo", INVITATION.venueName);
  setText("#scheduleVenue", INVITATION.venueName);
  setText("#addressInfo", INVITATION.address);
  setText("#momAccount", INVITATION.momAccount);
  setText("#dadAccount", INVITATION.dadAccount);

  setLink("#naverMapLink", INVITATION.mapLinks.naver);
  setLink("#kakaoMapLink", INVITATION.mapLinks.kakao);
  setLink("#tmapLink", INVITATION.mapLinks.tmap);
  setLink("#rsvpLink", INVITATION.googleFormLink);
  setLink("#momCallLink", `tel:${onlyNumber(INVITATION.momPhone)}`);
  setLink("#dadCallLink", `tel:${onlyNumber(INVITATION.dadPhone)}`);
  setLink("#smsLink", `sms:${onlyNumber(INVITATION.momPhone)}`);

  renderTimeline();
  renderCoverGallery();
  renderGallery();
  updateDday();
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

function bindButtons() {
  $("#copyMomAccount").addEventListener("click", () => {
    copyText(INVITATION.momAccount, "복사되었습니다");
  });

  $("#copyDadAccount").addEventListener("click", () => {
    copyText(INVITATION.dadAccount, "복사되었습니다");
  });

  $("#copyPageLink").addEventListener("click", () => {
    copyText(window.location.href, "초대장 링크가 복사되었습니다");
  });
}

fillInvitation();
bindButtons();
