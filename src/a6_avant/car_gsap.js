import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const a6Avant_mobile = document.documentElement.offsetWidth < 428
const a6AvantCarCanvas = document.getElementById("a6-avant-car-canvas");
const a6AvantCarContext = a6AvantCarCanvas.getContext("2d");

const a6AvantWidthHeight = {
  pc: {width: 5511, height: 4063},
  mobile: {width: 1080, height: 1920}
}

const a6AvantCarCount = 45;
const a6AvantFolderName = a6Avant_mobile ? 'mobile' : 'pc'
const a6AvantCarCurrentFrame = index => `/content/dam/OneWeb/faw_vw/apps/a6_avant-car-test/img/${a6AvantFolderName}/${(index + 1)}.jpg`;
// const a6AvantCarCurrentFrame = index => `/src/a6_avant/img/${a6AvantFolderName}/${(index + 1)}.jpg`;

a6AvantCarCanvas.width = a6AvantWidthHeight[a6AvantFolderName].width;
a6AvantCarCanvas.height = a6AvantWidthHeight[a6AvantFolderName].height;

const a6AvantCarImages = []
const a6AvantCarFrame = {
  frame: 0
};

for (let i = 0; i < a6AvantCarCount; i++) {
  const img = new Image();
  img.src = a6AvantCarCurrentFrame(i);
  a6AvantCarImages.push(img);
}

a6AvantCarImages[0].onload = render;

function render() {
  a6AvantCarContext.clearRect(0, 0, a6AvantCarCanvas.width, a6AvantCarCanvas.height);
  a6AvantCarContext.drawImage(a6AvantCarImages[a6AvantCarFrame.frame], 0, 0, a6AvantCarCanvas.width, a6AvantCarCanvas.height);
}

let a6AvantCarTl = gsap.timeline({
  paused: true,
  scrub: true,
  scrollTrigger: {
    trigger: '.a6_avant_car_scroll_wraper',
    start: "top top",
    end: 'bottom bottom',
    scrub: true,
    // markers: true,
    pin: '.a6_avant_car_cover_wrapper',
    anticipatePin: 1,
  },
});
a6AvantCarTl.to(a6AvantCarFrame, {
  frame: a6AvantCarCount - 1,
  snap: "frame",
  ease: "none",
  duration: 1,
  onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
});

