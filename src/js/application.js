import { lory } from 'lory.js'

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    var slider = document.querySelector('.timeline_slider');
    if (slider) {
      let timelineControls = Array.prototype.filter.call(
        document.querySelector('.timeline_controls').children,
        (tControl) => {
          if (typeof tControl.dataset.slideIndex !== 'undefined') {
            return tControl
          }
        }
      );

      function handleTimelineTickEvent(e) {
        switch(e.type) {
          case 'before.lory.init':
          case 'on.lory.resize':
            Array.prototype.forEach.call(
              timelineControls,
              (elem) => (
                elem.classList.remove('active')
              )
            )
            timelineControls[0].classList.add('active')
          break;
          case 'after.lory.init':
            Array.prototype.forEach.call(
              timelineControls,
              (elem) => {
                elem.addEventListener('click',
                (e) => {
                  e.preventDefault();
                  let slideIndex = elem.dataset.slideIndex;

                  timelineSlider.slideTo(parseInt(slideIndex));
                });
            })
          break;
          case 'after.lory.slide':
            Array.prototype.forEach.call(
              timelineControls,
              (elem) => (
                elem.classList.remove('active')
              ), () => {
              timelineControls[
                (e.detail.currentSlide - 1)
              ].classList.add('active');
            })
          break;
          default:
            return e;
        }
      }

    slider.addEventListener('before.lory.init', handleTimelineTickEvent);
    slider.addEventListener('after.lory.init', handleTimelineTickEvent);
    slider.addEventListener('after.lory.slide', handleTimelineTickEvent);
    slider.addEventListener('on.lory.resize', handleTimelineTickEvent)

    const timelineSlider = lory(slider, {
        classNameFrame: 'timeline_frame',
        classNameSlideContainer: 'timeline_slides',
        slidesToScroll: 1,
        ease: 'easeInOutQuart',
        enableMouseEvents: true
      })
    window.timelineSlider = timelineSlider;
    }
  })
})()
