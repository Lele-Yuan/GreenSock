import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const initCarface = () => {
    const isMobile = document.documentElement.offsetWidth < 431;
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
    
        if (!isMobile) {
            sectionTl.to(
                `.${sectionName} .section_mask`,
                {opacity: 1, scrub: 1, duration: 1},
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
    const pathName = '/content/dam/OneWeb/faw_vw/model/q7/sq7/2023/animation/final';  // 线上图片路径
    // const pathName = '/src/sq7'; // 本地图片路径
    const sectionCurrentFrame = index => `${pathName}/carface/jpg/${systemName}/${indexName(index)}.jpg`;
    initGsap('section2', {
        sectionCurrentFrame: sectionCurrentFrame,
        canvasSize: {
            pc: {width: 1920, height: 1080},
            mob: {width: 1125, height: 2436}
        }[systemName],
        sectionCount: 50
    });
};
initCarface();
