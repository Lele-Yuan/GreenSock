(function (window, document) {
    document.addEventListener('DOMContentLoaded', function () {


        $(document).ready((event) => {
            var changedScrollTop = 0;
            var lastScrollTop = 0;
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            var changedScrollTopForSlideShow = 0;
            var lastScrollTopForSlideShow = 0;
            var slideShowOffsetTop = $(".owner-story-slide-show").offset().top;
            var slideShowHeight = $(".owner-story-slide-show").height();
            var slideShowOffsetBottom = slideShowHeight + slideShowOffsetTop - windowHeight;
            var videoOffsetTop = $(".owner-story-video").offset().top;
            var videoHeight = $(".owner-story-video").height();
            var videoOffsetBottom = videoHeight + videoOffsetTop - windowHeight - windowHeight;
            var slideShowImages = $(".owner-story-slide-show-inner-wrapper-image-wrapper-image");
            var slideShowTexts = $(".owner-story-slide-show-inner-wrapper-text-item");
            var slideShowImageWidth = slideShowImages.width()
            var slideShowMoveDistance = slideShowImageWidth + parseInt($(".owner-story-slide-show-inner-wrapper-image-wrapper-image").css("marginRight"));
            var itemCount = $(".owner-story-slide-show-inner-wrapper-text-wrapper").children().length;
            var distance = 0;
            var scrollDistance = 0;
            var scrollDistanceForSlideShow = 0;
            var activeTextItemForText = $(".owner-story-slide-show-inner-wrapper-text-item.active");
            var activeTextSiblingItemForText = activeTextItemForText.next();

            var activeItemForImage = $(".owner-story-slide-show-inner-wrapper-image-wrapper-image.active");
            var activeSiblingItemForImage = activeItemForImage.next();

            var ratioDistance = 0;
            var imageWrapper = $(".owner-story-slide-show-inner-wrapper-image-wrapper");
            var imageWrapperItems = imageWrapper.children();
            var imageWrapperItemsCount = imageWrapperItems.length;
            var maxMoveDistance = (slideShowImageWidth + 70) * (imageWrapperItemsCount - 1);
            var activeIndex = 0;
            var initIndex = 0;
            var extraDistance = 0;
            var nextOpacityChangeEle = activeItemForImage.next();
            var slideShowInnerWrapperTextWidth = $(".owner-story-slide-show-inner-wrapper-text").width();

            $('.aui-player__progress-holder').on('click', function (event) {

                var desktop_video = $(event.target.parentNode.parentNode.parentNode.parentNode).find('.video-player.desktop-video');
                var mobile_video = $(event.target.parentNode.parentNode.parentNode.parentNode).find('.video-player.mobile-video');
                if (window.innerWidth < 768) {
                    mobile_video.each(function (i, item) {

                        updateCurrentTime(event, item);
                    });
                }
                else {
                    desktop_video.each(function (i, item) {

                        updateCurrentTime(event, item);
                    });
                }
            });
            //aui-player__progress-control
            var updateCurrentTime = function (event, element) {

                var boundings = $(event.target.parentNode.parentNode.parentNode).find('.aui-player__progress-control').get(0).getBoundingClientRect(),
                    offsetX = event.clientX - boundings.left,
                    ratio = offsetX / $(event.target.parentNode.parentNode.parentNode).find('.aui-player__progress-control')[0].offsetWidth;
                ratio = Math.max(0, Math.min(ratio, 1));

                $(element)[0].currentTime = ratio * $(element)[0].duration;

            };
            $(".play-button").click(function () {
                $(this).hide();
                $(".aui-player>button[class*='aui-player']").hide();
                if (windowWidth > 1024) {
                    $("#owner-story-video")[0].play();
                } else {
                    $("#owner-story-video-mobile")[0].play();
                }
            })
            for (let index = 0; index < imageWrapperItems.length; index++) {
                const imageWrapperItem = $(imageWrapperItems[index]);
                imageWrapperItem.attr({
                    index: index,
                    offsetLefLefttDistance: parseInt(imageWrapperItem.offset().left) - slideShowInnerWrapperTextWidth - 670,
                    offsetLefRighttDistance: parseInt(imageWrapperItem.offset().left) - slideShowInnerWrapperTextWidth
                })
            }
            $(".owner-story-slide-show-inner-wrapper-image-wrapper-image-text").width(windowWidth - 30);
            function scrollEvent() {
                changedScrollTop = $(this).scrollTop();
                scrollDistance = changedScrollTop - lastScrollTop;
                if (changedScrollTop > 200) {
                    $(".owner-story-banner-wrapper").addClass("owner-story-animations");
                } else {
                    $(".owner-story-banner-wrapper").removeClass("owner-story-animations");
                }

                if (windowWidth > 1023) {

                    if (changedScrollTop > videoOffsetTop && changedScrollTop < videoOffsetBottom) {
                        var paddingTop = parseInt($(".onwer-story-video-inner-wrapper").css("paddingTop"));
                        if (scrollDistance > 0) {
                            paddingTop -= 100;
                        } else {
                            paddingTop += 100
                        }

                        if (paddingTop <= 0) {
                            paddingTop = 0
                        }
                        if (paddingTop >= 100) {
                            paddingTop = 100;
                        }
                        $(".onwer-story-video-inner-wrapper").css({
                            paddingTop: `${paddingTop}px`
                        })
                    }

                    if (changedScrollTop > videoOffsetBottom) {
                        $(".onwer-story-video-inner-wrapper").css({
                            paddingTop: `0px`
                        })
                    }

                    if (changedScrollTop < videoOffsetTop) {
                        $(".onwer-story-video-inner-wrapper").css({
                            paddingTop: `100px`
                        })
                    }
                }

                if (changedScrollTop > (videoOffsetBottom + 60)) {
                    $(".owner-story-more-story-wrapper").addClass("delay-animations");
                } else {
                    $(".owner-story-more-story-wrapper").removeClass("delay-animations");
                }
                setTimeout(function () { lastScrollTop = changedScrollTop; }, 0)
            }
            function scrollEventForSlideShow() {
                changedScrollTopForSlideShow = $(this).scrollTop();
                scrollDistanceForSlideShow = changedScrollTopForSlideShow - lastScrollTopForSlideShow;

                if (changedScrollTopForSlideShow > slideShowOffsetTop && changedScrollTopForSlideShow < slideShowOffsetBottom) {
                    if (windowWidth < 1024) {

                        if (scrollDistanceForSlideShow > 0) {
                            if (activeTextItemForText.next().length) {
                                activeTextItemForText.addClass("moveOut");
                                activeTextSiblingItemForText = activeTextItemForText.next();
                                activeTextSiblingItemForText.addClass("active");
                                activeTextItemForText.removeClass("active");
                                activeTextItemForText = activeTextSiblingItemForText;
                            }

                            if (!activeTextSiblingItemForText.length) {
                                activeTextSiblingItemForText = activeTextItemForText.prev();
                            }


                            if (activeItemForImage.next().length) {
                                activeItemForImage.addClass("moveOut");
                                activeSiblingItemForImage = activeItemForImage.next();
                                activeSiblingItemForImage.addClass("active");
                                activeItemForImage.removeClass("active");
                                activeItemForImage = activeSiblingItemForImage;
                                distance -= slideShowMoveDistance;
                            }

                            if (!activeSiblingItemForImage.length) {
                                activeSiblingItemForImage = activeItemForImage.prev();
                            }
                        } else {
                            if (activeTextItemForText.prev().length) {
                                activeTextItemForText.removeClass("active");
                                activeTextSiblingItemForText = activeTextItemForText.prev();
                                activeTextSiblingItemForText.addClass("active");
                                activeTextSiblingItemForText.removeClass("moveOut");
                                activeTextItemForText = activeTextSiblingItemForText;
                            }

                            if (!activeTextSiblingItemForText.length) {
                                activeTextSiblingItemForText = activeTextItemForText.next();
                            }

                            if (activeItemForImage.prev().length) {
                                activeItemForImage.removeClass("active");
                                activeSiblingItemForImage = activeItemForImage.prev();
                                activeSiblingItemForImage.addClass("active");
                                activeSiblingItemForImage.removeClass("moveOut");
                                activeItemForImage = activeSiblingItemForImage;
                                distance += slideShowMoveDistance;
                            }

                            if (!activeSiblingItemForImage.length) {
                                activeSiblingItemForImage = activeItemForImage.next();
                            }
                        }
                    }
                    if (windowWidth > 1023) {
                        ratioDistance = scrollDistanceForSlideShow / (slideShowHeight - windowHeight) * maxMoveDistance;
                        if (scrollDistanceForSlideShow > 0) {
                            distance -= Math.abs(ratioDistance);
                            extraDistance = 80;
                        } else {
                            distance += Math.abs(ratioDistance);
                            extraDistance = -80;
                        }

                        if (distance > 0) {
                            distance = 0;
                        }

                        if (distance < -maxMoveDistance) {
                            distance = -maxMoveDistance;
                        }
                        var extraCount = Math.abs(distance / (slideShowImageWidth + extraDistance));
                        activeIndex = Math.floor(extraCount);
                        if (initIndex != activeIndex) {
                            imageWrapperItems.removeClass("active");
                            $(imageWrapperItems.get(activeIndex)).addClass("active");

                            slideShowTexts.removeClass("active");
                            activeTextItemForText.addClass("moveOut");
                            $(slideShowTexts.get(activeIndex)).addClass("active");
                            initIndex = activeIndex;
                        }
                        for (let index = 1; index < imageWrapperItems.length; index++) {
                            var imageWrapperItem = $(imageWrapperItems[index]);
                            var compareDisatance = Math.abs(distance);
                            var offsetleflefttdistance = imageWrapperItem.attr("offsetleflefttdistance");
                            var offsetlefrighttdistance = imageWrapperItem.attr("offsetlefrighttdistance");
                            var opacityInitVal = Math.abs(distance) / offsetlefrighttdistance;
                            var opacityVal = opacityInitVal < 0.2 ? 0.2 : opacityInitVal;
                            if (compareDisatance > offsetleflefttdistance && opacityVal > 0 && opacityVal < 1) {
                                // console.log(imageWrapperItem, opacityVal);
                                imageWrapperItem.css({
                                    opacity: opacityVal
                                })
                            }

                            if (imageWrapperItem.hasClass("active") && scrollDistanceForSlideShow > 0) {
                                imageWrapperItem.css({
                                    opacity: 1
                                })
                            }

                            if (compareDisatance < offsetleflefttdistance && scrollDistanceForSlideShow < 0) {
                                imageWrapperItem.css({
                                    opacity: 0.2
                                })
                            }
                            var miniDistance = distance + parseInt(offsetlefrighttdistance);

                            if (Math.abs(miniDistance) < 70) {
                                distance = -offsetlefrighttdistance;
                                imageWrapperItems.removeClass("active");
                                $(imageWrapperItems.get(index)).addClass("active");
                                slideShowTexts.removeClass("active");
                                activeTextItemForText.addClass("moveOut");
                                $(slideShowTexts.get(index)).addClass("active");
                                initIndex = index;
                            }
                        }
                        $(".owner-story-slide-show-inner-wrapper-image-wrapper").animate({}, function () {
                            $(".owner-story-slide-show-inner-wrapper-image-wrapper").css({
                                transform: `translateX(${distance}px)`
                            })
                        })

                    }
                }

                if (changedScrollTopForSlideShow <= slideShowOffsetTop) {

                    if (windowWidth > 1023) {
                        distance = 0;
                        $(".owner-story-slide-show-inner-wrapper-image-wrapper").animate({}, function () {
                            $(".owner-story-slide-show-inner-wrapper-image-wrapper").css({
                                transform: `translateX(0px)`
                            })
                        })
                        imageWrapperItems.removeClass("active");
                        $(imageWrapperItems.first()).addClass("active");
                        slideShowTexts.removeClass("active");
                        slideShowTexts.removeClass("moveOut");
                        $(slideShowTexts.first()).addClass("active");
                        imageWrapperItems.css({
                            opacity: "0.2"
                        })
                        $(imageWrapperItems.first()).css({
                            opacity: "1"
                        })
                    }
                    if (windowWidth < 1024) {
                        slideShowTexts.removeClass("moveOut");
                        slideShowTexts.removeClass("active");
                        $(slideShowTexts.get(0)).addClass("active");
                        slideShowImages.removeClass("moveOut");
                        slideShowImages.removeClass("active");
                        $(slideShowImages.get(0)).addClass("active");
                        activeTextItemForText = $(slideShowTexts.get(0));
                        activeTextSiblingItemForText = activeTextItemForText.next();
                        activeItemForImage = $(slideShowImages.get(0));
                        activeSiblingItemForImage = activeItemForImage.next();
                        distance = 0;
                    }
                }

                if (changedScrollTopForSlideShow >= slideShowOffsetBottom) {
                    if (windowWidth > 1023) {
                        distance = -maxMoveDistance;
                        $(".owner-story-slide-show-inner-wrapper-image-wrapper").animate({}, function () {
                            $(".owner-story-slide-show-inner-wrapper-image-wrapper").css({
                                transform: `translateX(-${(itemCount - 1) * slideShowMoveDistance}px)`
                            })
                        })
                        imageWrapperItems.removeClass("active");
                        $(imageWrapperItems.last()).addClass("active");
                        slideShowTexts.removeClass("active");
                        slideShowTexts.removeClass("moveOut");
                        $(slideShowTexts.last()).addClass("active");
                        $(imageWrapperItems.last()).css({
                            opacity: "1"
                        })
                    }
                    if (windowWidth < 1024) {

                        slideShowTexts.removeClass("moveOut");
                        slideShowTexts.removeClass("active");
                        $(slideShowTexts.get(itemCount - 1)).addClass("active");
                        slideShowImages.removeClass("moveOut");
                        slideShowImages.removeClass("active");
                        $(slideShowImages.get(itemCount - 1)).addClass("active");
                        activeTextItemForText = $(slideShowTexts.get(itemCount - 1));
                        activeTextSiblingItemForText = activeTextItemForText.prev();
                        activeItemForImage = $(slideShowImages.get(itemCount - 1));
                        activeSiblingItemForImage = activeItemForImage.prev();
                        distance = -(itemCount - 1) * slideShowMoveDistance
                    }
                }


                setTimeout(function () { lastScrollTopForSlideShow = changedScrollTopForSlideShow; }, 0)
            }
            function throttle(fn, time = 200) {
                var flag = true;
                return function () {
                    if (!flag) return;
                    flag = false;
                    setTimeout(() => {
                        fn.apply(this, arguments);
                        flag = true;
                    }, time);
                }
            }


            function debounce(fn, time = 200) {
                let timer = null
                return function () {
                    var arg = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        fn.apply(this, arg);
                    }, time);
                }
            }
            window.addEventListener("scroll", throttle(scrollEvent));
            var timeForSlideShow = windowWidth > 1024 ? 20 : 500;
            window.addEventListener("scroll", debounce(scrollEventForSlideShow, timeForSlideShow));
        })
    })
})(window, document);