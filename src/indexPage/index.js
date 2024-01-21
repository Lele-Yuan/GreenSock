import { gsap } from "gsap";
import $ from "jquery";

$(window).on('load', function(){
    let isPlaying = false;
    let activeItem = 'item1';
    function isIOS() {
        if (/iPad|iPhone|iPod/.test(navigator.platform)) {
            return true;
        } else {
            return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
        }
    }
    function isMobile() {
        var THREHOLD_RWD_MOBILE_LAYOUT = 541;
        return ($(window).innerWidth() < THREHOLD_RWD_MOBILE_LAYOUT) || isIOS() || /(android|bbd+|meego).+mobile|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|plucker|pocket|psp|series(4|6)0|symbian|treo|up.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(navigator.userAgent.toLowerCase());
    }
    $('.homepage-model .model-selection .item').click(function() {

        if(isMobile()) {
            var container = $('.homepage-model .model-selection');
            var containerWidth = container.width();
            var scrollLeft = container.scrollLeft();
            var itemOffset = $(this).offset().left;
            var itemWidth = $(this).outerWidth();
            var itemIndex = $(this).index();

            var position;
            if(itemIndex === 0) {
                position = 0;
            } else if(itemIndex === $('.item').length - 1) {
                position = container[0].scrollWidth - containerWidth;
            } else {
                position = scrollLeft + itemOffset - containerWidth / 2 + itemWidth / 2;
            }

            container.animate({
                scrollLeft: position
            }, 500);
        }


        if (isPlaying || activeItem === $(this).data('target')) return;
        $('.homepage-model .model-selection .item').each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');
        var tl = gsap.timeline();
        var leaveBg = $('.bg .active');
        var leaveCar = $('.car .active');

        var target = $(this).data('target');
        var enterBg = $('.bg').find(`.${target}`);
        var enterCar = $('.car').find(`.${target}`);
        
        isPlaying = true;
        tl.to(leaveBg, {
            duration: .5,
            opacity: 0,
        });

        tl.to(enterBg, {
            duration: .5,
            opacity: 1,
        }, '<');
        enterCar.addClass('active');
        tl.to(leaveCar, {
            duration: .2,
            opacity: 0,
            onComplete: () => {
                activeItem = target;
            }
        }, '-=0.5');
        tl.fromTo(enterCar, {
            duration: .5,
            translateX: 200,
            opacity: 0,
        }, {
            duration: .5,
            translateX: 0,
            opacity: 1,
        }, '-=0.5')

        tl.then(() => {
            isPlaying = false;
            tl.to(leaveCar, {
                duration: 0,
                translateX: 0,
            })
            $('.bg').find('img').each(function () {
                if (!$(this).hasClass(target)) {
                    tl.to($(this), {
                        duration: 0,
                        opacity: 0,
                    })
                    $(this).removeClass('active');
                }
            })
            $('.car').find('img').each(function () {
                if (!$(this).hasClass(target)) {
                    tl.to($(this), {
                        duration: 0,
                        opacity: 0,
                    })
                    $(this).removeClass('active');
                }
            })
            enterBg.addClass('active');
            enterCar.addClass('active');
        });
    });
})