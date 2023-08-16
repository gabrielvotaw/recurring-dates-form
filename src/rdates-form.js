(($) => {
  $.fn.rDatesForm = function(options) {
    const defaultOptions = {
      start: new Date(),
      end: null,
      title: 'Set recurrence'
    }

    const settings = $.extend({}, defaultOptions, options);

    return this.each(function() {
      const $element = $(this);
      populateForm($element, settings);
    });
  }

  const populateForm = (el, settings) => {
    const html = `
      <div class="rdate-form-sgn">
        <div>${settings.title}</div>
      </div>
    `;

    el.append(html);
  }
})(jQuery);

$('#my-form').rDatesForm();
