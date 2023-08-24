/**
  MIT License

  Copyright (c) 2023 Gabriel Votaw

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 */

(($) => {
  $.fn.rDates = function (options) {
    const defaultOptions = {
      start: new Date(),
      end: null,
      title: 'Set recurrence',
    };

    const settings = $.extend({}, defaultOptions, options);

    return this.each(function () {
      const $element = $(this);
      $element.on('click', toggle);

      create(settings);
    });
  };

  const toggle = () => {
    const $modal = $('.rdate-container-sgn');
    $modal.toggleClass('visible');
  };

  const create = (settings) => {
    const $modal = $('<div>')
      .addClass('rdate-container-sgn')
      .html(`
        <div class='rdate-sgn'>
          <h2 class='rdate-title-sgn'>
            ${settings.title}
          </h2>
          <div class='rdate-main-content-sgn'>
            <div class='rdate-repeat-every-sgn row'>
              <span>Repeat every</span>
              <input 
                class='rdate-interval-input-sgn' 
                type='number'
                value='1'
                min='1'
              >
              <select class='rdate-frequency-select-sgn'>
                <option value='days'>days</option>
                <option value='weeks'>weeks</option>
                <option value='months'>months</option>
                <option value='years'>years</option>
              </select>
            </div>
            <div class='rdate-ends-text-sgn'>Ends</div>
            <div class='rdate-ends-radio-group-sgn'>
              <div class='rdate-ends-on-sgn'>
                <div class='radio-ends-on-container'>
                  <input
                    type='radio'
                    id='radio-ends-on'
                    class='radio-ends-on'
                    name='ends'
                    value='on'
                  >
                </div>
                <label for='radio-on' class='radio-ends-on-label'>On</label>
                <input id='ends-on-date-input' class='ends-on-date-input' name='date' />
              </div>
              <div class='rdate-ends-after-sgn'>
                <div class='radio-ends-after-container'>
                  <input
                    type='radio'
                    id='radio-ends-after'
                    class='radio-ends-after'
                    name='ends'
                    value='on'
                  >
                </div>
                <label for='radio-after' class='radio-ends-after-label'>After</label>
                <input 
                  id='ends-after-input'
                  class='ends-after-input'
                  type='number'
                  min='1'
                  value='1'
                />
                <label for='ends-after-input' class='ends-after-input-label'>
                  occurrences
                </label>
              </div>
            </div>
            <div class='rdate-control-button-group'>
              <button class='rdate-cancel-btn'>Cancel</button>
              <button class='rdate-done-btn'>Done</button>
            </div>
          </div>
        </div>
    `);

    $modal.appendTo('body');

    $('input[name="date"]').daterangepicker({
      singleDatePicker: true,
      minDate: new Date(),
      locale: {
        format: 'MMM D, YYYY',
        daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        firstDay: 0,
      },
    });
  };
})(jQuery);

$('#my-show-modal-button').rDates();
