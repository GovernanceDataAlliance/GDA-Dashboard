
var red  = '-score-poor',
	orange = '-score-fair',
	yellow = '-score-moderate',
	blue   = '-score-good',
	green  = '-score-excellent';

var colorRange = {
  'range-2': [green, red],
	'range-3': [green, yellow, red],
	'range-4': [green, blue, orange, red],
	'range-5': [green, blue, yellow, orange, red]
};

var ColorService = {

	_getColorRange: function() {
		return colorRange['range-' + this.indicator.rankSize];
	},

	_reverseRange: function() {
		if (this.indicator && this.indicator['colorRange']) {
			return this.indicator['colorRange'].reverse();
		}
	},

	_setScoreColor: function() {
		var tier, tierBegin, tierEnd;

		if (this.indicator.direction == 'down') {
			this.indicator.colorRange = this._reverseRange();
		}

    // Range-2
    if (this.indicator.rankSize < 3) {

      for (var i = 0; i < this.indicator.rankSize; i++) {
        if (this.indicator.score == this.indicator.rank[i]) {
          return this.indicator.colorRange[i];
        }
      }

    } else {
      // Range 3 and highers
      for (var i = 0; i < this.indicator.rankSize; i++) {
        tier = this.indicator.rank[i].split('-');
        tierBegin = parseFloat(tier[0]);
        tierEnd = parseFloat(tier[1]);

        if (Number(this.indicator.score) >= Number(tierBegin) && Number(this.indicator.score) <= Number(tierEnd)) {
          if (this.indicator && this.indicator.colorRange) {
            return this.indicator.colorRange[i];
          }
        }
      }
    }

	},

	getColor: function(ind) {
		var rank = ind.score_range.split(',');

    if (ind.score == null || ind.score.toString().length === 0) {
      return;
    }

		this.indicator = {
			rankSize: rank.length,
			direction: ind.desired_direction,
			rank: rank,
			score: ind.score
		};

		this.indicator['colorRange'] = this._getColorRange();

		return this._setScoreColor();
	}

};

module.exports = ColorService;
