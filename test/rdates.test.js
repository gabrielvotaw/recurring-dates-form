process.env.NODE_ENV = 'test';

const { JSDOM } = require('jsdom');

const dom = new JSDOM(
  '<!DOCTYPE html><html><body></body></html>',
  { runScripts: 'dangerously' },
);

global.document = dom.window.document;
global.window = dom.window;
global.$ = require('jquery');
global.rrule = require('rrule');

const { expect } = require('chai');

const utils = require('./utils');
const testData = require('./test-data');

const rdates = require('../src/rdates');

const {
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
} = rdates;

const testToggle = () => {
  describe('starting test cases for toggle', () => {
    let $modal;

    beforeEach(() => {
      $modal = $('<div>');
      $modal.addClass('rdates-container');

      $('body').append($modal);
    });

    it('should add the "visible" class to the modal if it is not visible', () => {
      toggle();

      expect($modal.hasClass('visible')).to.equal(true);
    });

    it('should remove the "visible" class from the modal if it is visible', () => {
      $modal.addClass('visible');

      toggle();

      expect($modal.hasClass('visible')).to.equal(false);
    });
  });
};

const testCreate = () => {
  describe('starting test cases for create', () => {
    it('should append the correct HTML to the document body', () => {
      create({ title: 'test title' });

      const normalizedActualHtml = utils.normalizeString(document.body.innerHTML);
      const normalizedExpectedHtml = utils.normalizeString(testData.expectedHtmlFromCreate);

      expect(normalizedActualHtml).to.equal(normalizedExpectedHtml);
    });
  });
};

const testOnFrequencySelectChange = () => {
  describe('starting test cases for onFrequencySelectChange', () => {
    it('should add the "hidden" class to elements that do not match the selected option', () => {
      const $select = $('<select>');
      const $option = $('<option>').val('test');

      $select.append($option);
      $select.val('test');

      const $content1 = $('<div>')
        .attr('id', 'rdates-content-test')
        .addClass('content');

      const $content2 = $('<div>')
        .attr('id', 'rdates-content-other')
        .addClass('content');

      $('body').append($select, $content1, $content2);

      onFrequencySelectChange($select);

      expect($content1.hasClass('hidden')).to.equal(false);
      expect($content2.hasClass('hidden')).to.equal(true);
    });
  });
};

describe('starting test cases for rdates', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  testToggle();
  testCreate();
  testOnFrequencySelectChange();
});
