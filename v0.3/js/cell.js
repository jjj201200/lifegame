function Cell(position, currentStatus, nextStatus) {
	this._position_ = position;//cell在棋盘上的坐标
	this._currentStatus_ = currentStatus;//这一步状态
	this._nextStatus_ = nextStatus;//下一步状态
	this._livingCellsAround_ = 0;
	this._livingCellsLifeAround_ = 0;
	this._opreated_ = false;//是否已经切换到下一个状态
	this._hp_=0;
	this._color_ = this._currentStatus_ ? new Color("#FF6667") : new Color("#D0D0D0");//通过这一步状态设置颜色

	return this;
}
Cell.prototype.getCurrentStatus = function() {//获取当前状态
	return this._currentStatus_;
};
Cell.prototype.getNextStatus = function() {//获取下一个状态
	return this._nextStatus_;
};
Cell.prototype.setCurrentLiving = function() {//设置当前为活细胞
	return this._currentStatus_ = 1;
};
Cell.prototype.createNew = function(){
	this._hp_ = map.newCellHP;
	this._currentStatus_ = 1;
	return this;
};
Cell.prototype.setCurrentDie = function() {
	this.hp=0;
	return this._currentStatus_ = 0;
};
Cell.prototype.setNextLiving = function() {
	return this._nextStatus_ = 1;
};
Cell.prototype.setNextDie = function() {
	return this._nextStatus_ = 0;
};
Cell.prototype.setToNext = function() {
	return this._currentStatus_ = this._nextStatus_;
};