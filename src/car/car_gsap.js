import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const q4EtronCarCanvas = document.getElementById("q4-etron-car-canvas");
const q4EtronCarContext = q4EtronCarCanvas.getContext("2d");

q4EtronCarCanvas.width = 1500;
q4EtronCarCanvas.height = 844;

const q4EtronCarCount = 35;
const q4EtronCarCurrentFrame = index => `/content/dam/OneWeb/faw_vw/apps/q4_etron-car-test/img/image${(index + 1)}.png`;
// const q4EtronCarCurrentFrame = index => `/src/car/img/image${(index + 1)}.png`;

const q4EtronCarImages = []
const q4EtronCarFrame = {
  frame: 0
};

for (let i = 0; i < q4EtronCarCount; i++) {
  const img = new Image();
  img.src = q4EtronCarCurrentFrame(i);
  q4EtronCarImages.push(img);
}

q4EtronCarImages[0].onload = render;

function render() {
  q4EtronCarContext.clearRect(0, 0, q4EtronCarCanvas.width, q4EtronCarCanvas.height);
  q4EtronCarContext.drawImage(q4EtronCarImages[q4EtronCarFrame.frame], 0, 0, q4EtronCarCanvas.width, q4EtronCarCanvas.height);
}

let q4EtronCarTl = gsap.timeline({
  paused: true,
  scrub: true,
  scrollTrigger: {
    trigger: '.q4_etron_car_scroll_wraper',
    start: "top top",
    end: 'bottom bottom',
    scrub: true,
    // markers: true,
    pin: '.q4_etron_car_cover_wrapper',
    anticipatePin: 1,
  },
});
q4EtronCarTl.to(q4EtronCarFrame, {
  frame: q4EtronCarCount - 1,
  snap: "frame",
  ease: "none",
  duration: 1,
  onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
});

