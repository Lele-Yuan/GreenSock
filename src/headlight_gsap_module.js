import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "jquery";
import "fullpage.js";
gsap.registerPlugin(ScrollTrigger);

// (function (window, document) {
  $(document).ready(function () {
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
    let activeSection = null;
    let classList = '';
    let fullpageOption = null, containerDom = null, fullpageDom = null, activeIndex = -1;
    let actionBack = false;
    let isTop = false, isStart = false, isStart2 = false, isEnd = false;
    let isLeaved = false;
    
    gsap.set("body", { overflow: 'hidden'});
    let tl = gsap.timeline({
      paused: true,
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
            console.log('onEnter', progress, direction, isActive)
          },
          onLeave: ({progress, direction, isActive}) => {
            console.log('onLeave', progress, direction, isActive);
            isLeaved = true;
          },
          onEnterBack: ({progress, direction, isActive}) => {
            actionBack = true;
            console.log('onEnterBack', progress, direction, isActive)
          },
          onLeaveBack: ({progress, direction, isActive}) => {
            console.log('onLeaveBack', progress, direction, isActive)
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
    const playAnimation = () => {
      tl.play();
    }
    // playAnimation();
    
    const scroll_dom = document.querySelector('.q4_etron_headlight_fullpage');
    const scroll_top = document.querySelector('.q4_etron_headlight_scroll_top');
    const scroll_start = document.querySelector('.q4_etron_headlight_scroll_start');
    const scroll_start2 = document.querySelector('.q4_etron_headlight_scroll_start2');
    const scroll_end = document.querySelector('.q4_etron_headlight_scroll_end');
    
    const clearFlag = () => {
      actionBack = false;
      isTop = false;
      isStart = false;
      isStart2 = false;
      isEnd = false;
      isLeaved = false;
    }
    
    // window.onload = () => {
    
    //   $.fn.fullpage?.setAllowScrolling(true);
    
      var io = new IntersectionObserver(
        entries => {
            console.log('IntersectionObserver', entries);
            entries.forEach((entry) => {
              if (entry.target === scroll_start && !entry.intersectionRatio) {
                console.log('start hide', isTop, isStart, isStart2, isEnd);
                if (isTop && !isEnd) {
                  clearFlag();
                  $.fn.fullpage?.setAutoScrolling(true);
                  $.fn.fullpage?.setScrollingSpeed(0);
                  // $.fn.fullpage?.moveTo(activeIndex);
                  $.fn.fullpage?.moveSectionUp();
                  // console.log('🚀 ~ file: headlight_gsap.js:139 ~ setTimeout ~ true:', true);
                  setTimeout(() => {
                    $.fn.fullpage?.setScrollingSpeed(700);
                  }, 0);
                }
              }
              if (entry.isIntersecting) {
                if (entry.target === scroll_top) {
                  console.log('top', isTop, isStart, isStart2, isEnd);
                  isTop = true;
                  if (actionBack && isStart) {
                    clearFlag();
                    $.fn.fullpage?.setAutoScrolling(true);
                    console.log('🚀 ~ file: headlight_gsap.js:128 ~ entries.forEach ~ true:', true);
                    // $.fn.fullpage?.moveTo(activeIndex);
                    $.fn.fullpage?.moveSectionUp();
                  }
                  isStart = false;
                } else if (entry.target === scroll_start) {
                  console.log('start', isTop, isStart, isStart2, isEnd);
                  if (!actionBack) {
                    $.fn.fullpage?.setAutoScrolling(false);
                    console.log('🚀 ~ file: headlight_gsap.js:148 ~ entries.forEach ~ false:', false);
                  }
                  if (isStart && !isEnd) {
                    clearFlag();
                    $.fn.fullpage?.setAutoScrolling(true);
                    $.fn.fullpage?.setScrollingSpeed(0);
                    // $.fn.fullpage?.moveTo(activeIndex);
                    $.fn.fullpage?.moveSectionUp();
                    // console.log('🚀 ~ file: headlight_gsap.js:139 ~ setTimeout ~ true:', true);
                    setTimeout(() => {
                      $.fn.fullpage?.setScrollingSpeed(700);
                    }, 0);
                  }
                  isStart = true;
                  // activeIndex = $.fn.fullpage?.getActiveSection().index();
                  fullpageOption = $.fn.fullpage?.getFullpageData();
                  fullpageDom = $.fn.fullpage?.getActiveSection().container;
                  isEnd = false;
                } else if (entry.target === scroll_start2) {
                  isStart2 = true;
                  console.log('start2', isTop, isStart, isStart2, isEnd);
                  if (isEnd) {
                    $.fn.fullpage?.setAutoScrolling(false);
                  }
                  isTop = false;
                } else {
                  console.log('end', isTop, isStart, isStart2, isEnd);
                  if (isLeaved) {
                    clearFlag();
                    $.fn.fullpage?.setAutoScrolling(true);
                    console.log('🚀 ~ file: headlight_gsap.js:161 ~ entries.forEach ~ false:', false);
                    // $.fn.fullpage?.moveTo(activeIndex + 2);
                    $.fn.fullpage?.moveSectionDown();
                  }
                  isEnd = true;
                  isStart = false;
                  // activing = false;
                }
              }
            });
        }, {
          threshold: 1
        }
      );
      // 开始观测某个元素
      io.observe(scroll_top);
      io.observe(scroll_start);
      io.observe(scroll_start2);
      io.observe(scroll_end);
    // }
  })
// })(window, document);
