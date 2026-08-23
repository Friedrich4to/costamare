import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const paragraph = document.getElementById('desc-paragraph');
const divider = document.getElementById('desc-divider');
const listItems = Array.from(document.querySelectorAll('#desc-list li'));
const cta = document.getElementById('desc-cta');

const split = new SplitText(paragraph, { type: 'lines', linesClass: 'desc-line' });
const lines = split.lines;

const allElements = [...lines, divider, ...listItems, cta];
gsap.set(allElements, { opacity: 0, y: 30 });

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
    const afterLines = lines.length * 0.1 + 0.15;
    gsap.to(divider, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      delay: afterLines,
    });
    gsap.to(listItems, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      delay: afterLines + 0.15,
    });
    gsap.to(cta, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      delay: afterLines + listItems.length * 0.08 + 0.25,
    });
  },
  onLeaveBack: () => {
    gsap.set(allElements, { opacity: 0, y: 30 });
  },
});
