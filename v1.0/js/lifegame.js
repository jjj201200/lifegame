function LifeGame(canvasId, lines, columns, livingCells) {
	game = this;
	this.speed = 100;
	this.map = new Map(lines, columns, livingCells);
	this.livingCells = livingCells <= this.map.mapSize ? livingCells : this.map.mapSize;
	this.intervalNumber = -1;
	this.canvasId = canvasId;
	this.canvas = document.getElementById(this.canvasId);
	this.cellWidth = this.cellHeight = null;
	this.mapWidth = 0;
	this.mapHeight = 0;

	this.colorList = {
		dieCell : '#D0D0D0',
		livingCell : '#FF6667',
		border : '#EBEBEB',
		background : '#D0D0D0'
	}

	this.context = game.canvas.getContext('2d');

	$("lines").value = game.map.lines;
	$("columns").value = game.map.columns;
	$("need_cells").value = game.livingCells;
	$("speed").innerHTML = game.speed;

	window.onresize = function() {
		windowWidth = window.innerWidth / 2;
		windowHeight = window.innerHeight;
		game.canvas.setAttribute('width', windowWidth);
		game.canvas.setAttribute('height', windowHeight);
		game.context = game.canvas.getContext('2d');
		game.ajustMapSize();
		game.render();
	};
	this.createMap = function(lines, columns, livingCells) {
		this.map = new Map(lines, columns, livingCells);
		this.ajustMapSize();
		$("lines").value = game.map.lines;
		$("columns").value = game.map.columns;
		$("need_cells").value = game.map.livingCells;
		$("living_cells").innerHTML = game.map.livingCells;
		this.render();
	}
	this.clearMap = function() {
		this.map = new Map(this.map.lines, this.map.columns, 0);

		this.render();
	}
	this.startGame = function() {
		this.ajustMapSize();
		this.loop(this.speed);
		$("startTaggle").innerHTML = "Stop";
		$("world_status").innerHTML = "Start";
	}
	this.ajustMapSize = function() {
		var width = window.innerWidth / 2;
		var height = window.innerHeight;
		game.canvas.setAttribute('width', width);
		game.canvas.setAttribute('height', height);
		if (game.canvas.height / game.map.lines > game.canvas.width / game.map.columns)
			game.cellWidth = game.cellHeight = game.canvas.width / game.map.columns;
		else {
			game.cellWidth = game.cellHeight = game.canvas.height / game.map.lines;
		}
		game.mapWidth = game.map.columns * game.cellWidth;
		game.mapHeight = game.map.lines * game.cellWidth;
		game.canvas.setAttribute('width', game.map.columns * game.cellWidth);
		game.canvas.setAttribute('height', game.map.lines * game.cellHeight);
	}
	this.loop = function(speed) {
		this.render();
		this.intervalNumber = setInterval(game.draw, speed == null ? 100 : speed);
		// game.intervalNumber = setTimeout(game.draw, speed == null ? 100 : speed);
	}
	this.stop = function() {
		clearInterval(this.intervalNumber);
		this.intervalNumber = -1;
		this.render();
		$("startTaggle").innerHTML = "Start";
		$("world_status").innerHTML = "Stop";
	}
	this.execute = function() {
		k = game.map.dynamicArray.length - 1;
		while (k >= 0) {
			cell = map.dynamicArray[k];
			i = cell.position.x;
			ii = cell.position.y;
			whichLine1 = (i + map.lines - 1) % map.lines;
			whichLine3 = (i + map.lines + 1) % map.lines;
			whichColumn1 = (ii + map.columns - 1) % map.columns;
			whichColumn3 = (ii + map.columns + 1) % map.columns;
			position = [[whichLine1, whichColumn1], [whichLine1, ii], [whichLine1, whichColumn3], [i, whichColumn1], [i, whichColumn3], [whichLine3, whichColumn1], [whichLine3, ii], [whichLine3, whichColumn3]];
			for ( p = 0; p < position.length; ++p) {++game.map.mapArray[position[p][0]][position[p][1]].livingCellsAround;
				if (!game.map.mapArray[position[p][0]][position[p][1]].opreated) {
					game.map.adjustArray.push(game.map.mapArray[position[p][0]][position[p][1]]);
					game.map.mapArray[position[p][0]][position[p][1]].opreated = 1;
				}
			}--k;
		}
		game.map.dynamicArray.length = 0;
		var i = game.map.adjustArray.length - 1;
		while (i >= 0) {
			if (game.map.adjustArray[i].currentStatus == 0 && game.map.adjustArray[i].livingCellsAround == 3) {
				game.map.adjustArray[i].nextStatus = 1; ++game.map.livingCells;
				// console.log(game.map.adjustArray[i].position.x + "," + game.map.adjustArray[i].position.y + "(" + game.map.adjustArray[i].currentStatus + "): " + game.map.adjustArray[i].livingCellsAround + "-> Living");
				game.map.dynamicArray.push(game.map.adjustArray[i]);
			} else if (game.map.adjustArray[i].currentStatus == 1 && (game.map.adjustArray[i].livingCellsAround < 2 || game.map.adjustArray[i].livingCellsAround > 3)) {
				game.map.adjustArray[i].nextStatus = 0; --game.map.livingCells;
				// console.log(game.map.adjustArray[i].position.x + "," + game.map.adjustArray[i].position.y + "(" + game.map.adjustArray[i].currentStatus + "): " + game.map.adjustArray[i].livingCellsAround + "-> Die");
			} else if (game.map.adjustArray[i].currentStatus == 1 && (game.map.adjustArray[i].livingCellsAround == 2 || game.map.adjustArray[i].livingCellsAround == 3)) {
				game.map.adjustArray[i].nextStatus = 1;
				game.map.dynamicArray.push(game.map.adjustArray[i]);
			} else {
				game.map.adjustArray[i].nextStatus = 0;
			}
			--i;
		}
	}
	this.changeCellStatus = function(cell) {
		if (cell != null)
			if (cell.currentStatus) {
				cell.currentStatus = 0; --game.map.livingCells;
				var dynamicArrayLength = game.map.dynamicArray.length;
				for (var i = 0; i < dynamicArrayLength; ++i) {
					if (cell.position.x == game.map.dynamicArray[i].position.x && cell.position.y == game.map.dynamicArray[i].position.y) {
						game.map.dynamicArray.splice(i, 1);
						break;
					}
				}
			} else {
				cell.currentStatus = 1;
				game.map.dynamicArray.push(cell);
			}
		game.map.livingCells = game.map.dynamicArray.length;
		cell.color = cell.currentStatus == 1 ? "#FF6667" : "#D0D0D0";
		game.render();
	}
	this.draw = function() {
		game.context.fillStyle = game.colorList.background;
		game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
		$("living_cells").innerHTML = game.map.livingCells;
		if (!game.map.livingCells) {
			game.stop();
		}
		game.execute();
		var adjustArrayLength = game.map.adjustArray.length;
		for (var i = 0; i < adjustArrayLength; ++i) {
			// if (game.map.adjustArray[i].nextStatus) {
				game.context.fillStyle = game.map.adjustArray[i].color;
				game.context.fillRect(game.map.adjustArray[i].position.y * game.cellWidth, game.map.adjustArray[i].position.x * game.cellHeight, game.cellWidth, game.cellHeight);
				game.map.adjustArray[i].currentStatus = game.map.adjustArray[i].nextStatus;
				game.map.adjustArray[i].livingCellsAround = 0;
				game.map.adjustArray[i].color = game.map.adjustArray[i].currentStatus == 1 ? "#FF6667" : "#D0D0D0";
			// }
		}
		game.context.strokeStyle = game.colorList.border;
		game.context.lineWidth = "1";
		for (var i = 0; i <= game.map.lines + 1; ++i) {
			game.context.beginPath();
			game.context.moveTo(0, i * game.cellHeight);
			game.context.lineTo(game.map.columns * game.cellWidth, i * game.cellHeight);
			game.context.stroke();
		}
		for (var i = 0; i <= game.map.columns + 1; ++i) {
			game.context.beginPath();
			game.context.moveTo(i * game.cellWidth, 0);
			game.context.lineTo(i * game.cellHeight, game.map.lines * game.cellHeight);
			game.context.stroke();
		}
	}
	this.render = function() {
		$("living_cells").innerHTML = game.map.livingCells;
		game.context.fillStyle = game.colorList.background;
		game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
		var i = game.map.dynamicArray.length - 1;
		while (i >= 0) {
			game.context.fillStyle = game.map.dynamicArray[i].color;
			game.context.fillRect(game.map.dynamicArray[i].position.y * game.cellWidth, game.map.dynamicArray[i].position.x * game.cellHeight, game.cellWidth, game.cellHeight);
			--i;
		}

		game.context.strokeStyle = game.colorList.border;
		game.context.lineWidth = "1";
		var i = game.map.lines + 1;
		while (i > 0) {
			game.context.beginPath();
			game.context.moveTo(0, i * game.cellHeight);
			game.context.lineTo(game.map.columns * game.cellWidth, i * game.cellHeight);
			game.context.stroke(); --i
		}
		i = game.map.columns + 1;
		while (i > 0) {
			game.context.beginPath();
			game.context.moveTo(i * game.cellWidth, 0);
			game.context.lineTo(i * game.cellHeight, game.map.lines * game.cellHeight);
			game.context.stroke(); --i;
		}
	}
	this.ajustMapSize();
	this.render();
}
