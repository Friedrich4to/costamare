import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const logo = document.getElementById('hero-logo');
const heroImg = document.getElementById('hero-img');

// Logo slides down and fades as scroll progresses, disappearing under the image (z-20)
gsap.to(logo, {
  yPercent: 35,
  opacity: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: '65% top',
    scrub: 1,
  },
});

// Image parallax: drifts upward slightly as you scroll
gsap.to(heroImg, {
  yPercent: -12,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
});
