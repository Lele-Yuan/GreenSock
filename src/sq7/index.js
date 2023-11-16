// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const isMobile = document.documentElement.offsetWidth < 428;
const systemName = isMobile ? 'mob' : 'pc';

const initGsap = (sectionName, sectionConfig) => {
    const {sectionCurrentFrame, canvasSize, sectionCount} = sectionConfig;
    const sectionCanvas = document.getElementById(`${sectionName}_canvas`);
    const sectionContext = sectionCanvas.getContext("2d");

    sectionCanvas.width = canvasSize.width;
    sectionCanvas.height = canvasSize.height;

    const sectionImages = []
    const sectionFrame = {frame: 0};

    for (let i = 0; i < sectionCount; i++) {
        const img = new Image();
        img.src = sectionCurrentFrame(i);
        sectionImages.push(img);
    }

    sectionImages[0].onload = render;

    function render() {
        sectionContext.clearRect(0, 0, sectionCanvas.width, sectionCanvas.height);
        sectionContext.drawImage(sectionImages[sectionFrame.frame], 0, 0, sectionCanvas.width, sectionCanvas.height);
    }

    let sectionTl = gsap.timeline({
    paused: true,
    scrub: true,
    scrollTrigger: {
        trigger: `.section_scroll_wraper.${sectionName}`,
        start: "top top",
        end: 'bottom bottom',
        scrub: true,
        // markers: true,
        pin: `.${sectionName} .section_cover_wrapper`,
        anticipatePin: 1,
    },
    });
    sectionTl.to(sectionFrame, {
        frame: sectionCount - 1,
        snap: "frame",
        ease: "none",
        duration: 1,
        onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
    });

    if (!isMobile && sectionName === 'section1') {
        sectionTl.to(
            `.${sectionName} .section_mask`,
            {opacity: .7, scrub: 1, duration: 1},
            '>'
        );
    }
};
const indexName = index => {
    if (index < 10) {
        return `000${index}`
    } else if (index < 100) {
        return `00${index}`
    } else {
        return `0${index}`
    }
}
// const pathName = '/content/dam/OneWeb/faw_vw/model/q7/sq7/2023/animation/final';  // 线上图片路径
const pathName = '/src/sq7'; // 本地图片路径
// 图片地址
const section1CurrentFrame = index => `${pathName}/electric/jpg/${systemName}/cs1.${indexName(index + 1)}.jpg`;
// const section1CurrentFrame = index => `${pathName}/electric/webp/${systemName}/cs1.${indexName(index + 1)}.webp`;
initGsap('section1', {
    sectionCurrentFrame: section1CurrentFrame,
    canvasSize: {
        pc: {width: 2880, height: 1620},
        mob: {width: 1125, height: 2436}
    }[systemName],
    sectionCount: 101
});

// // const section2CurrentFrame = index => `/content/dam/OneWeb/faw_vw/model/q7/sq7/2023/animation/final/img/image${(index + 1)}.png`;
// const section2CurrentFrame = index => `/src/car/img/image${(index + 1)}.png`;
// initGsap('section2', {
//     sectionCurrentFrame: section2CurrentFrame,
//     canvasSize: {
//         pc: {width: 1500, height: 844},
//         mob: {width: 1500, height: 844}
//     }[systemName],
//     sectionCount: 35
// });
