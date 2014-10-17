function LifeGame(_canvasId_, _lines_, _columns_, _livingCells_) {
	game = this;
	/*
	 initialize
	 */
	this._canvasId_ = _canvasId_;
	this._map_ = new Map(_lines_, _columns_, _livingCells_);//创建游戏棋盘
	this._speed_ = 100;//渲染速度
	this._intervalNumber_ = -1;//渲染函数代号

	this._canvas_ = document.getElementById(this._canvasId_);
	this._context_ = this._canvas_.getContext('2d');
	this._colorList_ = {
		dieCell : '#D0D0D0',
		livingCell : '#FF6667',
		border : '#EBEBEB',
		font : "#000000"
	}
	// width = $(window).width() / 2;
	// height = $(window).height();
	// _canvas_.setAttribute('width', width);
	// _canvas_.setAttribute('height', height);

	$("#lines").val(this._map_.line());
	$("#columns").val(this._map_.column());
	$("#need_cells").val(this._map_.getLivingCells());
	$("#speed").text(this._speed_);

	$(window).resize(function() {
		game.ajustMapSize();
		game._context_ = game._canvas_.getContext('2d');
		game.render();
	});
	this.ajustMapSize();
	this.render();
}

LifeGame.prototype.getIntervalNumber = function() {//获取渲染函数代号
	return this._intervalNumber_;
}
LifeGame.prototype.setIntervalNumber = function(n) {//设置渲染函数代号
	this._intervalNumber_ = n;
}
LifeGame.prototype.fastter = function(number) {//提高渲染速度
	if (this._speed_ - number >= 20) {
		this._speed_ -= number;
		this.stop();
		$("#speed").text(this._speed_);
	}
}
LifeGame.prototype.lower = function(number) {//降低渲染速度
	this._speed_ += number;
	this.stop();
	$("#speed").text(this._speed_);
}
LifeGame.prototype.createMap = function(_lines_, _columns_, _livingCells_) {//生成新的游戏棋盘
	with (this) {
		_map_ = new Map(_lines_, _columns_, _livingCells_);
		ajustMapSize();
		$("#lines").val(_map_.line());
		$("#columns").val(_map_.column());
		$("#need_cells").val(_map_.getLivingCells());
		$("#living_cells").text(_map_.getLivingCells());
		render();
	}
}
LifeGame.prototype.clearMap = function() {//清空棋盘
	this._map_.clearMap();//清空棋盘
	this.render();//渲染一步
}
LifeGame.prototype.startGame = function() {//开始游戏
	this.ajustMapSize();//调整棋盘大小
	this.loop(this._speed_);
	$("#startTaggle").text("Stop");
	$("#world_status").text("Start");
}
LifeGame.prototype.ajustMapSize = function() {//调整棋盘大小
	with (this) {
		//获得浏览器窗口视野
		var width = $(window).width() / 2;
		var height = $(window).height();
		//设置canvas尺寸
		_canvas_.setAttribute('width', width);
		_canvas_.setAttribute('height', height);
		if (_canvas_.height / _map_.line() > _canvas_.width / _map_.column()) {
			_map_.setCellSizeW(_canvas_.width / _map_.column());
			_map_.setCellSizeH(_canvas_.width / _map_.column());
		} else {
			_map_.setCellSizeW(_canvas_.height / _map_.line());
			_map_.setCellSizeH(_canvas_.height / _map_.line());
		}
		//重新设定canvas宽度，让其适应棋盘大小
		_canvas_.setAttribute('width', _map_.column() * _map_.getCellW());
		_canvas_.setAttribute('height', _map_.line() * _map_.getCellH());
	}
}
LifeGame.prototype.loop = function(_speed_) {//开始动画
	this._speed_ = _speed_;
	this.render();
	this._intervalNumber_ = setInterval(this.draw, this._speed_ == null ? 100 : this._speed_);
	// game.intervalNumber = setTimeout(game.draw, speed == null ? 100 : speed);
}
LifeGame.prototype.setCellCurrentLiving = function(cell) {//cell OR i,ii 设置该cell这一步状态为living
	if (arguments.length == 1) {
		this._map_.setCellCurrentLiving(arguments[0]);
	} else if (arguments.length == 2) {
		this._map_.setCellCurrentLiving(arguments[0], arguments[1]);
	}
}
LifeGame.prototype.setCellCurrentDie = function(cell) {//cell OR i,ii 设置该cell这一步状态为die
	if (arguments.length == 1) {
		this._map_.setCellCurrentDie(arguments[0]);
	} else if (arguments.length == 2) {
		this._map_.setCellCurrentDie(arguments[0], arguments[1]);
	}
}
LifeGame.prototype.setCellNextLiving = function(cell) {//cell OR i,ii 设置cell下一步状态为living
	if (arguments.length == 1) {
		this._map_.setCellNextLiving(arguments[0]);
	} else if (arguments.length == 2) {
		this._map_.setCellNextLiving(arguments[0], arguments[1]);
	}
}
LifeGame.prototype.setCellNextDie = function(cell) {//cell OR i,ii 设置cell下一步状态为die
	if (arguments.length == 1) {
		this._map_.setCellNextDie(arguments[0]);
	} else if (arguments.length == 2) {
		this._map_.setCellNextDie(arguments[0], arguments[1]);
	}
}
LifeGame.prototype.stop = function() {//停止动画
	clearInterval(game._intervalNumber_);
	this.setIntervalNumber(-1);
	this.render();
	$("#startTaggle").text("Start");
	$("#world_status").text("Stop");
}
LifeGame.prototype.execute = function() {//计算cell下一步状态
	/*
		TODO 有待改进
	*/
	with (game) {
		for (var i = 0; i < _map_.line(); ++i) {
			for (var ii = 0; ii < _map_.column(); ++ii) {
				var LivingCellsRound = getLivingCellsRound(i, ii);
				var cellCurrentStatus = _map_.getCellCurrentStatus(i, ii);
				if (cellCurrentStatus == 0 && LivingCellsRound == 3) {//规则1：若该cell这一步状态为die，且周围正好有3个活细胞，下一刻复活
					_map_.setCellNextLiving(i, ii);
					_map_.oneLive();
				} else if (cellCurrentStatus == 1 && (LivingCellsRound < 2 || LivingCellsRound > 3)) {//规则2：若该cell这一步状态为living，且周围不足2个或多于3个活细胞，下一刻死亡
					_map_.setCellNextDie(i, ii);
					_map_.oneDie();
				} else if (cellCurrentStatus == 1 && (LivingCellsRound == 2 || LivingCellsRound == 3)) {//规则3：若该cell这一步状态为living，且周围有2个或3个活细胞，下一刻保持living状态
					_map_.setCellNextLiving(i, ii);
				} else {//其余情况的cell下一步都为die状态
					_map_.setCellNextDie(i, ii);
				}
			}
		}
	}
}
LifeGame.prototype.getLivingCellsRound = function(i, ii) {//计算获得该cell周围8格内的活细胞数
	with (game) {
		livingCellsRoundNum = 0;
		var position = [[i - 1, ii - 1], [i - 1, ii], [i - 1, ii + 1], [i, ii - 1], [i, ii + 1], [i + 1, ii - 1], [i + 1, ii], [i + 1, ii + 1]];
		if (i == 0) {
			position[0][0] = position[1][0] = position[2][0] = _map_.line() - 1;
		}
		if (i == _map_.line() - 1) {
			position[5][0] = position[6][0] = position[7][0] = 0;
		}
		if (ii == 0) {
			position[0][1] = position[3][1] = position[5][1] = _map_.column() - 1;
		}
		if (ii == _map_.column() - 1) {
			position[2][1] = position[4][1] = position[7][1] = 0;
		}
		for (var iii = 0; iii < 8; ++iii) {
			livingCellsRoundNum += _map_.getCellCurrentStatus(position[iii][0], position[iii][1]);
		}
	}
	return livingCellsRoundNum;
};
LifeGame.prototype.changeCellStatus = function(x, y) {//切换该cell状态，即 1->0 ,0->1
	with (game) {
		if (_map_.getCell(x, y))
			if (_map_.getCellCurrentStatus(x, y)) {
				_map_.setCellCurrentDie(x, y);
			} else {
				_map_.setCellCurrentLiving(x, y);
			}
		render();
	}
};
LifeGame.prototype.draw = function() {//计算并渲染一帧
	with (game) {
		_context_.clearRect(0, 0, _canvas_.width, _canvas_.height);
		$("#living_cells").text(_map_.getLivingCells());
		if (!_map_.getLivingCells()) {
			stop();
			$("#startTaggle").text("start");
		}
		execute();
		var cellW = _map_.getCellW();
		var cellH = _map_.getCellH();
		for (var i = 0; i < _map_.line(); ++i) {
			for (var ii = 0; ii < _map_.column(); ++ii) {
				if (_map_.getCellCurrentStatus(i, ii))
					_context_.fillStyle = _colorList_.livingCell;
				else
					_context_.fillStyle = _colorList_.dieCell;
				_context_.strokeStyle = _colorList_.border;
				_context_.fillRect(ii * cellW, i * cellH, cellW, cellH);
				_context_.strokeRect(ii * cellW, i * cellH, cellW, cellH);
				_map_.setCellToNextStatus(i, ii);
			}
		}
	}
}
LifeGame.prototype.render = function() {//渲染一帧
	with (game) {
		$("#living_cells").text(_map_.getLivingCells());
		var cellW = _map_.getCellW();
		var cellH = _map_.getCellH()
		for (var i = 0; i < _map_.line(); ++i) {
			for (var ii = 0; ii < _map_.column(); ++ii) {
				if (_map_.getCellCurrentStatus(i, ii))
					_context_.fillStyle = _colorList_.livingCell;
				else
					_context_.fillStyle = _colorList_.dieCell;
				_context_.strokeStyle = _colorList_.border;
				_context_.fillRect(ii * cellW, i * cellH, cellW, cellH);
				_context_.strokeRect(ii * cellW, i * cellH, cellW, cellH);
			}
		}
	}
}