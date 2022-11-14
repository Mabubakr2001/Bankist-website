"use strict";

// Elements
const nav = document.querySelector(".nav");
const navlinksContainer = document.querySelector(".nav__links");
const modalWindow = document.querySelector(".modal");
const showModalWindowBtns = document.querySelectorAll(".btn--show-modal");
const closeModalWindowBtn = document.querySelector(".btn--close-modal");
const windowOverlay = document.querySelector(".overlay");
const header = document.querySelector(".header");
const sectionOne = document.querySelector("#section--1");
const scrollToSectionOneBtn = document.querySelector(".btn--scroll-to");
const allSections = document.querySelectorAll(".section");
const allLazyImgs = document.querySelectorAll("img[data-src]");
const tabsContainer = document.querySelector(".operations__tab-container");
const operationsTabs = document.querySelectorAll(".operations__tab");
const operationsContents = document.querySelectorAll(".operations__content");
const slides = document.querySelectorAll(".slide");
const rightBtn = document.querySelector(".slider__btn--right");
const leftBtn = document.querySelector(".slider__btn--left");
const dotsContainer = document.querySelector(".dots");

const changeLinksOpacity = function (event) {
  if (event.target.classList.contains("nav__link")) {
    const hoveredLinkSiblings = event.target
      .closest(".nav__links")
      .querySelectorAll(".nav__link");
    hoveredLinkSiblings.forEach(sibling => {
      if (sibling !== event.target) {
        sibling.style.opacity = this;
        document.querySelector(".nav__logo").style.opacity = this;
      }
    });
  }
};

nav.addEventListener("mouseover", changeLinksOpacity.bind(0.4));
nav.addEventListener("mouseout", changeLinksOpacity.bind(1));

navlinksContainer.addEventListener("click", function (event) {
  event.preventDefault();
  if (event.target.classList.contains("nav__link")) {
    const targetSectionId = event.target.getAttribute("href");
    if (targetSectionId !== "#") {
      const targetSectionCoordinates = document
        .querySelector(targetSectionId)
        .getBoundingClientRect();
      window.scrollTo({
        top: targetSectionCoordinates.top + window.pageYOffset,
        behavior: "smooth",
      });
    }
  }
});

const showModalWindow = function (event) {
  event.preventDefault();
  modalWindow.classList.remove("hidden");
  windowOverlay.classList.remove("hidden");
};

const closeModalWindow = function () {
  modalWindow.classList.add("hidden");
  windowOverlay.classList.add("hidden");
};

showModalWindowBtns.forEach(showBtn =>
  showBtn.addEventListener("click", showModalWindow)
);
closeModalWindowBtn.addEventListener("click", closeModalWindow);
windowOverlay.addEventListener("click", closeModalWindow);
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !modalWindow.classList.contains("hidden"))
    closeModalWindow();
});

const makeNavSticky = function (entries) {
  const entry = entries.at(0);
  !entry.isIntersecting
    ? nav.classList.add("sticky")
    : nav.classList.remove("sticky");
};

const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(makeNavSticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

scrollToSectionOneBtn.addEventListener("click", function () {
  sectionOne.scrollIntoView({ behavior: "smooth" });
});

const revealSection = function (entries, observer) {
  const entry = entries.at(0);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

const showImg = function (entries, observer) {
  const entry = entries.at(0);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(showImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

allLazyImgs.forEach(lazyImg => imgObserver.observe(lazyImg));

tabsContainer.addEventListener("click", function (event) {
  const clickedTab = event.target.closest(".operations__tab");

  if (!clickedTab) return;

  operationsTabs.forEach(operationTab =>
    operationTab.classList.remove("operations__tab--active")
  );
  clickedTab.classList.add("operations__tab--active");

  operationsContents.forEach(operationContent =>
    operationContent.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
    .classList.add("operations__content--active");
});

const createDots = function () {
  slides.forEach(function (_, currentIndex) {
    dotsContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${currentIndex}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach(dot => dot.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

const goToSlide = function (slide) {
  slides.forEach(
    (currentSlide, currentIndex) =>
      (currentSlide.style.transform = `translateX(${
        (currentIndex - slide) * 100
      }%)`)
  );
};

const init = function () {
  createDots();
  activateDot(0);
  goToSlide(0);
};

init();

let slide = 0;
const slidesNum = slides.length;

const nextSlide = function () {
  slide === slidesNum - 1 ? (slide = 0) : slide++;
  goToSlide(slide);
  activateDot(slide);
};

const previousSlide = function () {
  slide === 0 ? (slide = slidesNum - 1) : slide--;
  goToSlide(slide);
  activateDot(slide);
};

rightBtn.addEventListener("click", nextSlide);
leftBtn.addEventListener("click", previousSlide);

document.addEventListener("keydown", function (event) {
  event.key === "ArrowRight" && nextSlide();
  event.key === "ArrowLeft" && previousSlide();
});

dotsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("dots__dot")) {
    const { slide } = event.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
