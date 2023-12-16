(function (window, document) {
    document.addEventListener('DOMContentLoaded', function () {
        $(document).ready((event) => {
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
        })
    })
})(window, document);