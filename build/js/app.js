(function ($) {
    $('.circle')
        .circleProgress();

    $('article > .inner').matchHeight({
            byRow: true
        });

    $('.score-item h2').matchHeight();
})(jQuery);
