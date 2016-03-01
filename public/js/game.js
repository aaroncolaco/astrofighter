function loaded () {

	"use strict"
	
	var context = null, canvas, global = {};
	var friction = 0.95;
	var meteor = [], bullet = [];
	
	global.initialMeteorNumber = 8;
	global.meteorSizeLarge = 70;
	global.meteorSizeMedium = 50;
	global.meteorSizeSmall = 30;
	
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

	var Meteor = function(meteorSize) {
		this.sprite = document.getElementById('asteroid');
		this.x = Math.random() * global.width;
		this.y = Math.random() * global.height;
		this.width = meteorSize;
		this.height = meteorSize;
		this.speed = 0;
		this.xmovement = Math.random() * 2;
		this.ymovement = Math.random() * 2;
		this.angle = 30;
		this.rotating = false;
		this.clkwise = true;
	};

	var Bullet = function() {
		this.sprite = document.getElementById('bullet');   /*Place this in init func*/
		/*Added integers to align to tip of rocket. Check by commenting out update func*/
		this.x = rocket.x + 1 ;
		this.y = rocket.y + 6.5 ;
		this.width = 5 ;
		this.height = 5 ;
		this.speed = 7 ;
		this.angle = rocket.angle;
		this.hit = false;
	};

	Bullet.prototype.draw = function() {
		context.drawImage(this.sprite, this.x, this.y, this.width, this.height);
	};

	Bullet.prototype.update = function() {
		this.x += Math.sin(this.angle*(Math.PI/180))*this.speed;
		this.y += Math.cos(this.angle*(Math.PI/180))*this.speed*-1;

		/*Collision detection between bullet & meteor*/
			for (let met of meteor) {
			/*if 'in' is used, met => index no. With 'of', met => values(object)*/
				if ( (Math.abs(this.x - met.x) < 25) && (Math.abs(this.y - met.y) < 25) && (this.hit === false) ) {
					console.log("BOOMMMMMM!");

					// Get hit meteor's metadata
					let meteorSize = met.width;

					// Bullet & Meteor vanish
					this.sprite = document.getElementById('null');
					met.sprite = document.getElementById('null');

					// Remove bullet & meteor from their arrays
					bullet.splice(bullet.indexOf(this), 1);
					meteor.splice(meteor.indexOf(met), 1);

					// Break Meteor based on size
					switch(meteorSize) {
						case global.meteorSizeLarge:
							addMeteors(global.meteorSizeMedium);
							break;
						case global.meteorSizeMedium:
							addMeteors(global.meteorSizeSmall);
							break;
						case global.meteorSizeSmall:
							break;
						default:
							console.log("Meteor size is undetermined")
							break;
					}

					function addMeteors (newMeteorSize) {
						
						// Insert two new meteors
						for(let i = 0; i < 2; i++) {

							meteor.push(new Meteor(newMeteorSize));
							
							// Spawning the new meteors at different locations after breaking
							if(i === 1) {
								meteor[meteor.length - 1].x = met.x + 5;
								meteor[meteor.length - 1].y = met.y + 5;
							} else {
								meteor[meteor.length - 1].x = met.x - 5;
								meteor[meteor.length - 1].y = met.y - 5;
							}
						}
					};

					// Making sure one bullet's hit is registered only once
					this.hit = true;
				};
			};
	};
	

	Meteor.prototype.draw = function() {
		context.drawImage(this.sprite, this.x, this.y, this.width, this.height);
	};

	Meteor.prototype.update = function() {
			
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

		/*Collision detection with rocket*/
		if ( (Math.abs(this.x - rocket.x) < 30) && (Math.abs(this.y - rocket.y) < 30) ) {
			console.log("You crashed!");
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
		let key = event.keyCode;
		
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
			case global.space:
				bullet.push(new Bullet());
				break;
		}
	};

	function keyup (event) {
		let key = event.keyCode;
		
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
		global.space = 32;

		rocket.x = (rocket.width + global.width)/2;
		rocket.y = (rocket.height + global.height)/2;

		rocket.spriteNormal = document.getElementById('rocket-normal');
		rocket.spriteMoving = document.getElementById('rocket-moving');

		for (let i = 0; i < global.initialMeteorNumber; i++) {
			meteor.push(new Meteor(global.meteorSizeLarge));
		}; 

		document.addEventListener('keydown', keydown);
		document.addEventListener('keyup', keyup);
	};

	function update () {
		rocket.update();

		for (let met of meteor) {
			met.update();
		};
	
		for(let shot of bullet) {
			shot.update();
		};

	};
	
	function draw () {
		// clear full context to redraw new stuff
		context.clearRect(0, 0, global.width, global.height);
		rocket.draw();

		for (let met of meteor) {
			met.draw();
		};

		for (let shot of bullet) {
			shot.draw()
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
