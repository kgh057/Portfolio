/************************************* 카테고리 필터 *************************************/
// 필터 버튼과 프로젝트 카드 전부 선택
const filterButtons = document.querySelectorAll(".filter-btn");
const workItems = document.querySelectorAll(".work-item");
const noResult = document.querySelector(".no-result");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // 클릭한 버튼만 active, 나머지는 해제
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter; // "all" | "web" | "graphic"
    let visibleCount = 0;

    workItems.forEach((item) => {
      const category = item.dataset.category;
      const isMatch = filter === "all" || category === filter;

      item.classList.toggle("hidden", !isMatch);
      if (isMatch) visibleCount++;
    });

    // 필터 결과가 하나도 없을 때 안내 문구 표시
    noResult.classList.toggle("show", visibleCount === 0);
  });
});

/************************************* 프로젝트 모달 *************************************/
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".lightbox-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    lightboxImg.src = trigger.dataset.img;
    lightboxImg.alt = trigger.dataset.title || "";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

/************************************* 위로 올라가기 버튼 *************************************/
// 이 페이지는 인트로 섹션이 없으므로, 일정 스크롤 이후 버튼 노출
const scrollTopButton = document.querySelector(".scroll-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopButton.classList.add("visible");
  } else {
    scrollTopButton.classList.remove("visible");
  }
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
