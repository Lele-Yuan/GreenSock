// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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
        markers: true,
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

    if (sectionName === 'section1') {
        sectionTl.to(
            `.${sectionName} .section_mask`,
            {opacity: .7, scrub: 1, duration: 1},
            '>'
        );
    }
};

const isMobile = document.documentElement.offsetWidth < 428;
const systemName = isMobile ? 'mob' : 'pc';
// const section1CurrentFrame = index => `/content/dam/OneWeb/faw_vw/apps/sq7-test/img/${systemName}/image${(index + 1)}.jpg`;
const section1CurrentFrame = index => `/src/sq7/img/${systemName}/cs1.00${index < 10 ? '0' : ''}${index}${isMobile ? '' : '_compress'}.jpg`;
initGsap('section1', {
    sectionCurrentFrame: section1CurrentFrame,
    canvasSize: {
        pc: {width: 2880, height: 1620},
        mob: {width: 1125, height: 2436}
    }[systemName],
    sectionCount: 50
});

// const section2CurrentFrame = index => `/content/dam/OneWeb/faw_vw/apps/sq7-test/img/image${(index + 1)}.png`;
const section2CurrentFrame = index => `/src/car/img/image${(index + 1)}.png`;
initGsap('section2', {
    sectionCurrentFrame: section2CurrentFrame,
    canvasSize: {
        pc: {width: 1500, height: 844},
        mob: {width: 1500, height: 844}
    }[systemName],
    sectionCount: 35
});
