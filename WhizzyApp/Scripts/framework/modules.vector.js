WHIZZY.namespace("modules.Vector");

WHIZZY.modules.Vector = ( function() {
	// Dependencies
	var Debug = WHIZZY.utilities.debugger;

	function Vector(pX, pY) {
		//Variables
		this.x = pX;
		this.y = pY;
	};

	Vector.prototype.add = function(vector2) {
		return new Vector(this.x + vector2.x, this.y + vector2.y);
	};

	Vector.prototype.subtract = function(vector2) {
		return new Vector(this.x - vector2.x, this.y - vector2.y);
	};

	Vector.prototype.divide = function(denominator) {
		//return new Vector(this.x / vector2.x, this.y / vector2.y);
		return new Vector(this.x / denominator, this.y / denominator);
	};

	Vector.prototype.multiply = function(factor) {
		return new Vector(this.x * factor, this.y * factor);
	};

	Vector.prototype.rotate = function(theta) {
		// http://en.wikipedia.org/wiki/Rotation_(mathematics)
		// x = x cos theta - y sin theta
		// y = x sin theta + y cos theta
		var x = this.x * Math.cos(theta) - this.y * Math.sin(theta),
			y = this.x * Math.sin(theta) + this.y * Math.cos(theta);

		return new Vector(x,y);
	};

	Vector.prototype.copy = function() {
		return new Vector(this.x, this.y);
	};

	Vector.prototype.getScalar = function (vector2) {
		return (this.x * vector2.x) + (this.y * vector2.y);
	};

	Vector.prototype.getMagnitude = function() {
		return Math.sqrt( (this.x * this.x) + (this.y * this.y));
	};

	Vector.prototype.getAngleWith = function(vector2) {

		var numerator = this.getScalar(vector2);
		var denominator = this.getMagnitude() * vector2.getMagnitude();
		var cosTheta = numerator / denominator;
		var theta = Math.acos(cosTheta);

		return theta;
	};

	return Vector;
}());