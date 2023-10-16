import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("light-canvas");
const context = canvas.getContext("2d");

canvas.width = 5511;
canvas.height = 4063;

const frameCount = 4;
const currentFrame = index => `/content/dam/OneWeb/faw_vw/apps/q4_etron-headlight-test/${(index + 1)}.jpeg`;
// const currentFrame = index => `./img/${(index + 1)}.jpeg`;

const images = []
const headlight = {
  frame: 0
};

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

images[0].onload = render;

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[headlight.frame], 0, 0, canvas.width, canvas.height);
}

let tl = gsap.timeline({
  paused: true,
  scrub: true,
  // markers: true,
});

const descDom = document.querySelector('.q4_etron_headlight_description');
const descPos = (window.innerHeight - descDom.offsetHeight) / 2;
tl.to(
  '.q4_etron_headlight_description',
  {x: -100,y: descPos, scrub: 1, duration: 1, delay: .5}
);
tl.to(
  '.cover-bg',
  {scale: 1,scrub: 1, duration: 1},
  '<'
);

tl.to(headlight, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  duration: 1,
  onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
}, '>');

const scroll_wrap = document.querySelector('.q4_etron_headlight_cover_wrapper');
var io = new IntersectionObserver(
  entries => {
      console.log('IntersectionObserver', entries);
      entries.forEach((entry) => {
        if (entry.target === scroll_wrap) {
          if (entry.intersectionRatio < 0.1) {
            console.log('scroll_wrap hide');
            setTimeout(() => {
              tl.progress(0).pause();
            }, 100);
          } else if (entry.intersectionRatio > 0.9){
            console.log('scroll_wrap show');
            tl.restart();
          }
        }
      });
  }, {
    threshold: [0.1, 0.9]
  }
);
// 开始观测某个元素
io.observe(scroll_wrap);
