function LoadQuestion(obj) {
  this.url = obj.url;
  this.articleElem = obj.articleElem;
  this.optionsElem = obj.optionsElem;
  this.answersElem = obj.answersElem;
  this.analysisElem = obj.analysisElem;
  this.loadEvent();
}
LoadQuestion.prototype.loadEvent = function() {
  var self = this;
  $.ajax({
    url: self.url
  }).success(function(data) {
    self.renderArticle(data.article);
    self.renderOptions(data.options);
    self.renderAnswers(data.answers);
    self.renderAnalysis(data.analysis);
  }).fail(function() {
    alert('error')
  })
};
LoadQuestion.prototype.renderArticle = function(data) {
  var self = this;
  self.articleElem.html(data);

};
LoadQuestion.prototype.renderOptions = function(data) {
  var self = this;
  var arr = [];
  var len = data.length;
  self.sortArr(data);
  for (var i = 0; i < len; i++) {
    arr.push('<li class="list-group-item">' + (i + 1) + '. ' + data[i] + '</li>');
  }
  self.optionsElem.html(arr.join(''))
};
LoadQuestion.prototype.renderAnswers = function(data) {
  var self = this;
  var arr = [];
  var len = data.length;
  for (var i = 0; i < len; i++) {
    arr.push('<li class="list-group-item">' + (i + 1) + '. ' + data[i] + '</li>');
  }
  self.answersElem.html(arr.join(''))
};
LoadQuestion.prototype.renderAnalysis = function(data) {
  var self = this;
  var arr = [];
  var len = data.length;
  for (var i = 0; i < len; i++) {
    arr.push('<li class="list-group-item">' + (i + 1) + '. ' + data[i] + '</li>');
  }
  self.analysisElem.html(arr.join(''))
};
LoadQuestion.prototype.sortArr = function(arr) {
  arr.sort(function(a, b) {
    return Math.random() > .5 ? -1 : 1;
  });
}