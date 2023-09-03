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

        it('should add the "visible" class to the'
                + 'modal if it is not visible', () => {
            toggle();

            expect($modal.hasClass('visible')).to.equal(true);
        });

        it('should remove the "visible" class from'
                + 'the modal if it is visible', () => {
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

            const actualHtml = normalizeString(document.body.innerHTML);
            const expectedHtml = normalizeString(expectedHtmlFromCreate);

            expect(actualHtml).to.equal(expectedHtml);
        });

        it('should throw expected error if a config is not provided', () => {
            expect(create).to.throw(TypeError);
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

        it('should add the "hidden" class to elements that do not'
                + 'match the selected option', () => {
            const $content = $('<div>')
                .attr('id', 'rdates-content-other')
                .addClass('content');

            $('body').append($select, $content);

            onFrequencySelectChange($select);

            expect($content.hasClass('hidden')).to.equal(true);
        });

        it('should remove the "hidden" class from the elements that'
                + 'match the selected option', () => {
            const $content = $('<div>')
                .attr('id', 'rdates-content-test')
                .addClass('content hidden');

            $('body').append($select, $content);

            onFrequencySelectChange($select);

            expect($content.hasClass('hidden')).to.equal(false);
        });

        it('should throw expected error if an element is not provided', () => {
            expect(onFrequencySelectChange).to.throw(Error);
        });

        it('should throw expected error if the element'
                + 'provided is not a jQuery element', () => {
            const fakeHtmlElement = document.createElement('div');

            expect(() => onFrequencySelectChange(fakeHtmlElement))
                .to.throw(Error);
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
