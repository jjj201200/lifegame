function Map(_lines_, _columns_, _livingCells_) {

	this._lines_ = _lines_;//棋盘行数
	this._columns_ = _columns_;//棋盘列数
	this._livingCells_ = _livingCells_ <= this.getMapSize() ? _livingCells_ : this.getMapSize();//棋盘活细胞数
	this._mapArray_ = new Array();//棋盘数据数组
	this._mapSize_ = this._lines_ * this._columns_;//棋盘总细胞数
	//细胞渲染尺寸
	this._cellSizeW_ = 0;
	this._cellSizeH_ = 0;
	/*
	 initialize
	 */
	for (var i = 0; i < _lines_; ++i) {//将棋盘填充死细胞
		this._mapArray_[i] = new Array();
		for (var ii = 0; ii < this._columns_; ++ii) {
			this._mapArray_[ i ][ii] = new Cell(new Vector2(i, ii), 0, 0);
		}
	}
	var i = this._livingCells_;
	while (i > 0) {//随机标记活细胞
		var tempn1 = random(0, this._lines_ - 1);
		var tempn2 = random(0, this._columns_ - 1);
		var cell = this._mapArray_[ tempn1 ][tempn2];
		if (!this.getCellCurrentStatus(cell)) {
			this.setCellCurrentLiving(cell);
			this.oneDie();
		} else
			++i;
		--i;
	}
}
Map.prototype.clearMap = function(){//清空棋盘
	this._livingCells_ = 0;
	for(var i = 0;i<this._lines_;++i){
		for(var ii = 0;ii<this._columns_;++ii){
			this.setCellCurrentDie(i,ii);
			this.setCellNextDie(i,ii);
		}
	}
}
Map.prototype.getCellW = function() {//获取cell宽度
	return this._cellSizeW_;
}
Map.prototype.getCellH = function() {//获取cell高度
	return this._cellSizeH_;
}
Map.prototype.setCellSizeW = function(cellW) {//设置cell宽度
	this._cellSizeW_ = cellW;
}
Map.prototype.setCellSizeH = function(cellH) {//设置cell高度
	this._cellSizeH_ = cellH;
}
Map.prototype.getLivingCells = function() {//获取当前棋盘活细胞数
	return this._livingCells_;
}
Map.prototype.getMapSize = function() {//获取棋盘尺寸
	return this._lines_ * this._columns_;
}
Map.prototype.line = function() {//获取棋盘行数
	return this._lines_;
}
Map.prototype.column = function() {//获取棋盘列数
	return this._columns_;
}
Map.prototype.oneLive = function() {//将活细胞数加一
	return this._livingCells_ < this._lines_ * this._columns_ ? ++this._livingCells_ : this._livingCells_;
}
Map.prototype.oneDie = function() {//将活细胞数减一
	return this._livingCells_ > 0 ? --this._livingCells_ : this._livingCells_;
}
Map.prototype.getCellCurrentStatus = function(cell) {//cell OR i,ii 获取该cell这一步状态
	if (arguments.length == 1) {
		return cell.getCurrentStatus();
	} else if (arguments.length == 2) {
		return this.getCellCurrentStatus(this.getCell(arguments[0], arguments[1]));
	}
}
Map.prototype.getCell = function(i, ii) {//获取该细胞对象
	if (i >= 0 && i < this._lines_ && ii >= 0 && ii < this._columns_)
		return this._mapArray_[arguments[0]][arguments[1]];
	else
		return false;
}
Map.prototype.setCellToNextStatus=function(cell){//cell OR i,ii  将cell切换到下一步状态
	if (arguments.length == 1) {
		arguments[0].setToNext();
	} else if (arguments.length == 2) {
		var cell = this.getCell(arguments[0], arguments[1]);
		this.setCellToNextStatus(cell);
	}
}
Map.prototype.setCellCurrentLiving = function(cell) {//cell OR i,ii 设置该cell这一步状态为living
	if (arguments.length == 1) {
		arguments[0].setCurrentLiving();
		this.oneLive();
	} else if (arguments.length == 2) {
		var cell = this.getCell(arguments[0], arguments[1]);
		this.setCellCurrentLiving(cell);
	}
}
Map.prototype.setCellCurrentDie = function(cell) {//cell OR i,ii 置该cell这一步状态为die
	if (arguments.length == 1) {
		cell.setCurrentDie();
		this.oneDie();
	} else if (arguments.length == 2) {
		var cell = this.getCell(arguments[0], arguments[1]);
		this.setCellCurrentDie(cell);
	}
}
Map.prototype.setCellNextLiving = function(cell) {//cell OR i,ii  设置cell下一步状态为living
	if (arguments.length == 1) {
		arguments[0].setNextLiving();
	} else if (arguments.length == 2) {
		var cell = this.getCell(arguments[0], arguments[1]);
		this.setCellNextLiving(cell);
	}
}
Map.prototype.setCellNextDie = function(cell) {//cell OR i,ii 设置cell下一步状态为die
	if (arguments.length == 1) {
		cell.setNextDie();
	} else if (arguments.length == 2) {
		var cell = this.getCell(arguments[0], arguments[1]);
		this.setCellNextDie(cell);
	}
}
Map.prototype.printMap = function() {// 在控制台打印棋盘
	with (this) {
		str = "";
		for (var i = 0; i < _lines_; ++i) {
			for (var ii = 0; ii < _columns_; ++ii) {
				str = str + getCellCurrentStatus(i, ii) + " ";
			}
			str += "\n"
		}
		console.log(str);
	}
}
var random = function(min, max) { //在指定范围内生成随机整数
	return Math.round(Math.random() * (max - min ));
}
var random0_1 = function() {//随机生成0或1
	return Math.round(Math.random());
}
