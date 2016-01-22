
var red  = '-score-bad',
	orange = '-score-regular',
	yellow = '-score-medium',
	blue   = '-score-good',
	green  = '-score-best';

var colorRange = {
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

		for (var i = 0; i < this.indicator.rankSize; i++) {
			tier = this.indicator.rank[i].split('-');
			tierBegin = parseFloat(tier[0]);
			tierEnd = parseFloat(tier[1]);

			if (this.indicator.score >= tierBegin && this.indicator.score <= tierEnd) {
				if (this.indicator && this.indicator.colorRange) {
					return this.indicator.colorRange[i];
				}
			}
		}
	},

	getColor: function(ind) {
		var rank = ind.score_range.split(',');

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
