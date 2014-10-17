var Map = function(canvasId, lines, columns, livingCells) {
	map = this;
	this.canvasId = canvasId;
	this.canvas = document.getElementById(this.canvasId);
	this.canvas.lineWidth = 1;
	this.context = this.canvas.getContext('2d');

	this.lines = Number(lines);
	this.columns = Number(columns);
	this.mapArray = new Array();
	this.dynamicArray = new Array();
	this.dieArray = new Array();
	this.adjustArray = new Array();
	this.mapSize = this.lines * this.columns;
	this.livingCells = livingCells <= this.mapSize ? livingCells : this.mapSize;
	this.cellWidth = this.cellHeight = null;
	this.mapWidth = 0;
	this.mapHeight = 0;
	this.loop = false;
	this.fastMode = false;

	this.colorList = {
		dieCell : new Color('#D0D0D0'),
		livingCell : new Color('#FF6667'),
		border : new Color('#EAEAEA'),
		background : new Color('#D0D0D0')
	}

	this.fps = 0;
	this.initialise = function() {
		for (var i = 0; i < this.lines; ++i) {
			this.mapArray[i] = new Array();
			for (var ii = 0; ii < this.columns; ++ii) {
				this.mapArray[ i ][ii] = {
					"position" : new Array(i, ii),
					"currentStatus" : 0,
					"nextStatus" : 0,
					"livingCellsAround" : 0,
					"opreated" : 0
				};
			}
		}
		var i = this.livingCells - 1;
		while (i >= 0) {
			var tempn1 = random(0, map.lines - 1);
			var tempn2 = random(0, map.columns - 1);
			if (!this.mapArray[ tempn1 ][tempn2]["currentStatus"]) {
				this.dynamicArray.push(map.mapArray[ tempn1 ][tempn2]);
				this.mapArray[ tempn1 ][tempn2]["currentStatus"] = 1;
			} else
				++i;
			--i;

		}
		$("lines").value = this.lines;
		$("columns").value = this.columns;
		$("need_cells").value = this.livingCells;
		$("living_cells").value = this.livingCells;
		this.ajustMapSize();
	}
	this.allExecute = function() {
		this.dynamicArray.length = 0;
		this.dieArray.length = 0;
		for ( p = 0; p < this.lines; ++p) {
			for ( q = 0; q < this.columns; ++q) {
				cell = this.mapArray[p][q];
				i = cell.position[0];
				ii = cell.position[1];
				whichLine1 = (i + this.lines - 1) % this.lines;
				whichLine3 = (whichLine1 + 2) % this.lines;
				whichColumn1 = (ii + this.columns - 1) % this.columns;
				whichColumn3 = (whichColumn1 + 2) % this.columns;
				livingCellsAround = this.mapArray[whichLine1][whichColumn1]["currentStatus"] + this.mapArray[whichLine1][q]["currentStatus"] + this.mapArray[whichLine1][whichColumn3]["currentStatus"] + this.mapArray[p][whichColumn1]["currentStatus"] + this.mapArray[p][whichColumn3]["currentStatus"] + this.mapArray[whichLine3][whichColumn1]["currentStatus"] + this.mapArray[whichLine3][q]["currentStatus"] + this.mapArray[whichLine3][whichColumn3]["currentStatus"];
				if (cell["currentStatus"] == 1 && (livingCellsAround < 2 || livingCellsAround > 3)) {
					// this.dieArray.push(cell);
					this.dieArray.push(cell);
				} else if (livingCellsAround == 3) {
					// cell["nextStatus"] = 1;
					this.dynamicArray.push(cell);
				} else if (cell["currentStatus"] == 1 && livingCellsAround == (2)) {
					// cell["nextStatus"] = 1;
					this.dynamicArray.push(cell);
				} else {
					cell["currentStatus"] = 0;
				}
			}
		}
		this.livingCells = this.dynamicArray.length;
		$("living_cells").value = this.livingCells;
		// this.context.fillStyle = this.colorList.background.hex;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = this.colorList.livingCell.hex;
		for ( i = 0; i < this.dynamicArray.length; ++i) {
			this.dynamicArray[i]["currentStatus"] = 1;
			this.context.fillRect(this.dynamicArray[i]["position"][1] * this.cellWidth, this.dynamicArray[i]["position"][0] * this.cellHeight, this.cellWidth, this.cellHeight);
		}
		if (this.mapSize < 100000) {
			this.drawBorder();
		}
		for ( i = 0; i < this.dieArray.length; ++i) {
			this.dieArray[i]["currentStatus"] = 0;
		}
	}
	this.execute = function() {

		k = this.dynamicArray.length - 1;
		while (k >= 0) {//通过存活队列生成调整队列
			cell = this.dynamicArray[k];
			if (!cell["opreated"]) {
				this.adjustArray.push(cell);
				cell["opreated"] = 1;
			}
			i = cell.position[0];
			ii = cell.position[1];
			whichLine1 = (i + this.lines - 1) % this.lines;
			whichLine3 = (whichLine1 + 2) % this.lines;
			whichColumn1 = (ii + this.columns - 1) % this.columns;
			whichColumn3 = (whichColumn1 + 2) % this.columns;
			position = [[whichLine1, whichColumn1], [whichLine1, ii], [whichLine1, whichColumn3], [i, whichColumn1], [i, whichColumn3], [whichLine3, whichColumn1], [whichLine3, ii], [whichLine3, whichColumn3]];
			for ( p = 0; p < 8; ++p) {++
				this.mapArray[position[p][0]][position[p][1]]["livingCellsAround"];
				if (!this.mapArray[position[p][0]][position[p][1]]["opreated"]) {
					this.adjustArray.push(this.mapArray[position[p][0]][position[p][1]]);
					this.mapArray[position[p][0]][position[p][1]]["opreated"] = true;
				}
			}--k;
		}
		this.dynamicArray.length = 0;
		i = this.adjustArray.length - 1;
		while (i >= 0) {//通过调整队列生成下一步的存活队列
			this.adjustArray[i]["opreated"] = false;
			if (this.adjustArray[i]["livingCellsAround"] == 3) {
				this.adjustArray[i]["currentStatus"] = 1;
				this.dynamicArray.push(this.adjustArray[i]);
			} else if (this.adjustArray[i]["currentStatus"] && this.adjustArray[i]["livingCellsAround"] == 2) {
				this.adjustArray[i]["currentStatus"] = 1;
				this.dynamicArray.push(this.adjustArray[i]);
			} else {
				this.adjustArray[i]["currentStatus"] = 0;
			}
			this.adjustArray[i]["livingCellsAround"] = 0; --i;
		}
		this.adjustArray.length = 0;

		this.livingCells = this.dynamicArray.length;
	}
	this.ajustMapSize = function() {
		var width = window.innerWidth / 2;
		var height = window.innerHeight;
		this.canvas.width = width;
		this.canvas.height = height;
		if (this.canvas.height / this.lines > this.canvas.width / this.columns)
			this.cellWidth = this.cellHeight = this.canvas.width / this.columns;
		else {
			this.cellWidth = this.cellHeight = this.canvas.height / this.lines;
		}
		this.mapWidth = this.columns * this.cellWidth;
		this.mapHeight = this.lines * this.cellWidth;
		this.canvas.width = this.columns * this.cellWidth;
		this.canvas.height = this.lines * this.cellHeight;
	}
	this.draw = function() {
		if (!map.livingCells) {
			game.stop();
		}
		$("living_cells").value = map.livingCells;
		if (0) {
		// if (map.livingCells>15000) {
			map.execute();
			map.render();
		} else {
			map.allExecute();
		}++map.fps;
		if (map.loop)
			requestAnimationFrame(game.map.draw);
	}
	this.render = function() {
		$("living_cells").value = this.livingCells;
		// this.context.fillStyle = this.colorList.background.hex;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		i = this.dynamicArray.length - 1;
		this.context.fillStyle = this.colorList.livingCell.hex;
		while (i >= 0) {
			this.context.fillRect(this.dynamicArray[i].position[1] * this.cellWidth, this.dynamicArray[i].position[0] * this.cellHeight, this.cellWidth, this.cellHeight); --i;
		}
		if (this.mapSize < 100000) {
			this.drawBorder();
		}
	}
	this.drawBorder = function() {
		this.context.strokeStyle = this.colorList.border.hex;
		this.context.lineWidth = "1";
		this.context.beginPath();
		i = this.lines;
		while (i > 0) {
			this.context.moveTo(0, i * this.cellHeight);
			this.context.lineTo(this.columns * this.cellWidth, i * this.cellHeight);
			--i;
		}
		i = this.columns;
		while (i > 0) {
			this.context.moveTo(i * this.cellWidth, 0);
			this.context.lineTo(i * this.cellHeight, this.lines * this.cellHeight);
			--i;
		}
		this.context.stroke();
	}
	this.initialise();
	this.render();
}
var random = function(min, max) {
	return Math.round(Math.random() * (max - min ));
}
var random0_1 = function() {
	return Math.round(Math.random());
}
