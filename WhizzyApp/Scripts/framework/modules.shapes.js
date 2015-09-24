WHIZZY.namespace("modules.Arc");

WHIZZY.modules.Arc = (function() {
	var Debug = WHIZZY.utilities.debugger,
		Entity = WHIZZY.modules.Entity,
		Vector = WHIZZY.modules.Vector;

	function Arc(parameters) {
		Entity.call(this, parameters);
		this.strokeStyle = parameters.strokeStyle;
		this.fillStyle = parameters.fillStyle;
		this.startAngle = parameters.startAngle;
		this.endAngle = parameters.endAngle;
		this.radius = parameters.radius;
		this.lineWidth = parameters.lineWidth || 1;
	};

	Arc.prototype = Object.create(Entity.prototype, {
		draw: {
			value: function(context) {
				context.save();
				context.translate(this.position.x, this.position.y);
				if (this.rotation) context.rotate(this.rotation);
				if (this.scale) context.scale(this.scale, this.scale);
				if (this.alpha != undefined) context.globalAlpha = this.alpha;

				context.lineWidth = this.lineWidth;
				context.lineCap = "round";
				context.beginPath();
				context.arc(0, 0, this.radius, this.startAngle, this.endAngle);

				var startVector = (new Vector(this.radius, 0)).rotate(this.startAngle),
					endVector = (new Vector(this.radius, 0)).rotate(this.endAngle);

				context.moveTo(0,0);
				context.lineTo(startVector.x, startVector.y);
				context.lineTo(endVector.x, endVector.y);
				context.lineTo(0,0);
				context.clip();

				if (this.strokeStyle) {
					context.strokeStyle = this.strokeStyle;
					context.stroke();
				}
				if (this.fillStyle) {
					context.fillStyle = this.fillStyle;
					context.fill();
				}

				this.drawHover(context);
				context.restore();
			}
		}
	});

	Arc.prototype.constructor = Arc;
	return Arc;
}());

WHIZZY.namespace("modules.Rectangle");

WHIZZY.modules.Rectangle = (function() {
	var Debug = WHIZZY.utilities.debugger,
		Entity = WHIZZY.modules.Entity;

	function Rectangle(parameters) {
		Entity.call(this, parameters);
		this.strokeStyle = parameters.strokeStyle;
		this.fillStyle = parameters.fillStyle;
		this.size = parameters.size;
		this.lineWidth = parameters.lineWidth || 1;
	};

	Rectangle.prototype = Object.create(Entity.prototype, {
		draw: {
			value: function(context) {
				context.save();
				context.translate(this.position.x, this.position.y);
				if (this.rotation) context.rotate(this.rotation);
				if (this.scale) context.scale(this.scale, this.scale);
				if (this.alpha != undefined) context.globalAlpha = this.alpha;

				if (this.fillStyle)
				{
					context.fillStyle = this.fillStyle;
					context.fillRect(-this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
				}
				if (this.strokeStyle)
				{
					context.lineWidth = this.lineWidth;
					context.strokeStyle = this.strokeStyle;
					context.strokeRect( -this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
				}

				this.drawHover(context);
				context.restore();
			}
		}
	});

	Rectangle.prototype.constructor = Rectangle;
	return Rectangle;
}());

WHIZZY.namespace("modules.Shape");

WHIZZY.modules.Shape = ( function() {
	var Entity = WHIZZY.modules.Entity;

	function Shape(parameters) {
		Entity.call(this, parameters);

		this.points = parameters.points;
		this.strokeStyle = parameters.strokeStyle;
		this.fillStyle = parameters.fillStyle;
		this.lineCap = parameters.lineCap || "round";
		this.lineWidth = parameters.lineWidth || 1;
	};

	Shape.prototype = Object.create(Entity.prototype, {
		draw: {
			value: function(context) {
				context.save();
				context.beginPath();

				context.moveTo(this.points[0].x, this.points[0].y);
				for (var i = 1; i < this.points.length; ++i)
				{
					context.lineTo(this.points[i].x, this.points[i].y);
				}
				
				
				if (this.fillStyle)
				{
					context.closePath();
					context.fillStyle = this.fillStyle;
					context.fill();
				} 
				if (this.strokeStyle) 
				{
					context.lineWidth = this.lineWidth;
					context.strokeStyle = this.strokeStyle;
					context.stroke();
				}

				context.restore();
			}
		}
	});

	Shape.prototype.constructor = Shape;
	return Shape; 
}());