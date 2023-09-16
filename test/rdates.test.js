import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
} from 'bun:test';

process.env.NODE_ENV = 'test';

const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

global.document = dom.window.document;
global.window = dom.window;
global.$ = require('jquery');
global.rrule = require('rrule');

const { normalizeString } = require('./utils');
const { expectedHtmlFromCreate } = require('./test-data');

const rdates = require('../src/rdates');

const {
  toggle,
  create,
  onFrequencySelectChange,
  getDayOfWeek,
  onWeekdayClick,
  isLastOccurenceOfWeekdayInMonth,
  softReset,
  onCancelClick,
  getSelectedWeekdays,
  generateRule,
  generateDates,
  onDoneClick,
  onEndsRadioInputChange,
  init,
  core,
  destroy,
  hardReset,
  setStartDate,
  setEndDate,
} = rdates;

const testToggle = () => {
  describe('starting test cases for toggle', () => {
    let $modal;

    beforeEach(() => {
      $modal = $('<div>');
      $modal.addClass('rdates-container');

      $('body').append($modal);
    });

    test('should add the "visible" class to the '
                + 'modal if it is not visible', () => {
      toggle();

      expect($modal.hasClass('visible')).toBe(true);
    });

    test('should remove the "visible" class from '
                + 'the modal if it is visible', () => {
      $modal.addClass('visible');

      toggle();

      expect($modal.hasClass('visible')).toBe(false);
    });
  });
};

const testCreate = () => {
  describe('starting test cases for create', () => {
    test('should append the correct HTML to the document body', () => {
      create({ title: 'test title' });

      const actualHtml = normalizeString(document.body.innerHTML);
      const expectedHtml = normalizeString(expectedHtmlFromCreate);

      expect(actualHtml).toEqual(expectedHtml);
    });

    test('should throw expected error if a config is not provided', () => {
      expect(create).toThrow(TypeError);
    });
  });
};

const testOnFrequencySelectChange = () => {
  describe('starting test cases for onFrequencySelectChange', () => {
    let $select;
    let $option;

    beforeEach(() => {
      $select = $('<select>');
      $option = $('<option>').val('test');

      $select.append($option);
      $select.val('test');
    });

    test('should add the "hidden" class to elements that do not '
                + 'match the selected option', () => {
      const $content = $('<div>')
        .attr('id', 'rdates-content-other')
        .addClass('content');

      $('body').append($select, $content);

      onFrequencySelectChange($select);

      expect($content.hasClass('hidden')).toBe(true);
    });

    test('should remove the "hidden" class from the elements that '
                + 'match the selected option', () => {
      const $content = $('<div>')
        .attr('id', 'rdates-content-test')
        .addClass('content hidden');

      $('body').append($select, $content);

      onFrequencySelectChange($select);

      expect($content.hasClass('hidden')).toBe(false);
    });

    test('should throw expected error if an element is not provided', () => {
      expect(onFrequencySelectChange).toThrow(Error);
    });

    test('should throw expected error if the element '
                + 'provided is not a jQuery element', () => {
      const fakeHtmlElement = document.createElement('div');

      expect(() => onFrequencySelectChange(fakeHtmlElement))
        .toThrow(Error);
    });
  });
};

const testGetDayOfWeek = () => {
  describe('starting test cases for getDayOfWeek', () => {
    test('returns the expected day of week string', () => {
      const fakeDate = new Date(2023, 8, 3);

      const dayOfWeek = getDayOfWeek(fakeDate);

      expect(dayOfWeek).toBe('SU');
    });

    test('should throw expected error if a date is not provided', () => {
      expect(getDayOfWeek).toThrow(Error);
    });

    test('should throw expected error if the '
                + 'passed argument is not a Date', () => {
      expect(() => getDayOfWeek(1)).toThrow(Error);
    });
  });
};

const testOnWeekdayClick = () => {
  describe('starting test cases for onWeekdayClick', () => {
    test('should not unselect the clicked weekday if it is the same weekday '
                + 'as the start date and is the only element selected', () => {
      const fakeConfig = { startDate: new Date(2023, 8, 3) };

      const $fakeWeekday = $('<div>')
        .addClass('rdates-weekday active')
        .attr('data-dayofweek', 'SU');

      $('body').append($fakeWeekday);

      onWeekdayClick($fakeWeekday, fakeConfig);

      expect($fakeWeekday.hasClass('active')).toBe(true);
    });

    test('should select the weekday of the start date if another weekday '
                + 'is unselected and it is the only selected weekday', () => {
      const fakeConfig = { startDate: new Date(2023, 8, 3) };

      const $fakeWeekday = $('<div>')
        .addClass('rdates-weekday active')
        .attr('data-dayofweek', 'MO');

      const $fakeWeekdayOfStartDate = $('<div>')
        .addClass('rdates-weekday')
        .attr('data-dayofweek', 'SU');

      $('body').append($fakeWeekday, $fakeWeekdayOfStartDate);

      onWeekdayClick($fakeWeekday, fakeConfig);

      expect($fakeWeekdayOfStartDate.hasClass('active')).toBe(true);
    });

    test('should toggle the weekday element', () => {
      const fakeConfig = { startDate: new Date(2023, 8, 3) };

      const $fakeWeekday = $('<div>')
        .addClass('rdates-weekday active')
        .attr('data-dayofweek', 'MO');

      const $fakeWeekdayOfStartDate = $('<div>')
        .addClass('rdates-weekday active')
        .attr('data-dayofweek', 'SU');

      $('body').append($fakeWeekday, $fakeWeekdayOfStartDate);

      onWeekdayClick($fakeWeekday, fakeConfig);

      expect($fakeWeekday.hasClass('active')).toBe(false);
    });

    test('should throw expected error when a config is not provided', () => {
      const $fakeWeekday = $('<div>')
        .addClass('rdates-weekday active')
        .attr('data-dayofweek', 'SU');

      $('body').append($fakeWeekday);

      expect(() => onWeekdayClick($fakeWeekday)).toThrow(Error);
    });

    test('should throw expected error when '
                + 'an element is not provided', () => {
      const fakeConfig = { startDate: new Date(2023, 8, 3) };

      expect(() => onWeekdayClick(null, fakeConfig)).toThrow(Error);
    });
  });
};

const testIsLastOcurrenceOfWeekdayInMonth = () => {
  describe('starting test cases for isLastOcurrenceOfWeekdayInMonth', () => {
    test('should return true if the date is the last occurrence '
                + 'of its weekday in its month', () => {
      const fakeDate = new Date(2023, 7, 31);

      const isLastOccurrence = isLastOccurenceOfWeekdayInMonth(fakeDate);

      expect(isLastOccurrence).toBe(true);
    });

    test('should return false if the date is not the last ocurrence '
                + 'of its weekday in its month', () => {
      const fakeDate = new Date(2023, 8, 1);

      const isLastOccurrence = isLastOccurenceOfWeekdayInMonth(fakeDate);

      expect(isLastOccurrence).toBe(false);
    });

    test('should throw expected error if a date is not provided', () => {
      expect(isLastOccurenceOfWeekdayInMonth).toThrow(Error);
    });

    test('should throw expected error if the provided '
                + 'argument is not a date', () => {
      expect(() => isLastOccurenceOfWeekdayInMonth(1)).toThrow(Error);
    });
  });
};

describe('starting test cases for rdates', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  testToggle();
  testCreate();
  testOnFrequencySelectChange();
  testGetDayOfWeek();
  testOnWeekdayClick();
  testIsLastOcurrenceOfWeekdayInMonth();
});
