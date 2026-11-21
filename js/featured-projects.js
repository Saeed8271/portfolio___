
/* =========================================
   FEATURED PROJECTS
   Slideshow + Two-Card Carousel
   + Multiple Case Study Modals
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     GLOBAL SETTINGS
  ===================================== */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const SLIDESHOW_INTERVAL = 3500;

  const formatNumber = (number) =>
    String(number).padStart(2, "0");


  /* =====================================
     1. AUTOMATIC SCREENSHOT SLIDESHOW
  ===================================== */

  const slideshows = document.querySelectorAll(
    "[data-slideshow]"
  );

  slideshows.forEach((slideshow) => {

    const slides = Array.from(
      slideshow.querySelectorAll(".fp-slide")
    );

    if (slides.length < 2) return;

    const preview = slideshow.closest(
      ".fp-card__preview"
    );

    let currentIndex = Math.max(
      0,
      slides.findIndex((slide) =>
        slide.classList.contains("is-active")
      )
    );

    let timer = null;
    let isHovered = false;
    let isFocused = false;

    const showSlide = (index) => {

      slides[currentIndex].classList.remove(
        "is-active"
      );

      currentIndex =
        (index + slides.length) % slides.length;

      slides[currentIndex].classList.add(
        "is-active"
      );

    };

    const stopSlideshow = () => {

      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }

    };

    const startSlideshow = () => {

      if (
        timer !== null ||
        reducedMotion.matches ||
        document.hidden ||
        isHovered ||
        isFocused
      ) {
        return;
      }

      timer = window.setInterval(() => {
        showSlide(currentIndex + 1);
      }, SLIDESHOW_INTERVAL);

    };

    if (preview) {

      preview.addEventListener(
        "mouseenter",
        () => {
          isHovered = true;
          stopSlideshow();
        }
      );

      preview.addEventListener(
        "mouseleave",
        () => {
          isHovered = false;
          startSlideshow();
        }
      );

      preview.addEventListener(
        "focusin",
        () => {
          isFocused = true;
          stopSlideshow();
        }
      );

      preview.addEventListener(
        "focusout",
        () => {
          isFocused = preview.contains(
            document.activeElement
          );

          if (!isFocused) {
            startSlideshow();
          }
        }
      );

    }

    document.addEventListener(
      "visibilitychange",
      () => {

        if (document.hidden) {
          stopSlideshow();
        } else {
          startSlideshow();
        }

      }
    );

    reducedMotion.addEventListener(
      "change",
      () => {

        if (reducedMotion.matches) {
          stopSlideshow();
        } else {
          startSlideshow();
        }

      }
    );

    slides.forEach((slide, index) => {

      slide.classList.toggle(
        "is-active",
        index === currentIndex
      );

    });

    startSlideshow();

  });


  /* =====================================
     2. HORIZONTAL PROJECT CAROUSEL
  ===================================== */

  const carousel = document.getElementById(
    "fp-carousel"
  );

  const prevButton = document.getElementById(
    "fp-prev"
  );

  const nextButton = document.getElementById(
    "fp-next"
  );

  const currentLabel = document.getElementById(
    "fp-current"
  );

  const totalLabel = document.getElementById(
    "fp-total"
  );

  if (
    carousel &&
    prevButton &&
    nextButton
  ) {

    const projects = Array.from(
      carousel.querySelectorAll(".fp-project")
    );

    /*
      Desktop: 2 projects visible.
      Mobile: 1 project visible.

      With only 2 projects, desktop arrows
      remain disabled because both cards
      are already visible.
    */

    const getVisibleCount = () => {

      if (!projects.length) return 0;

      return Math.min(
        window.innerWidth <= 700 ? 1 : 2,
        projects.length
      );

    };

    const getMaxStartIndex = () => {

      return Math.max(
        0,
        projects.length - getVisibleCount()
      );

    };

    /*
      Calculate the current project using
      the carousel's actual scroll position.
    */

    const getCurrentIndex = () => {

      if (!projects.length) return 0;

      const firstLeft = projects[0].offsetLeft;

      let closestIndex = 0;
      let closestDistance = Infinity;

      projects.forEach((project, index) => {

        const targetLeft =
          project.offsetLeft - firstLeft;

        const distance = Math.abs(
          targetLeft - carousel.scrollLeft
        );

        if (distance < closestDistance) {

          closestDistance = distance;
          closestIndex = index;

        }

      });

      return Math.min(
        closestIndex,
        getMaxStartIndex()
      );

    };

    /*
      Update arrow availability and
      the project counter.
    */

    const updateNavigation = () => {

      const currentIndex = getCurrentIndex();
      const maxStartIndex = getMaxStartIndex();

      if (currentLabel) {

        currentLabel.textContent = formatNumber(
          projects.length ? currentIndex + 1 : 0
        );

      }

      if (totalLabel) {

        totalLabel.textContent = formatNumber(
          projects.length
        );

      }

      prevButton.disabled =
        !projects.length || currentIndex <= 0;

      nextButton.disabled =
        !projects.length ||
        currentIndex >= maxStartIndex;

    };

    /*
      Scroll to the requested project.
      The browser handles smooth scrolling.
    */

    const scrollToProject = (index) => {

      if (!projects.length) return;

      const targetIndex = Math.max(
        0,
        Math.min(index, getMaxStartIndex())
      );

      const targetLeft =
        projects[targetIndex].offsetLeft -
        projects[0].offsetLeft;

      carousel.scrollTo({

        left: targetLeft,

        behavior: reducedMotion.matches
          ? "auto"
          : "smooth"

      });

    };

    /*
      Previous project
    */

    prevButton.addEventListener("click", () => {

      scrollToProject(
        getCurrentIndex() - 1
      );

    });

    /*
      Next project
    */

    nextButton.addEventListener("click", () => {

      scrollToProject(
        getCurrentIndex() + 1
      );

    });

    /*
      Update the counter while swiping
      or manually scrolling.
    */

    carousel.addEventListener(
      "scroll",
      updateNavigation,
      { passive: true }
    );

    /*
      Recalculate layout when the
      viewport size changes.
    */

    let previousVisibleCount = getVisibleCount();

    window.addEventListener("resize", () => {

      const newVisibleCount = getVisibleCount();

      if (newVisibleCount !== previousVisibleCount) {

        previousVisibleCount = newVisibleCount;

        scrollToProject(
          Math.min(
            getCurrentIndex(),
            getMaxStartIndex()
          )
        );

      }

      updateNavigation();

    });

    /*
      Keyboard navigation when the
      carousel itself has focus.
    */

    carousel.addEventListener(
      "keydown",
      (event) => {

        if (event.target !== carousel) return;

        const currentIndex = getCurrentIndex();

        if (event.key === "ArrowRight") {

          event.preventDefault();

          scrollToProject(currentIndex + 1);

        }

        if (event.key === "ArrowLeft") {

          event.preventDefault();

          scrollToProject(currentIndex - 1);

        }

      }
    );

    /*
      Initialize carousel navigation.
    */

    updateNavigation();

  }


  /* =====================================
     3. CASE STUDY PROJECT DATA
  ===================================== */

  const caseStudies = {

    dental: {

      modalId: "fp-dental-modal",

      imageId: "fp-modal-image",

      countId: "fp-image-count",

      prevId: "fp-image-prev",

      nextId: "fp-image-next",

      screenshots: [

        {
          src: "images/projects/si_dental_clinic/homepage.webp",
          alt: "S & I Dental Clinic homepage"
        },

        {
          src: "images/projects/si_dental_clinic/services.webp",
          alt: "S & I Dental Clinic services page"
        },

        {
          src: "images/projects/si_dental_clinic/results.webp",
          alt: "S & I Dental Clinic treatment results page"
        }

      ]

    },

    enterprises: {

      modalId: "fp-enterprises-modal",

      imageId: "fp-enterprises-image",

      countId: "fp-enterprises-count",

      prevId: "fp-enterprises-prev",

      nextId: "fp-enterprises-next",

      screenshots: [

        {
          src: "images/projects/ss_enterprises/home.webp",
          alt: "S S Enterprises homepage"
        },

        {
          src: "images/projects/ss_enterprises/login.webp",
          alt: "S S Enterprises login interface"
        },

        {
          src: "images/projects/ss_enterprises/services.webp",
          alt: "S S Enterprises services page"
        }

      ]

    },


classroom: {

  modalId: "fp-classroom-modal",

  imageId: "fp-classroom-image",

  countId: "fp-classroom-count",

  prevId: "fp-classroom-prev",

  nextId: "fp-classroom-next",

  screenshots: [

    {
      src: "images/projects/smart_classroom/homepage.webp",
      alt: "Smart Classroom homepage"
    },

    {
      src: "images/projects/smart_classroom/timetable.webp",
      alt: "Smart Classroom timetable interface"
    },

    {
      src: "images/projects/smart_classroom/classroom.webp",
      alt: "Smart Classroom classroom management interface"
    }

  ]

}


  };


  /* =====================================
     4. INITIALIZE CASE STUDY MODALS
  ===================================== */

  Object.entries(caseStudies).forEach(
    ([projectKey, projectData]) => {

      const modal = document.getElementById(
        projectData.modalId
      );

      const modalImage = document.getElementById(
        projectData.imageId
      );

      const imageCount = document.getElementById(
        projectData.countId
      );

      const imagePrev = document.getElementById(
        projectData.prevId
      );

      const imageNext = document.getElementById(
        projectData.nextId
      );

      if (
        !modal ||
        !modalImage ||
        !imageCount ||
        !imagePrev ||
        !imageNext
      ) {

        console.warn(
          `Featured Projects: Missing modal elements for ${projectKey}`
        );

        return;

      }

      const screenshots = projectData.screenshots;

      let currentImageIndex = 0;
      let lastFocusedElement = null;

      /*
        Update screenshot and image counter.
      */

      const updateModalImage = () => {

        if (!screenshots.length) return;

        const screenshot =
          screenshots[currentImageIndex];

        modalImage.src = screenshot.src;
        modalImage.alt = screenshot.alt;

        imageCount.textContent =
          `${formatNumber(currentImageIndex + 1)} / ` +
          `${formatNumber(screenshots.length)}`;

      };

      /*
        Move through modal screenshots.
        Gallery navigation wraps around.
      */

      const changeModalImage = (direction) => {

        if (!screenshots.length) return;

        currentImageIndex =
          (
            currentImageIndex +
            direction +
            screenshots.length
          ) % screenshots.length;

        updateModalImage();

      };

      imagePrev.addEventListener("click", () => {
        changeModalImage(-1);
      });

      imageNext.addEventListener("click", () => {
        changeModalImage(1);
      });

      /*
        Open the correct case-study popup.
      */

      const openButtons = document.querySelectorAll(
        `[data-open-case-study="${projectKey}"]`
      );

      openButtons.forEach((button) => {

        button.addEventListener("click", () => {

          lastFocusedElement = document.activeElement;

          currentImageIndex = 0;

          updateModalImage();

          if (!modal.open) {
            modal.showModal();
          }

        });

      });

      /*
        Close buttons inside the modal.
      */

      const closeButtons = modal.querySelectorAll(
        "[data-close-case-study]"
      );

      closeButtons.forEach((button) => {

        button.addEventListener("click", () => {
          modal.close();
        });

      });

      /*
        Close when clicking outside the dialog.
      */

      modal.addEventListener("click", (event) => {

        const rect = modal.getBoundingClientRect();

        const clickedOutside =
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom;

        if (clickedOutside) {
          modal.close();
        }

      });

      /*
        Keyboard navigation inside the modal.
      */

      modal.addEventListener("keydown", (event) => {

        if (
          event.target.closest(
            "input, textarea, select"
          )
        ) {
          return;
        }

        if (event.key === "ArrowLeft") {

          event.preventDefault();

          changeModalImage(-1);

        }

        if (event.key === "ArrowRight") {

          event.preventDefault();

          changeModalImage(1);

        }

        /*
          Escape is handled automatically
          by the native dialog element.
        */

      });

      /*
        Restore keyboard focus after closing.
      */

      modal.addEventListener("close", () => {

        if (
          lastFocusedElement &&
          typeof lastFocusedElement.focus === "function" &&
          lastFocusedElement.isConnected
        ) {

          lastFocusedElement.focus({
            preventScroll: true
          });

        }

      });

      /*
        Initialize screenshot and counter.
      */

      updateModalImage();

    }
  );

});
