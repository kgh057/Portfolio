// history.scrollRestoration = 'manual';
/************************************* 타이핑 효과 *************************************/
// 순서대로 타이핑할 단어 목록
const words = ["기획", "디자인", "구현"];
let wordIndex = 0; // 현재 단어 인덱스
let charIndex = 0; // 현재 타이핑 중인 글자 인덱스
let isDeleting = false; // 지우는 중인지 여부
let cycleCount = 0; // 전체 반복 횟수
const maxCycles = 3; // 최대 반복 횟수 (3번 반복 후 멈춤)

// 타이핑 텍스트와 커서 요소 선택
const typingElement = document.querySelector(".typing-text");
const cursorElement = document.querySelector(".cursor-blink");

function type() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    // 지우는 중: 글자 한 자씩 줄임
    typingElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // 타이핑 중: 글자 한 자씩 늘림
    typingElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  // 지울 때는 빠르게(100ms), 타이핑할 때는 느리게(200ms)
  let typeSpeed = isDeleting ? 100 : 200;

  if (!isDeleting && charIndex === currentWord.length) {
    // 마지막 반복의 마지막 단어에서 멈춤
    if (cycleCount >= maxCycles - 1 && wordIndex === words.length - 1) {
      setTimeout(() => {
        // 커서 페이드아웃 애니메이션 실행
        cursorElement.style.animation = "fadeOutCursor 1s forwards";
      }, 2000);
      return;
    }
    typeSpeed = 2000; // 단어 완성 후 2초 대기
    isDeleting = true; // 지우기 시작
  } else if (isDeleting && charIndex === 0) {
    // 단어를 다 지웠을 때
    isDeleting = false;
    wordIndex++; // 다음 단어로 이동

    if (wordIndex >= words.length) {
      // 마지막 단어까지 끝나면 처음 단어로 돌아가고 반복 횟수 증가
      wordIndex = 0;
      cycleCount++;
    }

    typeSpeed = 500; // 다음 단어 타이핑 전 0.5초 대기
  }

  setTimeout(type, typeSpeed);
}

// 페이지 로드시 0.5초 후 타이핑 시작
setTimeout(type, 500);

/************************************* 위로 올라가기 버튼 *************************************/

// 버튼 요소와 인트로 섹션(main) 선택
const scrollTopButton = document.querySelector(".scroll-top");
const introSection = document.querySelector("main");

const observerOptions = {
  root: null, // 기준: 브라우저 전체 화면
  threshold: 0.8, // main 섹션이 80% 이상 보이면 인트로로 간주
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      // main 섹션이 화면에서 벗어나면 버튼 표시
      scrollTopButton.classList.add("visible");
    } else {
      // main 섹션이 화면에 있으면 버튼 숨김
      scrollTopButton.classList.remove("visible");
    }
  });
}, observerOptions);

// main 섹션 감지 시작
observer.observe(introSection);

// 버튼 클릭 시 페이지 최상단으로 부드럽게 스크롤
scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/************************************* 스크롤 reveal *************************************/
// reveal 클래스가 붙은 요소 전부 선택
const revealElements = document.querySelectorAll(".reveal");

// IntersectionObserver: 요소가 화면에 들어오는지 감지하는 API
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // 요소가 화면에 들어왔을 때
      if (entry.isIntersecting) {
        // visible 클래스 추가 → CSS에서 opacity: 1, translateY(0) 으로 변환
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15, // 요소가 화면에 15% 보일 때 감지 시작 (0~1 사이 값, 높을수록 더 많이 스크롤해야 등장)
  },
);

// 선택한 요소들 하나씩 observer에 등록
revealElements.forEach((el) => revealObserver.observe(el));

/************************************* 프로젝트 모달 *************************************/
// 모달 관련 요소 선택
const lightbox = document.getElementById("lightbox"); // 어두운 배경 전체
const lightboxImg = document.getElementById("lightboxImg"); // 모달 안 이미지
// const lightboxTitle = document.getElementById("lightboxTitle"); // 모달 안 제목
// const lightboxDesc = document.getElementById("lightboxDesc"); // 모달 안 설명
const lightboxClose = document.getElementById("lightboxClose"); // 닫기 버튼

// lightbox-trigger 클래스가 붙은 요소 전부 선택 
document.querySelectorAll(".lightbox-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    // 클릭한 요소의 data 속성값을 모달 안에 채워넣음
    lightboxImg.src = trigger.dataset.img;
    lightboxImg.alt = trigger.dataset.title;
    // lightboxTitle.textContent = trigger.dataset.title;
    // lightboxDesc.textContent = trigger.dataset.desc;
    // active 클래스 추가 → CSS에서 opacity: 1, visibility: visible 로 전환되며 모달 등장
    lightbox.classList.add("active");
    // 모달 열린 동안 뒤 페이지 스크롤 방지
    document.body.style.overflow = "hidden";
  });
});

// 닫기 버튼(✕) 클릭 시 모달 닫기
lightboxClose.addEventListener("click", closeLightbox);

// 어두운 배경 클릭 시 모달 닫기 (lightbox-box 바깥 영역 클릭 감지)
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ESC 키 입력 시 모달 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// 모달 닫기 함수
function closeLightbox() {
  // active 클래스 제거 → CSS에서 opacity: 0, visibility: hidden 으로 전환되며 모달 사라짐
  lightbox.classList.remove("active");
  // 스크롤 방지 해제
  document.body.style.overflow = "";
}
