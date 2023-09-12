const expectedHtmlFromCreate = `
  <div class="rdates-container">
    <div class="rdates">
      <h2 class="rdates-title">test title</h2>
      <div class="rdates-main-content">
        <div class="rdates-repeat-every row">
          <span>Repeat every</span>
          <input 
            class="rdates-interval-input" 
            type="number"
            value="1"
            min="1">
          <select class="rdates-frequency-select">
            <option value="days">days</option>
            <option value="weeks">weeks</option>
            <option value="months">months</option>
            <option value="years">years</option>
          </select>
        </div>
        <div
          id="rdates-content-weeks" 
          class="rdates-week-container hidden content">
          <div class="rdates-repeat-on-text">Repeat on</div>
          <div class="rdates-weekdays-container row">
            <span class="rdates-weekday" data-dayofweek="SU">
            S
            </span>
            <span class="rdates-weekday" data-dayofweek="MO">
            M
            </span>
            <span class="rdates-weekday" data-dayofweek="TU">
            T
            </span>
            <span class="rdates-weekday" data-dayofweek="WE">
            W
            </span>
            <span class="rdates-weekday" data-dayofweek="TH">
            T
            </span>
            <span class="rdates-weekday" data-dayofweek="FR">
            F
            </span>
            <span class="rdates-weekday" data-dayofweek="SA">
            S
            </span>
          </div>
        </div>
        <div 
          id="rdates-content-months" 
          class="rdates-month-container hidden content">
          <select class="rdates-monthly-on-select"></select>
        </div>
        <div class="rdates-ends-text">Ends</div>
        <div class="rdates-ends-radio-group">
          <div class="rdates-ends-on">
            <div class="radio-ends-on-container">
              <input
                type="radio"
                id="radio-ends-on"
                class="radio-ends-on"
                name="ends"
                value="on"
                checked="">
            </div>
            <label for="radio-on" class="radio-ends-on-label">
            On
            </label>
            <input 
              id="ends-on-date-input" 
              class="ends-on-date-input ends-input" 
              name="date">
          </div>
          <div class="rdates-ends-after">
            <div class="radio-ends-after-container">
              <input
                type="radio"
                id="radio-ends-after"
                class="radio-ends-after"
                name="ends"
                value="on">
            </div>
            <label for="radio-after" class="radio-ends-after-label">
            After
            </label>
            <input 
              id="ends-after-input"
              class="ends-after-input ends-input disabled"
              type="number"
              min="1"
              value="1"
              disabled="">
            <label 
              for="ends-after-input" 
              class="ends-after-input-label disabled">
            occurrences
            </label>
          </div>
        </div>
        <div class="rdates-control-button-group">
          <button class="rdates-cancel-btn">Cancel</button>
          <button class="rdates-done-btn">Done</button>
        </div>
      </div>
    </div>
  </div>
`;

module.exports = {
  expectedHtmlFromCreate,
};
