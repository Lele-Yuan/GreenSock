import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const q4EtronLight_mobile = document.documentElement.offsetWidth < 428
const q4EtronLightCanvas = document.getElementById("q4-etron-light-canvas");
const q4EtronLightContext = q4EtronLightCanvas.getContext("2d");

q4EtronLightCanvas.width = 5511;
q4EtronLightCanvas.height = 4063;

const q4EtronLightCount = 4;
const q4EtronLightCurrentFrame = index => `/content/dam/OneWeb/faw_vw/apps/q4_etron-headlight-test/${(index + 1)}.jpeg`;
// const q4EtronLightCurrentFrame = index => `/src/heatlight/img/${(index + 1)}.jpeg`;

const q4EtronLightImages = []
const q4EtronLightFrame = {
  frame: 0
};

for (let i = 0; i < q4EtronLightCount; i++) {
  const img = new Image();
  img.src = q4EtronLightCurrentFrame(i);
  q4EtronLightImages.push(img);
}

q4EtronLightImages[0].onload = render;

function render() {
  q4EtronLightContext.clearRect(0, 0, q4EtronLightCanvas.width, q4EtronLightCanvas.height);
  q4EtronLightContext.drawImage(q4EtronLightImages[q4EtronLightFrame.frame], 0, 0, q4EtronLightCanvas.width, q4EtronLightCanvas.height);
}

let q4EtronLightTl = gsap.timeline({
  paused: true,
  scrub: true,
  scrollTrigger: {
    trigger: '.q4_etron_headlight_scroll_wraper',
    start: "top top",
    end: 'bottom bottom',
    scrub: true,
    // markers: true,
    pin: '.q4_etron_headlight_cover_wrapper',
    anticipatePin: 1,
  },
});

const descDom = document.querySelector('.q4_etron_headlight_description');
const descPos = (window.innerHeight - descDom.offsetHeight) / 2;
q4EtronLightTl.to(
  '.q4_etron_headlight_description',
  {x: q4EtronLight_mobile ? 0 : -100,y: descPos, scrub: 1, duration: 1, delay: .5}
);
q4EtronLightTl.to(
  '#q4-etron-light-canvas',
  {scale: 1,scrub: 1, duration: 1},
  '<'
);

q4EtronLightTl.to(q4EtronLightFrame, {
  frame: q4EtronLightCount - 1,
  snap: "frame",
  ease: "none",
  duration: 1,
  onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
}, '>');

