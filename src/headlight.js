import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import fullpage from "fullpage.js";
gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("light-canvas");
const context = canvas.getContext("2d");

canvas.width = 5511;
canvas.height = 4063;

const frameCount = 4;
// const currentFrame = index => `/content/dam/OneWeb/faw_vw/apps/q4_etron-headlight-test/${(index + 1)}.jpeg`;
const currentFrame = index => `./img/${(index + 1)}.jpeg`;

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
  console.log('headlight.frame', headlight.frame, images[headlight.frame].width);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[headlight.frame], 0, 0, canvas.width, canvas.height);
}
let activeSection = null;
let classList = '';
let fullpageOption = null, containerDom = null, fullpageDom = null, activeIndex = -1;

const playAnimation = () => {
  // gsap.set("body", { overflow: 'hidden'});
  let tl = gsap.timeline({
    // paused: true,
    scrollTrigger: {
      scroller: '.q4_etron_headlight_fullpage',
        trigger: '.q4_etron_headlight_scroll_wraper',
        start: "top top",
        // end: () => 2 * innerHeight - 1,
        end: () => innerHeight - 1,
        // end: 'bottom bottom',
        scrub: true,
        markers: true,
        pin: '.q4_etron_headlight_cover_wrapper',
        anticipatePin: 1,
        onToggle: () => {
          // gsap.set(".q4_etron_headlight_cover_wrapper", { y: 0});
        },
        onEnter: ({progress, direction, isActive}) => {
          // activeSection = document.querySelector('.active');
          // classList = activeSection.getAttribute('class');
          // // activeSection.removeAttribute('class');
          // activeSection.setAttribute('class', 'active');
          console.log('onEnter', progress, direction, isActive)
        },
        onLeave: ({progress, direction, isActive}) => {
          // activeSection.setAttribute('class', classList);
          console.log('onLeave', progress, direction, isActive);
          // gsap.set("body", { overflow: 'hidden'});
          // document.body.removeChild(containerDom);
          // fullpageDom.classList.remove('fp-destroyed');
          // // document.body.appendChild(fullpageDom);
          // fullpageDom.setAttribute('style', `${fullpageDom.getAttribute('style')};display: block`);
          try {
            // window.fullpage_api?.setAutoScrolling(true);
            window.fullpage_api?.silentMoveTo(activeIndex + 2);
            // window.fullpage_api?.setAllowScrolling(false);
            // window.fullpage_api?.reBuild();

            tl.reverse();
            document.querySelector('.q4_etron_headlight_fullpage').scrollTop = 0
          } catch (error) {
            console.log('🚀 ~ file: headlight.js:71 ~ playAnimation ~ error:', error);
          }
        },
  
    },
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
}
// playAnimation();

const scroll_start = document.querySelector('.q4_etron_headlight_scroll_start');
const scroll_end = document.querySelector('.q4_etron_headlight_scroll_end');
let activing = false;

window.onload = () => {

  window.fullpage_api.setAllowScrolling(true);

  var io = new IntersectionObserver(
    entries => {
        console.log('IntersectionObserver', entries);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === scroll_start) {
              if (!activing) {
                console.log('start');
  
                activeIndex = window.fullpage_api.getActiveSection().index();
                fullpageOption = window.fullpage_api.getFullpageData();
                fullpageDom = window.fullpage_api.getActiveSection().container;
                const cloneDom = window.fullpage_api.getActiveSection().item.cloneNode(true);
                // document.createElement('div');
                // containerDom.innerHTML = window.fullpage_api.getActiveSection().item.innerHTML;
                // containerDom.setAttribute({style: 'height: 200vh'});
                // containerDom = document.body.insertBefore(cloneDom, document.body.childNodes[0]);
                // gsap.set(containerDom, { 'height': '200vh'});
                // // document.body.removeChild(fullpageDom);
                // fullpageDom.classList.add('fp-destroyed');
                // fullpageDom.setAttribute('style', `${fullpageDom.getAttribute('style')};display: none`);
                // window.fullpage_api?.destroy();
                // gsap.set("body", { height: '100vh', overflowY: 'scroll'});
                // gsap.set(".view", { 'height': '100vh'});
                // gsap.set(".active", { 'height': '200vh', overflow: 'hidden', position: 'fixed', zIndex: 10, top: 0});
                // window.fullpage_api.setAutoScrolling(false);
                // playAnimation();
              }
              activing = true;
            } else {
              console.log('end');
              // activing = false;
            }
          }
        });
        // if (entries[0].intersectionRatio < 0.9) {
        //   // tl.reverse();
        // } else {
        //   // tl.restart();
        //   // activeSection = document.querySelector('.active');
        //   // classList = activeSection.getAttribute('class');
        //   // // activeSection.removeAttribute('class');
        //   // activeSection.setAttribute('class', 'active');
        //   window.fullpage_api.setAutoScrolling(false);
        //   // gsap.set(".active", { 'height': '200vh'});
        // }
    }, {
      threshold: 1
    }
  );
  // 开始观测某个元素
  io.observe(scroll_start);
  io.observe(scroll_end);
}
