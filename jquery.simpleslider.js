/*
 * by Wani(me@wani.kr)
 */
;(function(global, factory){
    if ( typeof define === 'function' && define.amd ) {
        define(['jquery'], factory);
    }
    else {
        factory(jQuery);
    }
})(this, function($) {

    var
    doNothing = function() {},
    defaultSettings = {
        type: 'fade',
        duration: 450,
        easing: "swing",
        interval: 5000,

        controller: false,

        nextButton: null,
        prevButton: null,

        nextType: null,
        prevType: null,

        animations: {},

        autoplay: true
    },
    defaultAnimations = {
        fade: function(currentSlide, nextSlide, callback, settings) {
            settings = settings || defaultSettings;
            currentSlide.fadeOut({
                duration: settings.duration,
                easing: settings.easing
            });
            nextSlide.fadeIn({
                duration: settings.duration,
                easing: settings.easing,
                complete: callback
            });
        },
        slideLeft: function(currentSlide, nextSlide, callback, settings) {
            var width = currentSlide.parent().width();
            settings = settings || defaultSettings;
            currentSlide.css({
                left: 0
            }).animate({
                left: (-1)*width
            }, {
                duration: settings.duration,
                easing: settings.easing,
                complete: function() {
                    $(this).hide();
                }
            });
            nextSlide.show().css({
                left: width
            }).animate({
                left:0
            }, {
                duration: settings.duration,
                easing: settings.easing,
                complete: callback
            });
        },
        slideRight: function(currentSlide, nextSlide, callback, settings) {
            var width = currentSlide.parent().width();
            settings = settings || defaultSettings;
            currentSlide.css({
                left: 0
            }).animate({
                left: width
            }, {
                duration: settings.duration,
                easing: settings.easing,
                complete: function() {
                    $(this).hide();
                }
            });
            nextSlide.show().css({
                left: (-1)*width
            }).animate({
                left:0
            }, {
                duration: settings.duration,
                easing: settings.easing,
                complete: callback
            });
        },
        slideUp: function(currentSlide, nextSlide, callback, settings) {
            var height = currentSlide.parent().height();
            settings = settings || defaultSettings;
            currentSlide.css({
                top: 0
            }).animate({
                top: (-1)*height
            }, {
                duration: settings.duration,
                easing: settings.easing,
                complete: function() {
                    $(this).hide();
                }
            });
            nextSlide.show().css({
                top: height
            }).animate({
                top: 0
            }, {
                duration: settings.duration,
                easing: settings.easing,
                complete: callback
            });
        },
        slideDown: function(currentSlide, nextSlide, callback, settings) {
            var height = currentSlide.parent().height();
            settings = settings || defaultSettings;
            currentSlide.css({
                top: 0
            }).animate({
                top: height
            }, {
                duration: settings.duration,
                easing: settings.easing,
                complete: function() {
                    $(this).hide();
                }
            });
            nextSlide.show().css({
                top: (-1)*height
            }).animate({
                top: 0
            }, {
                duration: settings.duration,
                easing: settings.easing,
                complete: callback
            });
        },
        parallel: function(currentSlide, nextSlide, callback, settings) {
            settings = settings || defaultSettings;
            var width = currentSlide.parent().width();
            var slides = currentSlide.parent().children();
            var next = nextSlide.index();
            var current = currentSlide.index();
            slides.show();
            slides.each(function(idx, slide) {
                var $slide = $(slide);
                if (idx === 0) {
                    $slide.css({
                        left: width * (idx - current)
                    }).animate({
                        left: width * (idx - next)
                    }, {
                        duration: settings.duration,
                        easing: settings.easing,
                        complete: callback
                    });
                } else {
                    $slide.css({
                        left: width * (idx - current)
                    }).animate({
                        left: width * (idx - next)
                    }, {
                        duration: settings.duration,
                        easing: settings.easing
                    });
                }
            });
        }
    };

    $.fn.simpleslider = function(_settings) {

        var
        settings = $.extend({}, defaultSettings, _settings),
        animations = $.extend({}, defaultAnimations, settings.animations),

        $this = this,
        $slides = $this.find("> *"),
        slidesLength = $slides.length,

        $window = $(window),
        $controller = null,

        currentSlideIndex = 0,
        isAnimating = false,

        initialize = function() {

            $slides.not(':first-child').hide();
            $slides.css({
                position: 'absolute',
                left: 0,
                top: 0
            });

            if (settings.controller) {
                var i;
                $controller = $("<div class=\"simpleslider-controller\"></div>");
                for (i = 0; i < slidesLength; i++ ) {
                    $controller.append($("<a class=\"button-" + i + "\"></a>"));
                }
                $controller.find("a").eq(currentSlideIndex).addClass("active");
                $this.after($controller);

                $controller.find("a").bind("click", function() {
                    if ($(this).hasClass("active")) return;
                    changeSlide($(this).index());
                });
            }

            if (settings.nextButton) {
                $(settings.nextButton).bind("click", function() {
                    nextSlide(settings.nextType);
                });
            }

            if (settings.prevButton) {
                $(settings.prevButton).bind("click", function() {
                    prevSlide(settings.prevType);
                });
            }

            setInterval(function() {
                if (settings.autoplay) {
                    nextSlide();
                }
            }, settings.interval);

            $this.trigger('simpleslider.initialize');
        },
        nextSlide = function(type) {
            changeSlide((currentSlideIndex+1)%slidesLength, type, 'next');
        },
        prevSlide = function(type) {
            changeSlide((currentSlideIndex-1+slidesLength)%slidesLength, type, 'prev');
        },
        changeSlide = function(nextSlideIndex, type, from) {

            if (isAnimating) return;
            isAnimating = true;
            from = from || 'change';

            var animation = animations[type || settings.type] || animations.fade;
            var currentSlide = $slides.eq(currentSlideIndex);
            var nextSlide = $slides.eq(nextSlideIndex);

            $this.trigger('simpleslider.animateBefore', [currentSlide, nextSlide, from]);

            animation(
                currentSlide,
                nextSlide,
                function() {
                    isAnimating = false;
                    $this.trigger('simpleslider.animateAfter', [currentSlide, nextSlide]);
                },
                settings
            );

            if (settings.controller) {
                $controller.find("a").removeClass("active").eq(nextSlideIndex).addClass("active");
            }

            currentSlideIndex = nextSlideIndex;
        };

        initialize();

        return {
            target: $this,
            nextSlide: nextSlide,
            prevSlide: prevSlide,
            changeSlide: changeSlide,
            settings: settings
        };
    };
    return $;
});