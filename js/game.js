function loaded () {
	var context = null;
	var global = {};
	var rocket = {
		x: 0,
		y: 0,
		width: 20,
		height: 30,
		xSpeed: 0,
		ySpeed: 0,
		speed: 5,
		draw : null,
		up: null,
		down: null,
		left: null,
		right: null,
		update: null
	};

	rocket.draw = function() {
		context.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);
	};

	rocket.up = function(status) {
		if (status == "pressed") {
			rocket.ySpeed = -rocket.speed;
		} else{
			rocket.ySpeed = 0;
		};
	};

	rocket.down = function(status) {
		if (status == "pressed") {
			rocket.ySpeed = rocket.speed;
		} else{
			rocket.ySpeed = 0;
		};
	};

	rocket.left = function(status) {
		if (status == "pressed") {
			rocket.xSpeed = -rocket.speed;
		} else{
			rocket.xSpeed = 0;
		};
	};

	rocket.right = function(status) {
		if (status == "pressed") {
			rocket.xSpeed = rocket.speed;
		} else{
			rocket.xSpeed = 0;
		};
	};

	rocket.update = function() {
		rocket.x += rocket.xSpeed;
		rocket.y += rocket.ySpeed;
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
		var canvas = document.getElementById('game-canvas');
		context = canvas.getContext('2d');
		global.width = canvas.width = window.innerWidth;
		global.height = canvas.height = window.innerHeight;

		document.addEventListener('keydown', keydown);
		document.addEventListener('keyup', keyup);
	};

	function update () {
		rocket.update();
	};
	
	function draw () {
		context.clearRect(0, 0, global.width, global.height);
		rocket.draw();
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
