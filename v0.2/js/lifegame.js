function LifeGame(canvasId, lines, columns, livingCells) {
	game = this;
	this.speed = 100;
	this.map = new Map(lines, columns, livingCells);
	this.livingCells = livingCells <= this.map.mapSize ? livingCells : this.map.mapSize;
	this.intervalNumber = -1;
	this.canvasId = canvasId;
	this.canvas = document.getElementById(this.canvasId);

	this.colorList = {
		dieCell : '#D0D0D0',
		livingCell : '#FF6667',
		border : '#EBEBEB'
	}
	width = $(window).width() / 2;
	height = $(window).height();
	this.canvas.setAttribute('width', width);
	this.canvas.setAttribute('height', height);
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
		game.ajustCellSize();
		game.render();
	});
	this.createMap = function(lines, columns, livingCells) {
		game.map = new Map(lines, columns, livingCells);
		game.ajustCellSize();
		$("#lines").val(game.map.lines);
		$("#columns").val(game.map.columns);
		$("#need_cells").val(game.map.livingCells);
		$("#living_cells").text(game.map.livingCells);
		game.render();
	}
	this.clearMap = function() {
		game.map = new Map(game.map.lines, game.map.columns, 0);
		
		game.render();
	}
	this.startGame = function() {
		game.ajustCellSize();
		game.loop(game.speed);
		$("#startTaggle").text("Stop");
		$("#world_status").text("Start");
	}
	this.ajustCellSize = function() {
		if (game.canvas.height / game.map.lines > game.canvas.width / game.map.columns)
			game.cellWidth = game.cellHeight = game.canvas.width / game.map.columns;
		else {
			game.cellWidth = game.cellHeight = game.canvas.height / game.map.lines;
		}
		game.canvas.setAttribute('width', game.map.columns * game.cellWidth);
		game.canvas.setAttribute('height', game.map.lines * game.cellHeight);
	}
	this.loop = function(speed) {
		game.render();
		game.intervalNumber = setInterval(game.draw, speed == null ? 100 : speed);
		// game.intervalNumber = setTimeout(game.draw, speed == null ? 100 : speed);
	}
	this.stop = function() {
		clearInterval(game.intervalNumber);
		game.intervalNumber = -1;
		game.render();
		$("#startTaggle").text("Start");
		$("#world_status").text("Stop");
	}
	this.execute = function() {
		for ( i = 0; i < game.map.lines; ++i) {
			for ( ii = 0; ii < game.map.columns; ++ii) {
				LivingCellsRound = game.getLivingCellsRound(i, ii);
				if (game.map.mapArray[i][ii].currentStatus == 0 && LivingCellsRound == 3) {
					game.map.mapArray[i][ii].nextStatus = 1; ++game.map.livingCells;
				} else if (game.map.mapArray[i][ii].currentStatus == 1 && (LivingCellsRound < 2 || LivingCellsRound > 3)) {
					game.map.mapArray[i][ii].nextStatus = 0; --game.map.livingCells;
				} else if (game.map.mapArray[i][ii].currentStatus == 1 && (LivingCellsRound == 2 || LivingCellsRound == 3)) {
					game.map.mapArray[i][ii].nextStatus = 1;
				} else {
					game.map.mapArray[i][ii].nextStatus = 0;
				}
			}
		}
	}
	this.getLivingCellsRound = function(i, ii) {
		livingCellsRoundNum = 0;
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
		for ( iii = 0; iii < 8; ++iii) {
			livingCellsRoundNum += game.map.mapArray[position[iii][0]][position[iii][1]].currentStatus;
		}
		return livingCellsRoundNum;
	}
	this.changeCellStatus = function(x, y) {
		if (game.map.mapArray[x][y] != null)
			if (game.map.mapArray[x][y].currentStatus) {
				game.map.mapArray[x][y].currentStatus = 0;
				--game.map.livingCells;
			} else {
				game.map.mapArray[x][y].currentStatus = 1;
				++game.map.livingCells;
			}
		game.render();
	}
	this.draw = function() {
		game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
		$("#living_cells").text(game.map.livingCells);
		if (!game.map.livingCells) {
			game.stop();
			$("#startTaggle").text("start");
		}
		game.execute();

		for ( i = 0; i < game.map.lines; ++i) {
			for ( ii = 0; ii < game.map.columns; ++ii) {
				if (game.map.mapArray[i][ii].currentStatus)
					game.context.fillStyle = game.colorList.livingCell;
				else
					game.context.fillStyle = game.colorList.dieCell;
				game.context.strokeStyle = game.colorList.border;
				game.context.fillRect(ii * game.cellWidth, i * game.cellHeight, game.cellWidth, game.cellHeight);
				game.context.strokeRect(ii * game.cellWidth, i * game.cellHeight, game.cellWidth, game.cellHeight);
				game.map.mapArray[i][ii].currentStatus = game.map.mapArray[i][ii].nextStatus;
			}
		}
	}
	this.render = function() {
		$("#living_cells").text(game.map.livingCells);
		for ( i = 0; i < game.map.lines; ++i) {
			for ( ii = 0; ii < game.map.columns; ++ii) {
				if (game.map.mapArray[i][ii].currentStatus)
					game.context.fillStyle = game.colorList.livingCell;
				else
					game.context.fillStyle = game.colorList.dieCell;
				game.context.strokeStyle = game.colorList.border;
				game.context.fillRect(ii * game.cellWidth, i * game.cellHeight, game.cellWidth, game.cellHeight);
				game.context.strokeRect(ii * game.cellWidth, i * game.cellHeight, game.cellWidth, game.cellHeight);
			}
		}
	}
	this.ajustCellSize();
	this.render();
}
