WHIZZY.namespace("modules.Scene");

WHIZZY.modules.Scene = ( function() {
	var Background = WHIZZY.modules.Background,
	Entity = WHIZZY.modules.Entity,
	TransitionNode = WHIZZY.modules.TransitionNode;

	function Scene(parameters) {
		Entity.call(this, parameters);
		this.content = [];
		this.id = parameters.id;
		if (parameters.background_params) {
			this.background = new Background({
				size: {x:this.size.x, y: this.size.y},
				position: {x: 0, y: 0},
				fillStyle: parameters.background_params.fillStyle,
				strokeStyle: parameters.background_params.strokeStyle,
				lineWidth: parameters.background_params.lineWidth,
				imageSrc: parameters.background_params.imageSrc,
				imageX: parameters.background_params.imageX,
				imageY: parameters.background_params.imageY,
				imageRepeat: parameters.background_params.imageRepeat,
				fixed: parameters.background_params.fixed
			});
		}
	};

	Scene.prototype = Object.create(Entity.prototype, {
		addObject:{
			value: function(content) {
				this.content.push(content);
			}
		},
		draw: {
			value: function(context) {
				context.save();
				context.translate(this.position.x, this.position.y);
				context.scale(this.scale, this.scale);
				context.rotate(this.rotation);

				if (this.background) this.background.draw(context);

				for(var c in this.content)
				{
					this.content[c].ghost = this.ghost;
					this.content[c].draw(context);
					this.content[c].ghost = false;
				}

				this.drawHover(context);
				context.restore();
			}
		},
		contentHover: {
			value: function(mouse) {
				var hoveredEntities = [];
				mouse.x = mouse.x*(1/this.scale);
				mouse.y = mouse.y*(1/this.scale);
				for(var c in this.content)
				{
					hoveredEntities = hoveredEntities.concat(this.content[c].mouseHover(mouse));
				}
				return hoveredEntities;
			}
		},
		getNode: {
			value: function() {
				return new TransitionNode({
					position: this.position,
					rotation: this.rotation,
					scale: this.scale,
					sequenced: false
				});
			}
		}
	});

	Scene.prototype.constructor = Scene;
	return Scene;
}());