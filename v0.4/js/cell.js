var Cell = function(position, currentStatus, nextStatus) {
	this.position = position;
	this.currentStatus = currentStatus ;
	this.nextStatus = nextStatus ;
	this.color = this.currentStatus? new Color("#FF6667") : new Color("#D0D0D0");
	this.livingCellsAround = 0;
}
