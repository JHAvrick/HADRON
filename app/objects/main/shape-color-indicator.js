import Wave from 'fx/wave.js';

class ShapeColorIndicator extends Phaser.Sprite {
	constructor(game){
		super(game, game.width * .1, game.height / 2, 'sprites');
		this.game = game;
		this.anchor.setTo(.5, .5);
		this.alpha = 0;

		//var extraScale = (720 + window.extraWidth)

		this._revealFX = new IndicatorTransition(this.game);
		this._waveFX = new Wave(this.game, this.x, this.y, 'sprites', 'orb_00');

		this._anyColor = false;
		this.game.add.existing(this);
	}

	reveal(){
		this._revealFX.reveal(3);
	}

	enter(shape, color, onComplete = function(){}){
		//set frame
		this.frameName = shape + "Shape";

		//Set color
		if (!color) this._anyColor = true;
		else this.tint = color;

		//Transition in
		this._revealFX.start(() => {
			this._waveFX.explode(250, 7);

			this.alpha = 1;
			onComplete();

		});

		/*

		this.alpha = 0;
		this.game.add.tween(this).to({ alpha: 1 }, 500, Phaser.Easing.Quadratic.Out, true)
		.onComplete.addOnce(() => { 
			onComplete();
		});

		*/
	}

	exit(onComplete = function(){}){
		this.alpha = 0;
		this._anyColor = false;

		/*
		this.game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Quadratic.Out, true)
		.onComplete.addOnce(() => {
			
			onComplete();
		});
	*/

	}

	update(){
		this.angle -= 1;

		if (this._anyColor)
			this.tint = Phaser.Color.getRandomColor();
	}

}

class IndicatorTransition extends Phaser.Group {
	constructor(game){
		super(game);
		this.game = game;

		var hex = this.game.add.sprite(game.width / 9, game.height / 2, 'sprites', 'hexShape');
		var tri = this.game.add.sprite(game.width / 9, game.height / 2, 'sprites', 'triShape');
		var cube = this.game.add.sprite(game.width / 9, game.height / 2, 'sprites', 'cubeShape');
		var orb = this.game.add.sprite(game.width / 9, game.height / 2, 'sprites', 'orbShape');

		hex.update = function(){ this.angle += 10; }.bind(hex);
		tri.update = function(){ this.angle -= 10; }.bind(tri);
		cube.update = function(){ this.angle += 10; }.bind(cube);
		orb.update = function(){ this.angle -= 10; }.bind(orb);

		this.addMultiple([hex, tri, cube, orb]);
		this.setAll('anchor', {x: .5, y: .5});
		this.setAll('exists', false);
	}

	reveal(count = 2){
		var delay = 0;
		for (var i = 0; i < count; i++){
			this.forEach((sprite) => {
				sprite.scale.x = 2;
				sprite.scale.y = 2;
				sprite.alpha = 1;

				this.game.add.tween(sprite).to({ alpha: 0 }, 750, Phaser.Easing.Quadratic.Out, true, delay)
				.onStart.add(() => { sprite.exists = true; });

				this.game.add.tween(sprite.scale).to({ x: 0, y: 0 }, 750, Phaser.Easing.Quadratic.Out, true, delay)
				.onComplete.add(() => { sprite.exists = false; });

				delay += 200;
			});
		}
	}

	start(onComplete = function(){}){

		var count = 0;
		var delay = 0;
		this.forEach((sprite) => {
			count += 1;

			sprite.scale.x = 2.5;
			sprite.scale.y = 2.5;
			sprite.alpha = 1;

			this.game.add.tween(sprite).to({ alpha: 0 }, 750, Phaser.Easing.Quadratic.Out, true, delay)
			.onStart.add(() => {
				sprite.exists = true;
			});

			var tween = this.game.add.tween(sprite.scale).to({ x: 0, y: 0 }, 750, Phaser.Easing.Quadratic.Out, true, delay)
			
			tween.onComplete.add(() => { sprite.exists = false; });

			if (count === 2)
				tween.onComplete.add(() => { onComplete() });

			delay += 200;
		});
	}

	update(){
		this.setAll('tint', Phaser.Color.getRandomColor(), true, true);
	}

}

export default ShapeColorIndicator;
