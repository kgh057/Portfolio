// history.scrollRestoration = 'manual';
/************************************* 타이핑 효과 *************************************/
const words = ["기획", "디자인", "구현"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let cycleCount = 0;
const maxCycles = 3;

const typingElement = document.querySelector(".typing-text");
const cursorElement = document.querySelector(".cursor-blink");

function type() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 100 : 200;

  if (!isDeleting && charIndex === currentWord.length) {
    // 마지막 반복의 마지막 단어에서 멈춤
    if (cycleCount >= maxCycles - 1 && wordIndex === words.length - 1) {
      setTimeout(() => {
        cursorElement.style.animation = "fadeOutCursor 1s forwards";
      }, 2000);
      return;
    }
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex++;

    if (wordIndex >= words.length) {
      wordIndex = 0;
      cycleCount++;
    }

    typeSpeed = 500;
  }

  setTimeout(type, typeSpeed);
}

// 페이지 로드시 타이핑 시작
setTimeout(type, 500);

/************************************* 위로 올라가기 버튼 *************************************/
const scrollTopButton = document.querySelector(".scroll-top");
const introSection = document.querySelector("main");

const observerOptions = {
  root: null,
  threshold: 0.8,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      scrollTopButton.classList.add("visible");
    } else {
      scrollTopButton.classList.remove("visible");
    }
  });
}, observerOptions);

observer.observe(introSection);

// 클릭 이벤트
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
