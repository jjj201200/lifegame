var Map = function(lines, columns, livingCells) {
	map = this;
	this.lines = parseInt(lines);
	this.columns = parseInt(columns);
	this.mapArray = new Array();
	this.dynamicArray = new Array();
	this.adjustArray = new Array();
	this.mapSize = this.lines * this.columns;
	this.livingCells = livingCells<=this.mapSize?livingCells:this.mapSize;
	this.initialise = function() {
		for (var i = 0; i < map.lines; ++i) {
			map.mapArray[i] = new Array();
			for (var ii = 0; ii < map.columns; ++ii) {
				map.mapArray[ i ][ii] = new Cell(new Vector2(i, ii), 0, 0);
			}
		}
		var i = map.livingCells-1;
		while (i >=0) {
			var tempn1 = random(0, map.lines - 1);
			var tempn2 = random(0, map.columns - 1);
			if (!map.mapArray[ tempn1 ][tempn2].currentStatus) {
				map.dynamicArray.push(map.mapArray[ tempn1 ][tempn2]);
				map.mapArray[ tempn1 ][tempn2].currentStatus = 1;
				map.mapArray[ tempn1 ][tempn2].color = map.mapArray[ tempn1 ][tempn2].currentStatus ? "#FF6667": "#D0D0D0";
			} else
				++i;
			--i;

		}

	}

	this.printMap = function() {
		str = "";
		for ( i = 0; i < map.lines; ++i) {
			for ( ii = 0; ii < map.columns; ++ii) {
				str = str + map.mapArray[i][ii].currentStatus.toString() + " ";
			}
			str += "\n"
		}
		console.log(str);
	}
	map.initialise();
}
var random = function(min, max) {
	return Math.round(Math.random() * (max - min ));
}
var random0_1 = function() {
	return Math.round(Math.random());
}
