import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const label = document.getElementById('desc-label');
const title = document.getElementById('desc-title');
const paragraph = document.getElementById('desc-paragraph');
const cta = document.getElementById('desc-cta');

const splitParagraph = new SplitText(paragraph, { type: 'lines' });
const lines = splitParagraph.lines;

const allElements = [label, title, ...lines, cta];
gsap.set(allElements, { opacity: 0, y: 30 });

ScrollTrigger.create({
  trigger: '#descripcion',
  start: 'top 75%',
  onEnter: () => {
    gsap.to(allElements, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.1,
    });
  },
  onLeaveBack: () => {
    gsap.set(allElements, { opacity: 0, y: 30 });
  },
});
