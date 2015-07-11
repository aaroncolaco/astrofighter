function loaded () {
	
	var context = null, canvas, global = {};
	var friction = 0.95;
	global.meteorNumber = 8;
	var meteor = [];
	
	var rocket = {
		spriteNormal: null,
		spriteMoving: null,
		x: 0,
		y: 0,
		width: 20,
		height: 30,
		speed: 0,
		angle: 90,
		move: false,
		moveFwd: false,
		moveBack: false,
		rotating: false,
		clkwise: true,
		draw : null,
		up: null,
		down: null,
		left: null,
		right: null,
		update: null
	};

	var Meteor = function() {
		this.sprite = null;
		this.x = Math.random() * global.width;
		this.y = Math.random() * global.height;
		this.dim = Math.random();
		this.width = 20 + this.dim * 50;
		this.height = 30 + this.dim * 50;
		this.speed = 0;
		this.angle = 30;
		this.rotating = false;
		this.clkwise = true;
	};

	Meteor.prototype.draw = function() {
		context.drawImage(this.sprite, this.x, this.y, this.width, this.height);
	};

	Meteor.prototype.update = function() {
		
	};

	rocket.draw = function() {
		context.translate(rocket.x, rocket.y); /*Translate context to rocket position. ie, get it to rocket pos.*/
		context.rotate(rocket.angle*(Math.PI/180)); /*Rotate context to angle required*/
		
		if (rocket.move) {
			context.drawImage(rocket.spriteMoving, 0, 0, rocket.width, rocket.height+4); /*Draw the image onto rotated context*/
		} else {
			context.drawImage(rocket.spriteNormal, 0, 0, rocket.width, rocket.height); /*Draw the image onto rotated context*/
		};
		
		context.rotate(rocket.angle*(Math.PI/180) * -1); /*Rotate context back to normal after drawing*/
		context.translate(-rocket.x, -rocket.y); /*Translate context back to old position*/
	};

	rocket.up = function(status) {
		if (status == "pressed") {
			rocket.move = true;
			rocket.moveFwd = true;
			rocket.moveBack = false;
		} else{
			rocket.move = false;
			// rocket.moveFwd = false;
		};
	};

	rocket.down = function(status) {
		if (status == "pressed") {
			rocket.move = true;
			rocket.moveBack = true;
			rocket.moveFwd = false;
		} else{
			rocket.move = false;
			// rocket.moveBack = false;
		};
	};

	rocket.left = function(status) {
		if (status == "pressed") {
			rocket.rotating = true;
			rocket.clkwise = false;
		} else{
			rocket.rotating = false;
		};
	};

	rocket.right = function(status) {
		if (status == "pressed") {
			rocket.rotating = true;
			rocket.clkwise = true;
		} else{
			rocket.rotating = false;
		};
	};

	rocket.update = function() {
		if (rocket.move) {
			if (rocket.rotating) {
				if (rocket.clkwise) {
					rocket.angle += 5;					
				} else {
					rocket.angle -= 5;
				}
			}
			rocket.speed = 5; /*Speed drops to 0 when nothing is done. This is to reset it to value*/
		}
		rocket.speed *= friction;

		if (rocket.moveFwd) {
			rocket.x += Math.sin(rocket.angle*(Math.PI/180))*rocket.speed;
			rocket.y += Math.cos(rocket.angle*(Math.PI/180))*rocket.speed*-1;
		} else {
			rocket.x -= Math.sin(rocket.angle*(Math.PI/180))*rocket.speed;
			rocket.y -= Math.cos(rocket.angle*(Math.PI/180))*rocket.speed*-1;
		};
	}

	function keydown (event) {
		var key = event.keyCode;
		var left = 37, up = 38, right = 39, down = 40;
		
		switch (key) {
			case left:
				rocket.left('pressed');
				break;
			case up:
				rocket.up('pressed');
				break;
			case right: 
				rocket.right('pressed');
				break;
			case down:
				rocket.down('pressed');
				break;
		}
	};

	function keyup (event) {
		var key = event.keyCode;
		var left = 37, up = 38, right = 39, down = 40;
		
		switch (key) {
			case left:
				rocket.left('released');
				break;
			case up:
				rocket.up('released');
				break;
			case right: 
				rocket.right('released');
				break;
			case down:
				rocket.down('released');
				break;
		}
	};

	function init () {
		canvas = document.getElementById('game-canvas');
		context = canvas.getContext('2d');
		global.width = canvas.width = window.innerWidth;
		global.height = canvas.height = window.innerHeight;

		rocket.x = (rocket.width + global.width)/2;
		rocket.y = (rocket.height + global.height)/2;

		rocket.spriteNormal = document.getElementById('rocket-normal');
		rocket.spriteMoving = document.getElementById('rocket-moving');

		for (var i = 0; i < global.meteorNumber; i++) {
			meteor.push(new Meteor());
			meteor[i].sprite = document.getElementById('asteroid') 
 		}; 
		document.addEventListener('keydown', keydown);
		document.addEventListener('keyup', keyup);
	};

	function update () {
		rocket.update();
		
		for (var i = 0; i < global.meteorNumber; i++) {
			meteor[i].update();
		};
	};
	
	function draw () {
		context.clearRect(0, 0, global.width, global.height);
		rocket.draw();
		for (var i = 0; i < global.meteorNumber; i++) {
			meteor[i].draw();
		};
	};

	init();
	
	var step = function (timestamp) {
		update();
		draw();
		window.requestAnimationFrame(step);
	};
	window.requestAnimationFrame(step);	
};

window.onload = loaded;
