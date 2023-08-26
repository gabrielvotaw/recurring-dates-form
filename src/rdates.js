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

const daysOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const frequencyMap = {
  days: rrule.RRule.DAILY,
  weeks: rrule.RRule.WEEKLY,
  months: rrule.RRule.MONTHLY,
  years: rrule.RRule.YEARLY,
};

const weekdayMap = {
  SU: rrule.RRule.SU,
  MO: rrule.RRule.MO,
  TU: rrule.RRule.TU,
  WE: rrule.RRule.WE,
  TH: rrule.RRule.TH,
  FR: rrule.RRule.FR,
  SA: rrule.RRule.SA,
};

/**
 * Toggles the visibility of the modal.
 */
const toggle = () => $('.rdates-container').toggleClass('visible');

/**
 * Creates the modal and appends it to the root element.
 * @param {Object} settings - The modal settings.
 */
const create = (settings) => {
  const $modal = $('<div>')
    .addClass('rdates-container')
    .html(`
      <div class='rdates'>
        <h2 class='rdates-title'>
          ${settings.title}
        </h2>
        <div class='rdates-main-content'>
          <div class='rdates-repeat-every row'>
            <span>Repeat every</span>
            <input 
              class='rdates-interval-input' 
              type='number'
              value='1'
              min='1'
            >
            <select class='rdates-frequency-select'>
              <option value='days'>days</option>
              <option value='weeks'>weeks</option>
              <option value='months'>months</option>
              <option value='years'>years</option>
            </select>
          </div>
          <div id='rdates-content-weeks' class='rdates-week-container hidden content'>
            <div class='rdates-repeat-on-text'>Repeat on</div>
            <div class='rdates-weekdays-container row'>
              <span class='rdates-weekday' data-dayofweek='SU'>S</span>
              <span class='rdates-weekday' data-dayofweek='MO'>M</span>
              <span class='rdates-weekday' data-dayofweek='TU'>T</span>
              <span class='rdates-weekday' data-dayofweek='WE'>W</span>
              <span class='rdates-weekday' data-dayofweek='TH'>T</span>
              <span class='rdates-weekday' data-dayofweek='FR'>F</span>
              <span class='rdates-weekday' data-dayofweek='SA'>S</span>
            </div>
          </div>
          <div id='rdates-content-months' class='rdates-month-container hidden content'>
            <select class='rdates-monthly-on-select'></select>
          </div>
          <div class='rdates-ends-text'>Ends</div>
          <div class='rdates-ends-radio-group'>
            <div class='rdates-ends-on'>
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
              <input id='ends-on-date-input' class='ends-on-date-input ends-input' name='date' />
            </div>
            <div class='rdates-ends-after'>
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
                class='ends-after-input ends-input disabled'
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
          <div class='rdates-control-button-group'>
            <button class='rdates-cancel-btn'>Cancel</button>
            <button class='rdates-done-btn'>Done</button>
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
  $(`#rdates-content-${selectedOption}`).removeClass('hidden');
}

const getDayOfWeek = (date) => {
  const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  return daysOfWeek[date.getDay()];
};

/**
 * Handles the on click event when selecting a weekday.
 *
 * @param {jQuery} $weekdayElement - The weekday element.
 * @param {string} settings - The modal settings.
 */
function onWeekdayClick($weekdayElement, settings) {
  const startDateDayOfWeek = getDayOfWeek(settings.startDate);
  const $selectedDaysOfWeek = $('.rdates-weekday.active');
  const isStartDateDayOfWeek = $weekdayElement.attr('data-dayofweek') === startDateDayOfWeek;

  if (isStartDateDayOfWeek
    && $selectedDaysOfWeek.length === 1
    && $weekdayElement.hasClass('active')
  ) {
    return;
  }

  if ($selectedDaysOfWeek.length === 1
    && $weekdayElement.hasClass('active')
  ) {
    $(`[data-dayofweek='${startDateDayOfWeek}']`).toggleClass('active');
  }

  $weekdayElement.toggleClass('active');
}

/**
 * Resets the modal to its initial state.
 *
 * @param {Object} settings - The modal settings.
 */
const reset = (settings) => {
  $('.rdates-interval-input').val(1);
  $('.rdates-frequency-select').val('days').trigger('change');

  const dayName = daysOfWeekNames[settings.startDate.getDay()];

  const pos = Math.floor((settings.startDate.getDate() - 1) / 7) + 1;
  const posStrings = ['first', 'second', 'third', 'fourth', 'last'];
  const posString = posStrings[pos - 1] || 'last';

  const option1 = $('<option>');
  const option2 = $('<option>');

  option1.text(`Monthly on day ${settings.startDate.getDate()}`);
  option1.data('type', 'day');
  option1.val(settings.startDate.getDate());

  option2.text(`Monthly on the ${posString} ${dayName}`);
  option2.data('type', 'pos');
  option2.val(`${pos} ${dayName}`);

  $('.rdates-monthly-on-select').append(option1, option2);

  const radioEndsOn = $('#radio-ends-on');
  if (!radioEndsOn.prop('checked')) {
    radioEndsOn.prop('checked', true).trigger('change');
  }

  $('.ends-on-date-input').data('daterangepicker').setStartDate(settings.startDate);
  $('.ends-on-date-input').data('daterangepicker').setEndDate(settings.startDate);
  $('.ends-after-input').val(1);

  const startDateDayOfWeek = getDayOfWeek(settings.startDate);
  $(`[data-dayofweek="${startDateDayOfWeek}"]`).addClass('active');
};

/**
 * Handles the on click event of the cancel button.
 *
 * @param {settings} - The modal settings.
 */
const onCancelClick = (settings) => {
  toggle();
  reset(settings);
};

const getSelectedWeekdays = () => {
  const selectedWeekdayButtons = $('.rdates-weekday.active');

  return selectedWeekdayButtons.map((i, button) => {
    const value = button.getAttribute('data-dayofweek');
    return weekdayMap[value];
  });
};

const generateRule = (frequency, interval, dtstart, until) => {
  const freq = frequencyMap[frequency];
  const generator = {
    freq,
    interval,
    dtstart,
  };

  if (frequency === 'weeks') {
    generator.byweekday = getSelectedWeekdays();
  }

  const endsOnRadio = $('#radio-ends-on');

  if (endsOnRadio.prop('checked')) {
    generator.until = until;
  } else {
    const countString = $('.ends-after-input').val();
    generator.count = parseInt(countString, 10);
  }

  return new rrule.RRule(generator);
};

const generateDates = (startDate, endDate, untilDate) => {
  const intervalString = $('.rdates-interval-input').val();
  const selectedInterval = parseInt(intervalString, 10);

  const selectedFrequency = $('.rdates-frequency-select').val();

  const startDateRules = generateRule(selectedFrequency, selectedInterval, startDate, untilDate);
  const startDates = startDateRules.all();

  if (!endDate) {
    console.log(startDates);
    return startDates;
  }

  const endDateRules = generateRule(selectedFrequency, selectedInterval, endDate, untilDate);
  const endDates = endDateRules.all();

  const dateRanges = startDateRules.all().map((start, i) => ({
    start,
    end: endDates[i],
  }));

  return dateRanges;
};

/**
 * Handles the on click event of the done button.
 *
 * @param {Object} settings - The modal settings.
 */
const onDoneClick = (settings) => {
  const { startDate, endDate } = settings;
  const untilDate = $('.ends-on-date-input').data('daterangepicker').startDate.toDate();

  const dates = generateDates(startDate, endDate, untilDate);
};

/**
 * Handles the on change event of the ends radio inputs.
 */
const onEndsRadioInputChange = () => {
  $('.ends-input')
    .toggleClass('disabled')
    .prop('disabled', (i, val) => !val);
};

/**
 * Initializes the reactive behaviors of the modal and its elements.
 *
 * @param {Object} settings - The modal settings.
 */
const init = (settings) => {
  $('input[name="date"]').daterangepicker({
    singleDatePicker: true,
    minDate: settings.startDate,
    locale: {
      format: 'MMM D, YYYY',
      daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      firstDay: 0,
    },
  });

  $('.rdates-frequency-select').on('change', onFrequencySelectChange);
  $('.rdates-weekday').on('click', function handler() { onWeekdayClick($(this), settings); });
  $('input[type="radio"]').on('change', onEndsRadioInputChange);
  $('.rdates-cancel-btn').on('click', () => onCancelClick(settings));
  $('.rdates-done-btn').on('click', () => onDoneClick(settings));
};

/**
 * Initializes a recurring dates generation form.
 * Can generate single dates or sets of time ranges if an end date is provided.
 *
 * @param {jQuery} $element - The element that will trigger the modal.
 * @param {Object} options - Configuration options.
 * @param {Date} options.start - The (start) date for which dates will be generated.
 * Represents a single date or the start date of the initial date range.
 * Defaults to the current date.
 * @param {Date|null} options.end - The end date of the initial date range. Defaults to null.
 * @param {string} options.title - The title of the recurrence modal. Defaults to 'Set recurrence'.
 *
 */
function core($element, options) {
  const defaultOptions = {
    startDate: new Date(),
    endDate: null,
    title: 'Set recurrence',
  };

  const settings = $.extend({}, defaultOptions, options);

  create(settings);
  init(settings);
  reset(settings);

  $element.on('click', toggle);
}

/**
 * Initializes the rdates jQuery plugin.
 */
$.fn.extend({
  rdates(options) {
    return this.each(() => core($(this), options));
  },
});

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  module.exports = {
    toggle,
    create,
    onFrequencySelectChange,
    onWeekdayClick,
    reset,
    onCancelClick,
    init,
    core,
  };
}

$('#my-show-modal-button').rdates({
  startDate: new Date('08/27/23'),
});
