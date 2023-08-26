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

const rdates = require('../src/rdates');

const {
  toggle,
  create,
  onFrequencySelectChange,
  onWeekdayClick,
  reset,
  onCancelClick,
  init,
  core,
} = rdates;

const testToggle = () => {
  describe('starting test cases for toggle', () => {
    let modal;

    beforeEach(() => {
      modal = document.createElement('div');
      modal.classList.add('rdates-container');

      document.body.appendChild(modal);
    });

    it('should add the "visible" class to the modal if it is not visible', () => {
      toggle();

      expect(modal.classList.contains('visible')).to.equal(true);
    });

    it('should remove the "visible" class from the modal if it is visible', () => {
      modal.classList.add('visible');

      toggle();

      expect(modal.classList.contains('visible')).to.equal(false);
    });
  });
};

const testCreate = () => {
  describe('starting test cases for create', () => {
  });
};

describe('starting test cases for rdates', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  testToggle();
  testCreate();
});
