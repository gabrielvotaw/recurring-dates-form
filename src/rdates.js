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
 * @typedef {Object} Config
 *
 * @property {Date} startDate - The (start) date for which dates will be generated.
 * Represents a single date or the start date of the initial date range.
 * Defaults to the current date.
 * @property {Date|null} endDate - The end date of the initial date range.
 * Defaults to null.
 * @property {string} title - The title of the recurrence form.
 * Defaults to 'Set recurrence'.
 * @property {function(): void} onCancelClick - A callback to be called on cancel click.
 * @property {function(Array<Date|DateRange>): void} onDoneClick - A callback to be called
 * with the generated dates or date ranges on done click.
 */

/**
 * @typedef {Object} DateRange
 *
 * @property {Date} start - The start date of the date range.
 * @property {Date} end - The end date of the date range.
 */

/**
 * An encapsulation closure around the rdates jQuery plugin.
 */
(($) => {
  const { RRule } = rrule;

  const DAYS_OF_WEEK_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const FREQUENCY_MAP = {
    days: RRule.DAILY,
    weeks: RRule.WEEKLY,
    months: RRule.MONTHLY,
    years: RRule.YEARLY,
  };

  const WEEKDAY_MAP = {
    SU: RRule.SU,
    MO: RRule.MO,
    TU: RRule.TU,
    WE: RRule.WE,
    TH: RRule.TH,
    FR: RRule.FR,
    SA: RRule.SA,
  };

  let dates = [];

  /**
   * Toggles the visibility of the form.
   */
  const toggle = () => $('.rdates-container').toggleClass('visible');

  /**
   * Creates the form and appends it to the root element.
   *
   * @param {Config} config - The form config.
   */
  const create = (config) => {
    const $form = $('<div>')
      .addClass('rdates-container')
      .html(`
      <div class='rdates'>
        <h2 class='rdates-title'>
          ${config.title}
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

    $form.appendTo('body');
  };

  /**
   * Handles the on change event of the frequency selector.
   *
   * @param {jQuery} $select - The select element.
   */
  function onFrequencySelectChange($select) {
    const selectedOption = $select.val();

    $('.content').addClass('hidden');
    $(`#rdates-content-${selectedOption}`).removeClass('hidden');
  }

  /**
   * Returns the day of week of the provided date in a shortened RRule compatible format.
   *
   * @param {Date} date - The date.
   *
   * @returns {string} - The day of the week.
   */
  const getDayOfWeek = (date) => {
    const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return daysOfWeek[date.getDay()];
  };

  /**
   * Handles the on click event when selecting a weekday.
   *
   * @param {jQuery} $weekdayElement - The weekday element.
   * @param {string} settings - The form settings.
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
   * Returns whether the given date is the last occurrence of that weekday in its month.
   *
   * @param {Date} date - The date.
   *
   * @returns {boolean} - True if the date is the last occurrence, false otherwise.
   */
  const isLastOccurenceOfWeekdayInMonth = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();

    const dayNextWeek = new Date(year, month, date.getDate() + 7);

    return dayNextWeek.getMonth() !== month;
  };

  /**
   * Resets the form to its initial state.
   *
   * @param {Config} config - The form settings.
   */
  const reset = (config) => {
    $('.rdates-interval-input').val(1);
    $('.rdates-frequency-select').val('days').trigger('change');

    const dayName = DAYS_OF_WEEK_NAMES[config.startDate.getDay()];

    $('.rdates-monthly-on-select').html('');

    const pos = Math.floor((config.startDate.getDate() - 1) / 7) + 1;
    const posStrings = ['first', 'second', 'third', 'fourth'];
    const posString = posStrings[pos - 1] || null;

    const monthlyOnSelect = $('.rdates-monthly-on-select');

    const option1 = $('<option>');

    option1.text(`Monthly on day ${config.startDate.getDate()}`);
    option1.data('type', 'day');
    option1.val(config.startDate.getDate());

    monthlyOnSelect.append(option1);

    if (posString !== null) {
      const option2 = $('<option>');

      option2.text(`Monthly on the ${posString} ${dayName}`);
      option2.data('type', 'pos');
      option2.val(`${pos} ${dayName}`);

      monthlyOnSelect.append(option2);
    }

    if (isLastOccurenceOfWeekdayInMonth(config.startDate)) {
      const option3 = $('<option>');

      option3.text(`Monthly on the last ${dayName}`);
      option3.data('type', 'pos');
      option3.val(`-1 ${dayName}`);

      monthlyOnSelect.append(option3);
    }

    const radioEndsOn = $('#radio-ends-on');
    if (!radioEndsOn.prop('checked')) {
      radioEndsOn.prop('checked', true).trigger('change');
    }

    $('.ends-on-date-input').data('daterangepicker').setStartDate(config.startDate);
    $('.ends-on-date-input').data('daterangepicker').setEndDate(config.startDate);
    $('.ends-after-input').val(1);

    const startDateDayOfWeek = getDayOfWeek(config.startDate);
    $(`[data-dayofweek="${startDateDayOfWeek}"]`).addClass('active');
  };

  /**
   * Handles the on click event of the cancel button
   * and calls the respective callback in the config.
   *
   * @param {Config} config - The form config.
   */
  const onCancelClick = (config) => {
    toggle();
    reset(config);

    config.onCancelClick();
  };

  /**
   * Returns the weekdays the user has selected for the week frequency section.
   *
   * @returns {string[]} - The selected weekdays.
   */
  const getSelectedWeekdays = () => {
    const selectedWeekdayButtons = $('.rdates-weekday.active');

    return selectedWeekdayButtons.map((i, button) => {
      const value = button.getAttribute('data-dayofweek');
      return WEEKDAY_MAP[value];
    });
  };

  /**
   * Generates an RRule given the provided data.
   *
   * @param {string} frequency - The recurrence frequency.
   * @param {number} interval - The recurrence interval.
   * @param {Date} dtstart - The starting date of the recurrence.
   * @param {Date} until - The date the recurrence ends.
   *
   * @returns {RRule} - The generated RRule.
   */
  const generateRule = (frequency, interval, dtstart, until) => {
    const freq = FREQUENCY_MAP[frequency];
    const generator = {
      freq,
      interval,
      dtstart,
    };

    if (frequency === 'weeks') {
      generator.byweekday = getSelectedWeekdays();
    } else if (frequency === 'months') {
      const selectedOption = $('.rdates-monthly-on-select option:selected');
      const type = selectedOption.data('type');

      if (type === 'day') {
        generator.bymonthday = parseInt(selectedOption.val(), 10);
      } else if (type === 'pos') {
        const [pos, dayName] = selectedOption.val().split(' ');

        generator.byweekday = WEEKDAY_MAP[dayName.substring(0, 2).toUpperCase()];
        generator.bysetpos = parseInt(pos, 10);
      }
    }

    const endsOnRadio = $('#radio-ends-on');

    if (endsOnRadio.prop('checked')) {
      generator.until = until;
    } else {
      const countString = $('.ends-after-input').val();
      generator.count = parseInt(countString, 10);
    }

    return new RRule(generator);
  };

  /**
   * Generates a list of dates determined by the user's recurrence selections.
   *
   * @param {Date} startDate - The (start) date.
   * @param {Date|null} endDate - The ending date of the date range.
   * @param {Date} untilDate - The date the recurrence ends.
   *
   * @returns {Array<Date|DateRange>} - The list of dates or date ranges.
   */
  const generateDates = (startDate, endDate, untilDate) => {
    const intervalString = $('.rdates-interval-input').val();
    const selectedInterval = parseInt(intervalString, 10);

    const selectedFrequency = $('.rdates-frequency-select').val();

    const startDateRules = generateRule(selectedFrequency, selectedInterval, startDate, untilDate);
    const startDates = startDateRules.all();

    if (!endDate) {
      return startDates;
    }

    const endDateRules = generateRule(selectedFrequency, selectedInterval, endDate, untilDate);

    return endDateRules.all().map((end, i) => ({
      start: startDates[i],
      end,
    }));
  };

  /**
   * Handles the on click event of the done button and
   * calls the respective callback in the settings.
   *
   * @param {Config} config - The form config.
   */
  const onDoneClick = (config) => {
    const { startDate, endDate } = config;
    const untilDate = $('.ends-on-date-input').data('daterangepicker').startDate.toDate();

    dates = generateDates(startDate, endDate, untilDate);

    toggle();
    reset(config);

    config.onDoneClick(dates);
  };

  /**
   * Handles the on change event of the ends radio inputs.
   */
  const onEndsRadioInputChange = () => {
    $('.ends-input')
      .toggleClass('disabled')
      .prop('disabled', (i, val) => !val);
    $('.ends-after-input-label').toggleClass('disabled');
  };

  /**
   * Initializes the reactive behaviors of the form and its elements.
   *
   * @param {Config} config - The form config.
   */
  const init = (config) => {
    $('input[name="date"]').daterangepicker({
      singleDatePicker: true,
      minDate: config.startDate,
      locale: {
        format: 'MMM D, YYYY',
        daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        firstDay: 0,
      },
    });

    $('.rdates-frequency-select').on('change', function handler() { onFrequencySelectChange($(this)); });
    $('.rdates-weekday').on('click', function handler() { onWeekdayClick($(this), config); });
    $('input[type="radio"]').on('change', onEndsRadioInputChange);
    $('.rdates-cancel-btn').on('click', () => onCancelClick(config));
    $('.rdates-done-btn').on('click', () => onDoneClick(config));
  };

  /**
   *
   * Initializes a recurring dates generation form.
   * Can generate recurring dates or recurring date ranges if an end date is provided.
   *
   * @param {jQuery} $element - The element that will trigger the form.
   * @param {Config} config - Configuration config.
   */
  function core($element, config) {
    const defaultConfig = {
      startDate: new Date(),
      endDate: null,
      title: 'Set recurrence',
      onCancelClick: () => {},
      onDoneClick: () => {},
    };

    const settings = $.extend({}, defaultConfig, config);

    create(settings);
    init(settings);
    reset(settings);

    $element.on('click', toggle);
  }

  /**
   * Removes the recurring dates form from the document.
   */
  const destroy = () => $('.rdates-container').remove();

  /**
   * Sets a new start date for the recurring dates form.
   *
   * @param {Date} date - The new start date.
   * @param {Config} config - The current form config.
   *
   * @returns {Config} - The new config.
   */
  const setStartDate = (date, config) => {
    const newConfig = { ...config };

    newConfig.startDate = date;

    destroy();
    create(config);
    init(config);
    reset(config);

    return config;
  };

  /**
   * Sets a new end date for the recurring dates form.
   *
   * @param {Date} date - The new end date.
   * @param {Config} config - The current form config.
   *
   * @returns {Config} - The new config.
   */
  const setEndDate = (date, config) => {
    const newConfig = { ...config };

    newConfig.endDate = date;

    destroy();
    create(newConfig);
    init(newConfig);
    reset(newConfig);

    return newConfig;
  };

  /**
  * Initializes the rdates jQuery plugin.
  */
  $.fn.extend({
    rdates(config) {
      let newConfig = { ...config };

      const setStartDateFn = (date) => { newConfig = setStartDate(date, newConfig); };
      const setEndDateFn = (date) => { newConfig = setEndDate(date, newConfig); };
      const getResults = () => dates;

      this.setStartDate = setStartDateFn;
      this.setEndDate = setEndDateFn;
      this.results = getResults;

      return this.each(() => core($(this), config));
    },
  });

  const testingModule = {
    toggle,
    create,
    onFrequencySelectChange,
    getDayOfWeek,
    onWeekdayClick,
    isLastOccurenceOfWeekdayInMonth,
    reset,
    onCancelClick,
    getSelectedWeekdays,
    generateRule,
    generateDates,
    onDoneClick,
    onEndsRadioInputChange,
    init,
    core,
    destroy,
    setStartDate,
    setEndDate,
  };

  $.extend({ rdatesTestingModule: testingModule });
})($);

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  const { rdatesTestingModule } = $;
  module.exports = rdatesTestingModule;
}
