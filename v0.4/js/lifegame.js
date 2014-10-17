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

	$("#lines").val(game.map.lines);
	$("#columns").val(game.map.columns);
	$("#need_cells").val(game.livingCells);
	$("#speed").text(game.speed);

	$(window).resize(function() {
		windowWidth = $(window).width() / 2;
		windowHeight = $(window).height();
		game.canvas.setAttribute('width', windowWidth);
		game.canvas.setAttribute('height', windowHeight);
		game.context = game.canvas.getContext('2d');
		game.ajustMapSize();
		game.render();
	});
	this.createMap = function(lines, columns, livingCells) {
		this.map = new Map(lines, columns, livingCells);
		this.ajustMapSize();
		$("#lines").val(game.map.lines);
		$("#columns").val(game.map.columns);
		$("#need_cells").val(game.map.livingCells);
		$("#living_cells").text(game.map.livingCells);
		this.render();
	}
	this.clearMap = function() {
		this.map = new Map(this.map.lines, this.map.columns, 0);

		this.render();
	}
	this.startGame = function() {
		this.ajustMapSize();
		this.loop(this.speed);
		$("#startTaggle").text("Stop");
		$("#world_status").text("Start");
	}
	this.ajustMapSize = function() {
		with (game) {
			var width = $(window).width() / 2;
			var height = $(window).height();
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			if (canvas.height / map.lines > canvas.width / map.columns)
				cellWidth = cellHeight = canvas.width / map.columns;
			else {
				cellWidth = cellHeight = canvas.height / map.lines;
			}
			mapWidth = map.columns * cellWidth;
			mapHeight = map.lines * cellWidth;
			canvas.setAttribute('width', map.columns * cellWidth);
			canvas.setAttribute('height', map.lines * cellHeight);
		}
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
		$("#startTaggle").text("Start");
		$("#world_status").text("Stop");
	}
	this.execute = function() {
		with (game) {
			var i = map.dynamicArray.length - 1;
			while (i > 0) {
				updateAdjustArray(i);
				--i;
			}
			map.dynamicArray.length = 0;
			var i = map.adjustArray.length - 1;
			while (i > 0) {
				if (map.adjustArray[i].currentStatus == 0 && map.adjustArray[i].livingCellsAround == 3) {
					map.adjustArray[i].nextStatus = 1;
					++map.livingCells;
					map.dynamicArray.push(map.adjustArray[i]);
				} else if (map.adjustArray[i].currentStatus == 1 && (map.adjustArray[i].livingCellsAround < 2 || map.adjustArray[i].livingCellsAround > 3)) {
					map.adjustArray[i].nextStatus = 0;
					--map.livingCells;
				} else if (map.adjustArray[i].currentStatus == 1 && (map.adjustArray[i].livingCellsAround == 2 || map.adjustArray[i].livingCellsAround == 3)) {
					map.adjustArray[i].nextStatus = 1;
					map.dynamicArray.push(map.adjustArray[i]);
				} else {
					map.adjustArray[i].nextStatus = 0;
				}
				map.adjustArray[i].livingCellsAround = 0;
				--i;
			}
		}
	}
	this.updateAdjustArray = function(k) {
		livingCellsRoundNum = 0;
		var cell = map.dynamicArray[k];
		var i = cell.position.x;
		var ii = cell.position.y;
		var position = [[i - 1, ii - 1], [i - 1, ii], [i - 1, ii + 1], [i, ii - 1], [i, ii + 1], [i + 1, ii - 1], [i + 1, ii], [i + 1, ii + 1]];
		if (i == 0) {
			position[0][0] = position[1][0] = position[2][0] = game.map.lines - 1;
		}
		if (i == game.map.lines - 1) {
			position[5][0] = position[6][0] = position[7][0] = 0;
		}
		if (ii == 0) {
			position[0][1] = position[3][1] = position[5][1] = game.map.columns - 1;
		}
		if (ii == game.map.columns - 1) {
			position[2][1] = position[4][1] = position[7][1] = 0;
		}
		if (cell.currentStatus) {
			for (var p = 0; p < position.length; ++p) {++map.mapArray[position[p][0]][position[p][1]].livingCellsAround;
				var adjustArrayLength = map.adjustArray.length;
				if (adjustArrayLength == 0) {
					map.adjustArray.push(map.mapArray[position[p][0]][position[p][1]]);
				} else {
					var has = false;
					for (var q = 0; q < adjustArrayLength; ++q) {
						if (map.adjustArray[q].position.x == position[p][0] && map.adjustArray[q].position.y == position[p][1]) {
							has = true;
							break;
						}
					}
					if (!has)
						map.adjustArray.push(map.mapArray[position[p][0]][position[p][1]]);
				}
			}
		}
	}
	this.changeCellStatus = function(cell) {
		with (game) {
			if (cell != null)
				if (cell.currentStatus) {
					cell.currentStatus = 0;
					--map.livingCells;
					var dynamicArrayLength = map.dynamicArray.length;
					for (var i = 0; i < dynamicArrayLength; ++i) {
						if (cell.position.x == map.dynamicArray[i].position.x && cell.position.y == map.dynamicArray[i].position.y) {
							map.dynamicArray[i] = map.dynamicArray[dynamicArrayLength - 1];
							--map.dynamicArray.length;
							break;
						}
					}
				} else {
					cell.currentStatus = 1;
					++map.livingCells;
					map.dynamicArray.push(cell);
				}
			cell.color = cell.currentStatus == 1 ? new Color("#FF6667") : new Color("#D0D0D0");
			render();
		}
	}
	this.draw = function() {
		with (game) {
			context.fillStyle = colorList.background;
			context.fillRect(0, 0, canvas.width, canvas.height);
			$("#living_cells").text(map.livingCells);
			if (!map.livingCells) {
				stop();
			}
			execute();
			var adjustArrayLength = map.adjustArray.length;
			for (var i = 0; i < adjustArrayLength; ++i) {
				context.fillStyle = map.adjustArray[i].color.hex;
				context.fillRect(map.adjustArray[i].position.y * cellWidth, map.adjustArray[i].position.x * cellHeight, cellWidth, cellHeight);
				map.adjustArray[i].currentStatus = map.adjustArray[i].nextStatus;
				map.adjustArray[i].color = map.adjustArray[i].currentStatus == 1 ? new Color("#FF6667") : new Color("#D0D0D0");
			}
			context.strokeStyle = colorList.border;
			context.lineWidth = "1";
			for (var i = 0; i <= map.lines + 1; ++i) {
				context.beginPath();
				context.moveTo(0, i * cellHeight);
				context.lineTo(map.columns * cellWidth, i * cellHeight);
				context.stroke();
			}
			for (var i = 0; i <= map.columns + 1; ++i) {
				context.beginPath();
				context.moveTo(i * cellWidth, 0);
				context.lineTo(i * cellHeight, map.lines * cellHeight);
				context.stroke();
			}
		}
	}
	this.render = function() {
		with (game) {
			$("#living_cells").text(map.livingCells);
			context.fillStyle = colorList.background;
			context.fillRect(0, 0, canvas.width, canvas.height);
			var i = map.dynamicArray.length-1;
			while (i > 0) {
				context.fillStyle = map.dynamicArray[i].color.hex;
				context.fillRect(map.dynamicArray[i].position.y * cellWidth, map.dynamicArray[i].position.x * cellHeight, cellWidth, cellHeight); --i;
			}

			context.strokeStyle = colorList.border;
			context.lineWidth = "1";
			var i = map.lines+1;
			while (i > 0) {
				context.beginPath();
				context.moveTo(0, i * cellHeight);
				context.lineTo(map.columns * cellWidth, i * cellHeight);
				context.stroke();
				--i
			}
			i = map.columns+1;
			while (i > 0) {
				context.beginPath();
				context.moveTo(i * cellWidth, 0);
				context.lineTo(i * cellHeight, map.lines * cellHeight);
				context.stroke();
				--i;
			}
		}
	}
	this.ajustMapSize();
	this.render();
}
