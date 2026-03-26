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
