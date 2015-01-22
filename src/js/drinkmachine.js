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
  ]
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
    for (var i = 1; i < slotResults.length + 1; i++) {
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
    $(options.reel + ':nth-of-type(odd)').addClass(options.spin);
    $(options.reel + ':nth-of-type(even)').addClass(options.reverseSpin);
    $(options.playButton).off('click');
    setTimeout(function() {
      drinkMachine.endSpin();
    }, 5000);
  },

  endSpin: function() {
    $(options.reel).removeClass(options.spin + ' ' + options.reverseSpin);
    this.setupButtonHandler();
    this.setOffsets();
    this.setHasWon();
    console.log(this.getHasWon());
  },

  setupButtonHandler: function() {
    var drinkMachine = this;
    $(options.playButton).on('click', function() {
      drinkMachine.startSpin();
    });
  },

  reset: function() {
    var offsetClasses = [
      'is-' + slotMappings[0] ,
      'is-' + slotMappings[1],
      'is-' + slotMappings[2]
    ]
    if (slotResults.length > 0) {
      slotResults = [];
    }
    $().each(function() {
      $(this).removeClass(offsetClasses.join(' '));
    });
  }
};

module.exports = DrinkMachine;
