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
		accelerate: false,
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
		this.dimension = Math.random();
		this.width = 20 + this.dimension * 50;
		this.height = 30 + this.dimension * 50;
		this.speed = 0;
		this.xmovement = Math.random() / 3;
		this.ymovement = Math.random() / 3;
		this.angle = 30;
		this.rotating = false;
		this.clkwise = true;
	};

	var Bullet = function() {
		this.sprite = null;
		this.x = null;
		this.y = null;
		this.width = 5 ;
		this.height = 5 ;
		this.speed = 0;
	};

	Bullet.prototype.draw = function() {

	};

	Bullet.prototype.update = function() {
		
	};

	/*for collisions*/
	var intersectRect = function(a, b) {
		
	}

	Meteor.prototype.draw = function() {
		context.drawImage(this.sprite, this.x, this.y, this.width, this.height);
	};

	Meteor.prototype.update = function() {

		for (var i = 0; i < meteor.length; i++) {
			
			this.x += this.xmovement;
			this.y += this.ymovement;

			//to wrap the asteroids
			if (this.x > global.width) {
				this.x = 0;
			} else if (this.x < 0) {
				this.x = global.width;
			} else if (this.y > global.height) {
				this.y = 0;
			} else if (this.y < 0) {
				this.y = global.height;
			};
		};
	};

	rocket.up = function(status) {
		if (status == "pressed") {
			rocket.move = true;
			rocket.accelerate = true;
		} else {
			rocket.accelerate = false;
		};
	};

	rocket.down = function() {
		rocket.accelerate = false;
		rocket.move = false;
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

	rocket.update = function() {

		if (rocket.move) {
			rocket.x += Math.sin(rocket.angle*(Math.PI/180))*rocket.speed;
			rocket.y += Math.cos(rocket.angle*(Math.PI/180))*rocket.speed*-1;

			//place outside this 'if' to make it turn even when not moving
			if (rocket.rotating) {
				if (rocket.clkwise) {
					rocket.angle += 5;					
				} else {
					rocket.angle -= 5;
				}
			};
		} else {
			rocket.speed = 0;
		};

		if (rocket.accelerate) {
			rocket.speed = 5; /*Speed drops to 0 when nothing is done. This is to reset it to value*/
		} else {
			rocket.speed *= friction;
		};

		/*Due to friction speed drops. When it goes below treshhold, move = false 
			so that sprite image is changed*/
		if (rocket.speed <= 0.3) {
			rocket.move = false;
		};

		//rocket wrap around
		if (rocket.x > global.width) {
			rocket.x = 0;
		} else if (rocket.x < 0) {
			rocket.x = global.width;
		} else if (rocket.y > global.height) {
			rocket.y = 0;
		} else if (rocket.y < 0) {
			rocket.y = global.height;
		};
	}

	function keydown (event) {
		var key = event.keyCode;
		
		switch (key) {
			case global.left:
				rocket.left('pressed');
				break;
			case global.up:
				rocket.up('pressed');
				break;
			case global.right: 
				rocket.right('pressed');
				break;
			case global.down:
				rocket.down();
				break;
		}
	};

	function keyup (event) {
		var key = event.keyCode;
		
		switch (key) {
			case global.left:
				rocket.left('released');
				break;
			case global.up:
				rocket.up('released');
				break;
			case global.right: 
				rocket.right('released');
				break;
		}
	};

	function init () {
		canvas = document.getElementById('game-canvas');
		context = canvas.getContext('2d');
		global.width = canvas.width = window.innerWidth;
		global.height = canvas.height = window.innerHeight;
		global.left = 37, global.up = 38, global.right = 39, global.down = 40;

		rocket.x = (rocket.width + global.width)/2;
		rocket.y = (rocket.height + global.height)/2;

		rocket.spriteNormal = document.getElementById('rocket-normal');
		rocket.spriteMoving = document.getElementById('rocket-moving');

		for (var i = 0; i < global.meteorNumber; i++) {
			meteor.push(new Meteor());
			meteor[i].sprite = document.getElementById('asteroid');
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
