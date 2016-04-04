
//default ease from ease.js
var ease = require('eases/quint-in-out');

/**
 * Simple and easy RAF animation function
 *
 * Example:
 *
 *    animate({
 *        duration: 1.8,
 *        step: step,
 *        complete: function() {
 *           //stuff
 *        }
 *    });
 *
 *     function step(progress) {
 *        // `progress` ranges from 0 to 1 —- 0 start, 1 is done
 *     }
 *
 *
 * @param ani Object
 */
function animate(params) {

    var duration = typeof params.duration == 'undefined' ? 0.3 : params.duration;
        duration *= 1000;
        end = +new Date() + duration;

    var request;

    var step = function() {

        var current = +new Date(),
            remaining = end - current;

        var rate = clamp(1 - remaining / duration, 0, 1);
        rate = params.ease ? params.ease(rate) : ease(rate);

        if (params.step)
            params.step(rate);

        if (remaining <= 0) {
            if (params.complete) {
                params.complete();
                //request = requestAnimationFrame(params.complete);
                return;
            }
        }

        request = requestAnimationFrame(step);
    };

    if(duration === 0)
        step();
    else
        request = requestAnimationFrame(step);

    return {
        cancel: function() {
            cancelAnimationFrame(request);
        }
    };

}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}


module.exports = animate;
