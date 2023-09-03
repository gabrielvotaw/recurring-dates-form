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

/**
 * Test suite for the toggle function.
 */
const testToggle = () => {
    describe('starting test cases for toggle', () => {
        let $modal;

        beforeEach(() => {
            $modal = $('<div>');
            $modal.addClass('rdates-container');

            $('body').append($modal);
        });

        it('should add the "visible" class to the '
                + 'modal if it is not visible', () => {
            toggle();

            expect($modal.hasClass('visible')).to.equal(true);
        });

        it('should remove the "visible" class from '
                + 'the modal if it is visible', () => {
            $modal.addClass('visible');

            toggle();

            expect($modal.hasClass('visible')).to.equal(false);
        });
    });
};

/**
 * Test suite for the create function.
 */
const testCreate = () => {
    describe('starting test cases for create', () => {
        it('should append the correct HTML to the document body', () => {
            create({ title: 'test title' });

            const actualHtml = normalizeString(document.body.innerHTML);
            const expectedHtml = normalizeString(expectedHtmlFromCreate);

            expect(actualHtml).to.equal(expectedHtml);
        });

        it('should throw expected error if a config is not provided', () => {
            expect(create).throws(TypeError);
        });
    });
};

/**
 * Test suite for the onFrequencySelectChange function.
 */
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

        it('should add the "hidden" class to elements that do not '
                + 'match the selected option', () => {
            const $content = $('<div>')
                .attr('id', 'rdates-content-other')
                .addClass('content');

            $('body').append($select, $content);

            onFrequencySelectChange($select);

            expect($content.hasClass('hidden')).to.equal(true);
        });

        it('should remove the "hidden" class from the elements that '
                + 'match the selected option', () => {
            const $content = $('<div>')
                .attr('id', 'rdates-content-test')
                .addClass('content hidden');

            $('body').append($select, $content);

            onFrequencySelectChange($select);

            expect($content.hasClass('hidden')).to.equal(false);
        });

        it('should throw expected error if an element is not provided', () => {
            expect(onFrequencySelectChange).throws(Error);
        });

        it('should throw expected error if the element '
                + 'provided is not a jQuery element', () => {
            const fakeHtmlElement = document.createElement('div');

            expect(() => onFrequencySelectChange(fakeHtmlElement))
                .throws(Error);
        });
    });
};

/**
 * Test suite for the getDayOfWeek function.
 */
const testGetDayOfWeek = () => {
    describe('starting test cases for getDayOfWeek', () => {
        it('returns the expected day of week string', () => {
            const fakeDate = new Date(2023, 8, 3);

            const dayOfWeek = getDayOfWeek(fakeDate);

            expect(dayOfWeek).to.equal('SU');
        });

        it('should throw expected error if a date is not provided', () => {
            expect(getDayOfWeek).throws(Error);
        });

        it('should throw expected error if the '
                + 'passed argument is not a Date', () => {
            expect(() => getDayOfWeek(1)).throws(Error);
        });
    });
};

/**
 * Test suite for the onWeekdayClick function.
 */
const testOnWeekdayClick = () => {
    describe('starting test cases for onWeekdayClick', () => {
        it('should not unselect the clicked weekday if it is the same weekday '
                + 'as the start date and is the only element selected', () => {
            const fakeConfig = { startDate: new Date(2023, 8, 3) };

            const $fakeWeekday = $('<div>')
                .addClass('rdates-weekday active')
                .attr('data-dayofweek', 'SU');

            $('body').append($fakeWeekday);

            onWeekdayClick($fakeWeekday, fakeConfig);

            expect($fakeWeekday.hasClass('active')).to.equal(true);
        });

        it('should select the weekday of the start date if another weekday '
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

            expect($fakeWeekdayOfStartDate.hasClass('active')).to.equal(true);
        });

        it('should toggle the weekday element', () => {
            const fakeConfig = { startDate: new Date(2023, 8, 3) };

            const $fakeWeekday = $('<div>')
                .addClass('rdates-weekday active')
                .attr('data-dayofweek', 'MO');

            const $fakeWeekdayOfStartDate = $('<div>')
                .addClass('rdates-weekday active')
                .attr('data-dayofweek', 'SU');

            $('body').append($fakeWeekday, $fakeWeekdayOfStartDate);

            onWeekdayClick($fakeWeekday, fakeConfig);

            expect($fakeWeekday.hasClass('active')).to.equal(false);
        });

        it('should throw expected error when a config is not provided', () => {
            const $fakeWeekday = $('<div>')
                .addClass('rdates-weekday active')
                .attr('data-dayofweek', 'SU');

            $('body').append($fakeWeekday);

            expect(() => onWeekdayClick($fakeWeekday)).throws(Error);
        });

        it('should throw expected error when '
                + 'an element is not provided', () => {
            const fakeConfig = { startDate: new Date(2023, 8, 3) };

            expect(() => onWeekdayClick(null, fakeConfig)).throws(Error);
        });
    });
};

/**
 * Test suite for the isLastOccurrenceOfWeekdayInMonth function.
 */
const testIsLastOcurrenceOfWeekdayInMonth = () => {
    describe('starting test cases for isLastOcurrenceOfWeekdayInMonth', () => {
        it('should return true if the date is the last occurrence '
                + 'of its weekday in its month', () => {
            const fakeDate = new Date(2023, 7, 31);

            const isLastOccurrence = isLastOccurenceOfWeekdayInMonth(fakeDate);

            expect(isLastOccurrence).to.equal(true);
        });

        it('should return false if the date is not the last ocurrence '
                + 'of its weekday in its month', () => {
            const fakeDate = new Date(2023, 8, 1);

            const isLastOccurrence = isLastOccurenceOfWeekdayInMonth(fakeDate);

            expect(isLastOccurrence).to.equal(false);
        });

        it('should throw expected error if a date is not provided', () => {
            expect(isLastOccurenceOfWeekdayInMonth).throws(Error);
        });

        it('should throw expected error if the provided '
                + 'argument is not a date', () => {
            expect(() => isLastOccurenceOfWeekdayInMonth(1)).throws(Error);
        });
    });
};

/**
 * Test suite for the rdates jQuery plugin.
 */
describe('starting test cases for rdates', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    testToggle();
    testCreate();
    testOnFrequencySelectChange();
    testGetDayOfWeek();
    testOnWeekdayClick();
    testIsLastOcurrenceOfWeekdayInMonth();
});
