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

/**
 * Toggles the visibility of the modal.
 */
const toggle = () => {
  const $modal = $('.rdate-container');
  $modal.toggleClass('visible');
};

/**
 * Creates the modal and appends it to the root element.
 * @param {Object} settings - The modal settings.
 */
const create = (settings) => {
  const $modal = $('<div>')
    .addClass('rdate-container')
    .html(`
      <div class='rdate'>
        <h2 class='rdate-title'>
          ${settings.title}
        </h2>
        <div class='rdate-main-content'>
          <div class='rdate-repeat-every row'>
            <span>Repeat every</span>
            <input 
              class='rdate-interval-input' 
              type='number'
              value='1'
              min='1'
            >
            <select class='rdate-frequency-select'>
              <option value='days'>days</option>
              <option value='weeks'>weeks</option>
              <option value='months'>months</option>
              <option value='years'>years</option>
            </select>
          </div>
          <div id='rdate-content-weeks' class='rdate-week-container hidden content'>
            <div class='rdate-repeat-on-text'>Repeat on</div>
            <div class='rdate-weekdays-container row'>
              <span class='rdate-weekday' data-dayofweek='SU'>S</span>
              <span class='rdate-weekday' data-dayofweek='MO'>M</span>
              <span class='rdate-weekday' data-dayofweek='TU'>T</span>
              <span class='rdate-weekday' data-dayofweek='WE'>W</span>
              <span class='rdate-weekday' data-dayofweek='TH'>T</span>
              <span class='rdate-weekday' data-dayofweek='FR'>F</span>
              <span class='rdate-weekday' data-dayofweek='SA'>S</span>
            </div>
          </div>
          <div class='rdate-ends-text'>Ends</div>
          <div class='rdate-ends-radio-group'>
            <div class='rdate-ends-on'>
              <div class='radio-ends-on-container'>
                <input
                  type='radio'
                  id='radio-ends-on'
                  class='radio-ends-on'
                  name='ends'
                  value='on'
                  checked
                >
              </div>
              <label for='radio-on' class='radio-ends-on-label'>On</label>
              <input id='ends-on-date-input' class='ends-on-date-input' name='date' />
            </div>
            <div class='rdate-ends-after'>
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
                class='ends-after-input disabled'
                type='number'
                min='1'
                value='1'
                disabled
              />
              <label for='ends-after-input' class='ends-after-input-label disabled'>
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
};

/**
 * Handles the on change event of the frequency selector.
 */
function onFrequencySelectChange() {
  const selectedOption = $(this).val();

  $('.content').addClass('hidden');
  $(`#rdate-content-${selectedOption}`).removeClass('hidden');
}

/**
 * Handles the on click event when selecting a weekday.
 */
function onWeekdayClick() {
  const $weekdayElement = $(this);
  $weekdayElement.toggleClass('active');
}

/**
 * Resets the modal to its initial state.
 */
const reset = () => {
  $('.rdate-interval-input').val(1);

  $('.rdate-frequency-select').val('days');
  $('.rdate-frequency-select').trigger('change');
};

const onCancelClick = () => {
  toggle();
  reset();
};

/**
 * Initializes the reactive behaviors of the modal and its elements.
 */
const init = () => {
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

  $('.rdate-frequency-select').change(onFrequencySelectChange);
  $('.rdate-weekday').on('click', onWeekdayClick);
  $('.rdate-cancel-btn').on('click', onCancelClick);
};

/**
 * Initializes a recurring dates generation form plugin.
 * Can generate single dates or sets of time ranges if an end date is provided.
 *
 * @param {Object} options - Configuration options.
 * @param {Date} options.start - The (start) date for which dates will be generated.
 * Represents the single date or the start date of the initial date range.
 * Defaults to the current date.
 * @param {Date|null} options.end - The end date of the initial date range. Defaults to null.
 * @param {string} options.title - The title of the recurrence modal. Defaults to 'Set recurrence'.
 *
 * @returns {jQuery} - The jQuery object.
 */
function rDates(options) {
  const defaultOptions = {
    start: new Date(),
    end: null,
    title: 'Set recurrence',
  };

  const settings = $.extend({}, defaultOptions, options);

  return this.each(() => {
    const $element = $(this);
    $element.on('click', toggle);

    create(settings);
    init();
    reset();
  });
}

$.fn.extend({ rDates });

$('#my-show-modal-button').rDates();
