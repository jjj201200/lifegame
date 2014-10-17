var Map = function(lines, cloumn, livingCells) {
	map = this;
	this.lines = lines;
	this.cloumn = cloumn;
	this.livingCells = livingCells;
	this.mapArray = new Array();
	this.mapSize = this.lines * this.cloumn;
	this.initialise = function() {
		for ( i = 0; i < map.lines; ++i) {
			map.mapArray[i] = new Array();
			for ( ii = 0; ii < map.cloumn; ++ii) {
				map.mapArray[ i ][ii] = new Cell(new Vector2(i, ii), 0, 0);
			}
		}
		var i = map.livingCells;
		while (i >0) {
			tempn1 = random(0, map.lines - 1);
			tempn2 = random(0, map.cloumn - 1);
			if (!map.mapArray[ tempn1 ][tempn2].currentStatus) {
				map.mapArray[ tempn1 ][tempn2].currentStatus = 1;
			} else
				++i;
			--i;

		}

	}

	this.printMap = function() {
		str = "";
		for ( i = 0; i < map.lines; ++i) {
			for ( ii = 0; ii < map.cloumn; ++ii) {
				str = str + map.mapArray[i][ii].currentStatus.toString() + " ";
			}
			str += "\n"
		}
		console.log(str);
	}
	map.initialise();
	// map.printMap();
}
var random = function(min, max) {
	return Math.round(Math.random() * (max - min ));
}
var random0_1 = function() {
	return Math.round(Math.random());
}
