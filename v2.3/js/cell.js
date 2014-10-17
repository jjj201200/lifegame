function Cell(position, currentStatus, nextStatus) {
	//this.position = position;//cell在棋盘上的坐标
	this.x = position[1];
	this.y = position[0];
	this.currentStatus = currentStatus;//这一步状态
	this._nextStatus_ = nextStatus;//下一步状态
	this.livingCellsAround = 0;
	this.livingCellsLifeAround = 0;
	this.opreated = false;//是否已经切换到下一个状态
	this.hp=0;
	this.nhp=0;
	this.color = this.currentStatus ? new Color("#FF6667") : new Color("#D0D0D0");//通过这一步状态设置颜色

	return this;
}
Cell.prototype.getCurrentStatus = function() {//获取当前状态
	return this.currentStatus;
};
Cell.prototype.getNextStatus = function() {//获取下一个状态
	return this._nextStatus_;
};
Cell.prototype.setCurrentLiving = function() {//设置当前为活细胞
	return this.currentStatus = 1;
};
Cell.prototype.createNew = function(){
	this.hp = map.newCellHP;
	this.currentStatus = 1;
	return this;
};
Cell.prototype.setCurrentDie = function() {
	this.hp=0;
	return this.currentStatus = 0;
};
Cell.prototype.setNextLiving = function() {
	return this._nextStatus_ = 1;
};
Cell.prototype.setNextDie = function() {
	return this._nextStatus_ = 0;
};
Cell.prototype.setToNext = function() {
	this.currentStatus = this._nextStatus_;
	this.hp = this.nhp;
	return this;

};