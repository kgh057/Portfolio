// history.scrollRestoration = 'manual';
/************************************* 버블 캔버스 *************************************/
const bubbleCanvas = document.getElementById("bubble-canvas");
const bCtx = bubbleCanvas.getContext("2d");

// 캔버스 크기를 부모(main)에 맞게 설정
function resizeBubbleCanvas() {
  bubbleCanvas.width = bubbleCanvas.offsetWidth;
  bubbleCanvas.height = bubbleCanvas.offsetHeight;
}
resizeBubbleCanvas();
window.addEventListener("resize", resizeBubbleCanvas);

// ── 조절할 수 있는 값 ────────────────────────────────────────
const BUBBLE_OPACITY = 0.25;  // blur랑 같이 쓰면 높아도 괜찮음
const BUBBLE_BLUR    = 60;    // 흐림 정도 (px) — 높을수록 더 번짐
const BUBBLE_COUNT = 3; // 동시에 떠있는 버블 수
const BUBBLE_MIN_R = 400; // 버블 최소 크기
const BUBBLE_MAX_R = 600; // 버블 최대 크기
const BUBBLE_SPEED = 0.05; // 버블 이동 속도
// ─────────────────────────────────────────────────────────────

// 버블 하나 생성 (anim = 0이면 화면 내 랜덤 위치, 1이면 아래에서 올라옴)
function makeBubble(fromBottom = false) {
  const W = bubbleCanvas.width;
  const H = bubbleCanvas.height;

  const targetR = BUBBLE_MIN_R + Math.random() * (BUBBLE_MAX_R - BUBBLE_MIN_R);

  return {
    x: W * 0.05 + Math.random() * W * 0.9, // 화면 전체에서 완전 랜덤 x
    y: fromBottom ? H + targetR : Math.random() * H, // 아래에서 올라오거나 화면 내 랜덤
    r: fromBottom ? 0 : targetR, // 아래에서 올라올 땐 0에서 시작
    targetR,
    speedY: -(BUBBLE_SPEED * (0.5 + Math.random() * 0.5)),
    speedX: (Math.random() - 0.5) * 0.15,
    opacity: fromBottom ? 0 : Math.random() * 0.6, // 처음 배치된 버블은 이미 살짝 보이게
    fadeOut: false, // 페이드아웃 중인지 여부
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.004 + Math.random() * 0.005,
  };
}

// 처음엔 버블들을 화면 내 랜덤 위치에 배치
const bubbleList = Array.from({ length: BUBBLE_COUNT }, () =>
  makeBubble(false),
);

function drawBubbles() {
  const W = bubbleCanvas.width;
  const H = bubbleCanvas.height;

  bCtx.clearRect(0, 0, W, H);


  for (let i = 0; i < bubbleList.length; i++) {
    const b = bubbleList[i];

    // 크기: 목표 크기를 향해 서서히 커짐
    b.r += (b.targetR - b.r) * 0.012;

    // 위치 이동
    b.wobble += b.wobbleSpeed;
    b.x += b.speedX + Math.sin(b.wobble) * 0.25;
    b.y += b.speedY;

    // 화면 상단 근처(위에서 20% 지점)에 오면 페이드아웃 시작
    if (b.y < H * 0.2 && !b.fadeOut) {
      b.fadeOut = true;
    }

    if (b.fadeOut) {
      // 페이드아웃: 투명도 서서히 줄임
      b.opacity = Math.max(b.opacity - 0.004, 0);

      // 완전히 투명해지면 → 즉시 새 버블로 교체 (아래에서 올라오는 것으로)
      if (b.opacity <= 0) {
        bubbleList[i] = makeBubble(true);
      }
    } else {
      // 페이드인: 투명도 서서히 올림
      b.opacity = Math.min(b.opacity + 0.003, 1);
    }

    // radialGradient: 중심은 살짝 색이 있고 가장자리로 갈수록 투명
    const grad = bCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    grad.addColorStop(
      0,
      `rgba(99,102,241,${BUBBLE_OPACITY * 2.5 * b.opacity})`,
    );
    grad.addColorStop(
      0.45,
      `rgba(99,102,241,${BUBBLE_OPACITY * 1.2 * b.opacity})`,
    );
    grad.addColorStop(1, `rgba(99,102,241,0)`);

    bCtx.beginPath();
    bCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    bCtx.fillStyle = grad;
    bCtx.fill();
  }

  requestAnimationFrame(drawBubbles);
}

drawBubbles();
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
