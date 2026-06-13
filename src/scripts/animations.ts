import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  gsap.defaults({ ease: "power3.out", duration: 0.85 });

  const transition = document.querySelector(".page-transition");
  const header = document.querySelector("[data-header]");

  // The first timeline owns the page entrance so individual reveal animations do not compete on load.
  const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
  heroTimeline
    .to(transition, { autoAlpha: 0, duration: 0.7 })
    .from(header, { y: -22, autoAlpha: 0, duration: 0.7 }, "-=0.35")
    .from(".hero-visual", { scale: 1.08, filter: "blur(10px)", duration: 1.45 }, "-=0.72")
    .from(".hero-kicker", { y: 24, autoAlpha: 0, duration: 0.7 }, "-=1.05")
    .from(".hero-title-line > span", { yPercent: 105, rotateX: -26, stagger: 0.09, duration: 1.08 }, "-=0.78")
    .from(".hero-copy", { y: 28, autoAlpha: 0, duration: 0.75 }, "-=0.58")
    .from(".hero-actions > *", { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.62 }, "-=0.42")
    .from(".hero-metrics > *", { y: 22, autoAlpha: 0, stagger: 0.07, duration: 0.62 }, "-=0.38")
    .from(".hero-scroll", { y: 18, autoAlpha: 0, duration: 0.6 }, "-=0.35");

  gsap.to(".hero-visual", {
    yPercent: 8,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  gsap.utils.toArray<HTMLElement>("[data-section]").forEach((section) => {
    const items = section.querySelectorAll<HTMLElement>("[data-animate]");
    if (!items.length) return;

    gsap.from(items, {
      y: 34,
      autoAlpha: 0,
      stagger: 0.09,
      duration: 0.78,
      scrollTrigger: {
        trigger: section,
        start: "top 72%"
      }
    });
  });

  ScrollTrigger.batch(".skill-card", {
    start: "top 82%",
    once: true,
    onEnter: (batch) => {
      gsap.from(batch, {
        y: 38,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 0.72
      });
    }
  });

  ScrollTrigger.batch(".language-card", {
    start: "top 84%",
    once: true,
    onEnter: (batch) => {
      gsap.from(batch, {
        y: 28,
        scale: 0.94,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.68
      });
    }
  });

  ScrollTrigger.batch(".direct-channel-item, .social-pill", {
    start: "top 86%",
    once: true,
    onEnter: (batch) => {
      gsap.from(batch, {
        y: 18,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.58
      });
    }
  });

  gsap.from(".timeline-line", {
    scaleY: 0,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#experience",
      start: "top 68%",
      end: "bottom 65%",
      scrub: 0.6
    }
  });

  gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
    gsap.from(item, {
      x: 34,
      autoAlpha: 0,
      duration: 0.72,
      scrollTrigger: {
        trigger: item,
        start: "top 78%"
      }
    });
  });

  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (isFinePointer) {
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");

    if (dot && ring) {
      document.body.classList.add("cursor-ready");
      const moveDot = gsap.quickTo(dot, "x", { duration: 0.18, ease: "power2.out" });
      const moveDotY = gsap.quickTo(dot, "y", { duration: 0.18, ease: "power2.out" });
      const moveRing = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
      const moveRingY = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });

      window.addEventListener("mousemove", (event) => {
        moveDot(event.clientX - 3);
        moveDotY(event.clientY - 3);
        moveRing(event.clientX - 21);
        moveRingY(event.clientY - 21);
      });

      document.querySelectorAll("a, button, .magnetic").forEach((target) => {
        target.addEventListener("mouseenter", () => gsap.to(ring, { scale: 1.55, borderColor: "rgba(217,170,89,0.78)", duration: 0.25 }));
        target.addEventListener("mouseleave", () => gsap.to(ring, { scale: 1, borderColor: "rgba(50,245,200,0.48)", duration: 0.25 }));
      });
    }

    document.querySelectorAll<HTMLElement>(".magnetic").forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        gsap.to(element, { x: x * 0.16, y: y * 0.16, duration: 0.32 });
      });
      element.addEventListener("mouseleave", () => gsap.to(element, { x: 0, y: 0, duration: 0.45 }));
    });

    document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
      const image = card.querySelector(".project-image");
      const icon = card.querySelector(".project-icon");

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: x * 5, rotateX: -y * 5, y: -8, duration: 0.35 });
        gsap.to(image, { scale: 1.08, duration: 0.6 });
        gsap.to(icon, { rotate: 18, scale: 1.08, duration: 0.35 });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.55 });
        gsap.to(image, { scale: 1, duration: 0.7 });
        gsap.to(icon, { rotate: 0, scale: 1, duration: 0.4 });
      });
    });

    document.querySelectorAll<HTMLElement>(".profile-booking-card").forEach((card) => {
      const image = card.querySelector(".profile-avatar-image");

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: x * 4, rotateX: -y * 4, y: -6, duration: 0.35 });
        gsap.to(image, { x: x * 10, y: y * 8, scale: 1.035, duration: 0.45 });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.55 });
        gsap.to(image, { x: 0, y: 0, scale: 1, duration: 0.55 });
      });
    });
  }

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href") ?? "");
      if (!target) return;
      event.preventDefault();
      gsap.to(window, {
        duration: 0.85,
        scrollTo: { y: target, offsetY: 88 }
      });
    });
  });
} else {
  gsap.set(".page-transition", { autoAlpha: 0 });
}
