import { gsap } from "gsap";
import $ from "jquery";

$(window).on('load', function(){
    let isPlaying = false;
    let activeItem = 'item1';

    const btnHref = {
        'item1': 'https://www.audi.cn/zh/function_center/Models_Body_Type/sedan.html',
        'item2': 'https://www.audi.cn/zh/function_center/Models_Body_Type/suv.html',
        'item3': 'https://www.audi.cn/zh/function_center/Models_Body_Type/coupe_convertible.html',
        'item4': 'https://www.audi.cn/zh/function_center/Models_Body_Type/station_wagon.html',
        'item5': 'https://www.audi.cn/zh/function_center/Models_Body_Type/electric.html',
        'item6': 'https://www.audi.cn/zh/function_center/Models_Body_Type/s_rs.html',
    }
    
    var $btn = $('.homepage-model .content .btn');
    $btn.on('click', function(){
        var target = $(this).parent().prev().find('.item.active').data('target');
        window.open(btnHref[target]);
        console.log('btnHref[target]: ', target);
    })

    function isIOS() {
        if (/iPad|iPhone|iPod/.test(navigator.platform)) {
            return true;
        } else {
            return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
        }
    }
    function isMobile() {
        var THREHOLD_RWD_MOBILE_LAYOUT = 767;
        return ($(window).innerWidth() < THREHOLD_RWD_MOBILE_LAYOUT) || isIOS() || /(android|bbd+|meego).+mobile|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|plucker|pocket|psp|series(4|6)0|symbian|treo|up.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(navigator.userAgent.toLowerCase());
    }

    if(isMobile()) {
        // HTML元素
        var element = document.getElementsByClassName('homepage-model')[0].getElementsByClassName('content')[0];
        
        // 记录初始位置
        var startX;
        var endX;

        var touchPosition = ''
        
        element.addEventListener('touchstart', function(event) {
            // 获取起点坐标
            startX = event.changedTouches[0].pageX;
        });
        
        element.addEventListener('touchmove', function(event) {
            // 防止页面滚动
            // event.preventDefault();

            // 计算移动距离
            var moveDistance = event.changedTouches[0].pageX - startX;
            
            if (Math.abs(moveDistance) > 100 && Math.sign(moveDistance) === -1) {
                // 向左滑动
                // console.log("左滑");
                touchPosition = 'left';
            } else if (Math.abs(moveDistance) > 100 && Math.sign(moveDistance) === 1) {
                // 向右滑动
                // console.log("右滑");
                touchPosition = 'right';
            }
        }, true);
        
        element.addEventListener('touchend', function() {
            var targetItem;
            if (touchPosition === 'left'){
                targetItem = $('.homepage-model .model-selection .item.active').next();
            } else if(touchPosition === 'right') {
                targetItem = $('.homepage-model .model-selection .item.active').prev();
            }
            if (targetItem && targetItem.length) {
                centerActive(targetItem);
                targetItem.click();
            }
            // 重置变量值
            startX = null;
            endX = null;
            touchPosition = '';
        });
    }

    function centerActive (activeItem){
        var container = $('.homepage-model .model-selection');
        var containerWidth = container.width();
        var scrollLeft = container.scrollLeft();
        var itemOffset = $(activeItem).offset().left;
        var itemWidth = $(activeItem).outerWidth();
        var itemIndex = $(activeItem).index();

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
        }, 200);
    }
    $('.homepage-model .model-selection .item').click(function() {

        if(isMobile()) {
            centerActive(this);
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
        var isPre = activeItem > target ? -1 : 1;
        
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
            translateX: isPre * 200,
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