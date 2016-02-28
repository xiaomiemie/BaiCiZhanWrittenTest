//可拖动组件
function Move(obj) {
  this.parentElem = obj.parentElem;
  this.moveElem = obj.moveElem;
  this.minNum = obj.minNum || 0;
  this.maxNum = obj.maxNum || 1000;
  this.bindEvent();
}
Move.prototype.bindEvent = function() {
  var self = this;
  self.moveElem.on('mousedown', function(e) {
    var lastY = e.pageY;
    $('body').on('mousemove', function(e) {
      var nowY = e.pageY;
      self.render(nowY - lastY);
      lastY = nowY;
    });

  });
 self.moveElem.on('mouseout', function() {
    $('body').off('mousemove')
  });
 self.moveElem.on('mouseup', function() {
    $('body').off('mousemove')
  });
}
Move.prototype.render = function(num) {
  var n = this.parentElem.height()+ num;
  if (this.minNum < n && n < this.maxNum) {
    console.log(n)
    this.moveElem.css('bottom', parseInt(this.parentElem.css('bottom')) + num + 'px');
    this.parentElem.height(this.parentElem.height() + num )
  }
}