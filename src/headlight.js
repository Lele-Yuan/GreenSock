import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);



const canvas = document.getElementById("light-canvas");
const context = canvas.getContext("2d");

canvas.width = 5511;
canvas.height = 4063;

const frameCount = 4;
const currentFrame = index => `./img/${(index + 1)}.jpeg`;

const images = []
const airpods = {
  frame: 0
};

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

images[0].onload = render;

function render() {
  console.log('airpods.frame', airpods.frame, images[airpods.frame].width);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[airpods.frame], 0, 0, canvas.width, canvas.height);
}

gsap.set("body", { 'overflowY': 'auto'});
let tl = gsap.timeline({
  scrollTrigger: {
      trigger: '.cover-scroll',
      start: "top top",
      end: () => innerHeight - 1,
      scrub: true,
      markers: true,
      pin: '.cover-wrapper',
      anticipatePin: 1,
      onToggle: () => {
        gsap.set(".cover-wrapper", { y: 0});
      }
  }
});

const descDom = document.querySelector('.description');
tl.to(descDom,{y: (window.innerHeight - descDom.offsetHeight) / 2,scrub: 1});
tl.to('.cover-bg',{scale: 1,scrub: 1}, '<')

tl.to(airpods, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  onUpdate: render // use animation onUpdate instead of scrollTrigger's onUpdate
}, '>');