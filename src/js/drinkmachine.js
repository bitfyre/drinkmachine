var $ = require('jquery');

var options = {
  reel: '.Reel',
  spin: 'Reel-spin',
  reverseSpin: 'Reel-reverseSpin',
  playButton: '.js-play',
  slotSize: 3,
  slotMappings: [
    'coffee',
    'tea',
    'espresso'
  ],
  kudos: '.js-kudos',
  kudosComponent: 'Kudos',
  appology: '.js-appology',
  hideClass: 'u-displayNone'
};

var slotResults = [];

var DrinkMachine = function() {
  this.setupButtonHandler();
};

DrinkMachine.prototype = {
  setSlotResults: function() {
    this.reset();
    for (var i = 0; i < options.slotSize; i++) {
      var num = this.getRandomNumber();
      var resultName = options.slotMappings[num - 1];
      slotResults.push(resultName);
    }
    console.log(slotResults);
  },

  getRandomNumber: function() {
    return Math.floor(Math.random() * (options.slotSize - 1 + 1)) + 1;
  },

  setOffsets: function() {
    $(options.reel).each(function(reelNum) {
      $(this).addClass('is-' + slotResults[reelNum]);
    });
  },

  setHasWon: function() {
    this.hasWon = false;
    for (var i = 1; i < slotResults.length; i++) {
      if (slotResults[i] != slotResults[i - 1]) {
        this.hasWon = false;
        return false;
      } else {
        this.hasWon = true;
      }
    }
  },

  getHasWon: function() {
    return this.hasWon;
  },

  startSpin: function() {
    var drinkMachine = this;
    this.setSlotResults();
    this.setHasWon();
    $(options.reel + ':nth-of-type(odd)').addClass(options.spin);
    $(options.reel + ':nth-of-type(even)').addClass(options.reverseSpin);
    $(options.playButton).off('click');
    setTimeout(function() {
      drinkMachine.endSpin();
    }, 2000);
  },

  endSpin: function() {
    $(options.reel).removeClass(options.spin + ' ' + options.reverseSpin);
    this.setupButtonHandler();
    this.setOffsets();
    this.renderFeedback()
  },

  setupButtonHandler: function() {
    var drinkMachine = this;
    $(options.playButton).on('click', function() {
      drinkMachine.startSpin();
    });
  },

  renderFeedback: function() {
    if (this.getHasWon()) {
      var $kudos = $(options.kudos)
      $kudos.removeClass(options.hideClass);
      $kudos.addClass(options.kudosComponent + '-' + slotResults[0]);
      $(options.playButton).addClass(options.hideClass);
    } else {
      $(options.appology).removeClass(options.hideClass);
    }
  },

  reset: function() {
    var offsetClasses = [
      'is-' + options.slotMappings[0],
      'is-' + options.slotMappings[1],
      'is-' + options.slotMappings[2]
    ]
    $(options.reel).each(function() {
      $(this).removeClass(offsetClasses.join(' '));
    });
    $(options.appology).addClass(options.hideClass);
    if (slotResults.length > 0) {
      // empty slotResults
      slotResults = [];
    }
  }
};

module.exports = DrinkMachine;
