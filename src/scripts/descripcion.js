import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const paragraph = document.getElementById('desc-paragraph');
const cta = document.getElementById('desc-cta');

const split = new SplitText(paragraph, { type: 'lines', linesClass: 'desc-line' });
const lines = split.lines;

gsap.set([...lines, cta], { opacity: 0, y: 30 });

ScrollTrigger.create({
  trigger: '#descripcion',
  start: 'top 75%',
  onEnter: () => {
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.1,
    });
    gsap.to(cta, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      delay: lines.length * 0.1 + 0.15,
    });
  },
  onLeaveBack: () => {
    gsap.set([...lines, cta], { opacity: 0, y: 30 });
  },
});
