//jQuery encapsulation
(function ($) {
  //Document ready
  $(document).ready(function () {
    /*--- Poisition Slides ---*/

    $(".infinite-carousel").on("position-slides", function () {
      var $infiniteCarousel = $(this),
        $viewport = $infiniteCarousel.find(".carousel-viewport"),
        $slides = $infiniteCarousel.find(".slide"),
        $currentSlide = $slides.filter(".slide-current"),
        slideWidth = $slides.eq(0).outerWidth();

      //Current slide's index
      var currentSlideIndex = $slides.index($currentSlide);

      //Select slides
      var slides = new Array(
        cycleSelection(currentSlideIndex, -2, $slides),
        cycleSelection(currentSlideIndex, -1, $slides),
        cycleSelection(currentSlideIndex, 0, $slides),
        cycleSelection(currentSlideIndex, 1, $slides),
        cycleSelection(currentSlideIndex, 2, $slides)
      );

      //Position slides offscreen
      $slides.each(function (i) {
        var $slide = $(this);

        //If it's the further right slide -> position off-right (otherwise default to off-left)
        if ($slide.data("slide-index") == 2) {
          //Position off-right
          $slide
            .data("slide-position", $viewport.width())
            .data("slide-index", null)
            .data("slide-offscreen", "right")
            .trigger("slide-transition");
        } else {
          //If the slide is offscreen, don't animate it's repositioning
          if ($slide.data("slide-offscreen") == "right") {
            //Disable slide animation
            $slide.removeClass("slide-enable-animation");

            //Position off-left
            $slide
              .data("slide-position", slideWidth * -1)
              .data("slide-index", null)
              .data("slide-offscreen", "left")
              .trigger("slide-transition");
          } else {
            //Position off-left
            $slide
              .data("slide-position", slideWidth * -1)
              .data("slide-index", null)
              .data("slide-offscreen", "left")
              .trigger("slide-transition");

            //Re-enable  slide animation
            $slide.addClass("slide-enable-animation");
          }
        }
      });

      //Position the visible slides onscreen
      for (var i = 0; i < slides.length; i++) {
        if (
          i - 2 == 2 &&
          $infiniteCarousel.data("carousel-direction") == "next"
        ) {
          //Disable animation and position slide off-right
          slides[i]
            .removeClass("slide-enable-animation")
            .data("slide-position", $viewport.width())
            .trigger("slide-transition");

          //Re-enable animation
          slides[i]
            .data(
              "slide-position",
              $viewport.width() * 0.5 - slideWidth * 0.5 + slideWidth * (i - 2)
            )
            .trigger("slide-transition")
            .addClass("slide-enable-animation")
            .data("slide-index", i - 2)
            .data("slide-offscreen", null);
        } else {
          //Position slide
          slides[i]
            .data(
              "slide-position",
              $viewport.width() * 0.5 - slideWidth * 0.5 + slideWidth * (i - 2)
            )
            .trigger("slide-transition")
            .data("slide-index", i - 2)
            .data("slide-offscreen", null);
        }
      }
    });

    /*--- Setup Infinite Carousel ---*/

    $(".infinite-carousel").each(function () {
      var $infiniteCarousel = $(this),
        $slides = $infiniteCarousel.find(".slide");

      //Check whether CSS transitions are supported
      if ($("html").hasClass("csstransitions")) {
        $infiniteCarousel.data("carousel-animation-type", "css3");
      } else {
        $infiniteCarousel.data("carousel-animation-type", "jquery");
      }

      //Basic CSS for slides
      $slides.css({
        position: "absolute",
        top: 0,
      });

      //Capture clicks on controls
      $(".carousel-control-previous, .carousel-control-next").on(
        "click",
        function (e) {
          /**console.log(
            'Event: click'
          + '\n\tTarget: .carousel-control-previous OR .carousel-control-next'
          );
          /**/

          e.preventDefault();

          var $newCurrentSlide,
            $currentSlide = $slides.filter(".slide-current"),
            currentSlideIndex = $slides.index($currentSlide);

          //Previous
          if ($(this).hasClass("carousel-control-previous")) {
            //Select previous slide
            $newCurrentSlide = cycleSelection(currentSlideIndex, -1, $slides);

            //Store change direction
            $infiniteCarousel.data("carousel-direction", "previous");
          }

          //Next
          if ($(this).hasClass("carousel-control-next")) {
            //Select next slide
            $newCurrentSlide = cycleSelection(currentSlideIndex, 1, $slides);

            //Store change direction
            $infiniteCarousel.data("carousel-direction", "next");
          }

          //Remove 'slide-current' from all slides
          $slides.removeClass("slide-current");

          //Add 'slide-current' to new slide
          $newCurrentSlide.addClass("slide-current");

          //Reposition Slides
          $infiniteCarousel.trigger("position-slides");
        }
      );

      /*--- Slide Transitions ---*/
      $slides.on("slide-transition", function () {
        /**console.log( 'Event: slide-transition' );/**/

        var $slide = $(this);

        //Do CSS3 transition if supported, otherwise animate via jQuery
        if ($infiniteCarousel.data("carousel-animation-type") === "css3") {
          /**console.log('Animate via CSS3');/**/

          //CSS3 transition
          $slide.css({
            left: $slide.data("slide-position"),
          });
        } else {
          /**console.log('Animate via jQuery');/**/

          if ($slide.hasClass("slide-enable-animation")) {
            //Animated via jQuery
            $slide.stop().animate(
              {
                left: $slide.data("slide-position"),
              },
              500
            );
          } else {
            //Animated via jQuery
            $slide.stop().css({
              left: $slide.data("slide-position"),
            });
          }
        }
      });

      /*-- Window Resize ---*/
      $(window).on("resize", function () {
        $infiniteCarousel.trigger("position-slides");
      });

      /*--- Position Slides ---*/
      $infiniteCarousel.trigger("position-slides");
    });

    function cycleSelection(currentIndex, relativeIndex, $selection) {
      var selectIndex = currentIndex + relativeIndex,
        totalItemsInSelection = $selection.size();

      //Selected exceeds the total items
      if (selectIndex > totalItemsInSelection - 1) {
        selectIndex = (currentIndex + relativeIndex) % totalItemsInSelection;
      }

      //Selected is lower than zero
      if (selectIndex < 0) {
        //Add the negative remainder to the total
        selectIndex =
          totalItemsInSelection +
          ((currentIndex + relativeIndex) % totalItemsInSelection);
      }

      /*console.log(
          'cycleSelection()\n'
        + '\tCurrent-index:   ' + currentIndex + '\n'
        + '\tRelative-index:  ' + relativeIndex + '\n'
        + '\tSelection Total: ' + $selection.size() + '\n'
        + '\tSelected Index:  ' + selectIndex
        );
        /**/

      return $selection.eq(selectIndex);
    }
  });
})(jQuery);
