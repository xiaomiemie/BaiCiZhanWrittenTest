function SelectWords(obj) {
  this.elem = obj.elem;
  this.url = obj.url;
  this.url2 = obj.url2;
  this.articleContent = this.elem.find('.content .panel-body');
  this.orderButton = this.elem.find('.order-button');
  this.optionTable = this.elem.find('.options-table');
  this.answers = this.elem.find('.answers');
  this.reports = this.elem.find('.reports');
  this.index = -1;
  this.flag = false;
  var m= new Move({
   parentElem: obj.elem.find('.content .panel-body'),
   moveElem:obj.elem.find('.content .pointer'),
   minNum:100,
   maxNum:500
  })
  this.last;
  this.loadQuestion();
  this.send();
}
SelectWords.prototype.initArr = function(n) {
  var arr = [];
  for (var i = 0; i < n; i++) {
    arr[i] = -1;
  }
  return arr;
}
SelectWords.prototype.loadQuestion = function() {
  var self = this;
  $.ajax({
    url: self.url
  }).success(function(data) {
    self.renderContent(data.article);
    self.renderOrder(data.totalCount);
    self.arrIndex = self.initArr(data.totalCount); //当前空白所填选项
    self.renderTable(data.options);
    self.bindEvent();
  }).fail(function() {
    alert('error')
  })
};
SelectWords.prototype.renderContent = function(data) {
  var self = this;
  var _data = data.replace(/_____/g, '<span class="blank doing"></span>');
  self.articleContent.html(_data);
}
SelectWords.prototype.renderOrder = function(data) {
  var self = this;
  var arr = [];
  for (var i = 1; i <= data; i++) {
    arr.push('<div class=" order doing">' + i + '</div>');
  }
  self.orderButton.html(arr.join(''))
};
SelectWords.prototype.renderTable = function(data) {
  var self = this;
  var len = data.length;
  var row = Math.ceil(len / 3);

  var str = '<table class="table table-bordered">';
  for (var i = 0; i < row; i++) {
    str += '<tr>';
    var arr = [];
    for (var j = 0; j < 3; j++) {
      arr.push('<td>' + data[i * 3 + j] + '</td>');

    }
    str += arr.join('') + '</tr>';
  }

  str += '</table>'
  self.optionTable.html(str);
}
SelectWords.prototype.bindEvent = function() {
  var self = this;
  var blankSpan = self.articleContent.find('span.doing');
  var orderDiv = self.orderButton.find('div.doing');
  //点击span
  blankSpan.on('click', function() {
    self.flag = true;
    self.index = $(this).index();
    self.renderOneSpan();
    self.renderOneOrder();
  });
  //点击按钮
  orderDiv.on('click', function() {
    self.flag = true;
    self.index = $(this).index();
    self.renderOneSpan();
    self.renderOneOrder();
  });
  //表格点击
  self.optionTable.on('click', 'td', function() {
    if (self.flag) {
      $(this).removeClass('blue-color');
      var temp = blankSpan.eq(self.index).html();
      var lastHtml = self.last;
      var nowHtml = $(this).html();
      blankSpan.eq(self.index).html(nowHtml);
      orderDiv.eq(self.index).addClass('orderselected');
      self.arrIndex[self.index] = nowHtml;
      self.closeSpan();
      self.renderTd(lastHtml, nowHtml)
    }
  })
  self.optionTable.find('td').hover(function() {
    if (self.flag) {
      self.last = blankSpan.eq(self.index).html() == '' ? -1 : blankSpan.eq(self.index).html();
      $(this).addClass('blue-color')
      var nowHtml = $(this).html();
      blankSpan.eq(self.index).html(nowHtml);
    }
  }, function() {
    if (self.flag) {
      $(this).removeClass('blue-color');
      blankSpan.eq(self.index).html(self.arrIndex[self.index] == -1 ? '' : self.arrIndex[self.index]);
    }
  })
}
SelectWords.prototype.renderOneOrder = function() {
  var d = this.orderButton.find('div')
  d.removeClass('orderselecting');
  d.eq(this.index).addClass('orderselecting');
};
SelectWords.prototype.renderOneSpan = function() {
  var blankSpan = this.articleContent.find('span.doing');
  blankSpan.removeClass('backg');
  blankSpan.eq(this.index).addClass('backg');
}
SelectWords.prototype.closeSpan = function() {
  var blankSpan = this.articleContent.find('span.doing');
  blankSpan.eq(this.index).removeClass('backg');
  this.flag = false;
}
SelectWords.prototype.renderTd = function(last, now) {
  var l = this.inArray(last, this.arrIndex); //查看该字符串是否还被占用
  if (!l) {
    this.optionTable.find('td').filter(':contains(' + last + ')').css('textDecoration', ' none');
  }
  this.optionTable.find('td').filter(':contains(' + now + ')').css('textDecoration', ' line-through');


  // 
};
//下面为提交试卷之后的js
SelectWords.prototype.send = function() {
  var self = this;
  self.elem.find('button.submit').on('click', function() {
    $.ajax({
      url: self.url2,
      data: {
        data: self.arrIndex
      }
    }).success(function(data) {
      self.reports.show();
      $('.mask').show();
      self.bindEventDone(data);
      self.reports.find('.accuracy').html(data.accuracy);
      self.renderResList(data.bool);
    }).fail(function() {
      alert('error')
    })
  })
};
SelectWords.prototype.inArray = function(x, arr) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    if (x == arr[i]) {
      return true;
    }
  }
  return false;
};
SelectWords.prototype.renderResList = function(data) {
  var arr = [];
  var str = '';
  var len = data.length;
  for (var i = 0; i < len; i++) {
    if (data[i] === 1) {
      str = '<li class="green-color">' + (i + 1) + '</li>';
    } else {
      str = '<li class="red-color">' + (i + 1) + '</li>';
    }
    arr.push(str);
  }
  this.reports.find('.reports-list').html(arr.join(''))
};
SelectWords.prototype.bindEventDone = function(data) {
  var self = this;
  self.reports.find('.lookUp').on('click', function() {
    self.reports.hide();
    $('.mask').hide();
    self.reRender(data);
  });
  self.articleContent.on('click', 'span.done', function() {
    self.index = $(this).data('indexNum');
    self.renderOneOrder();
    self.renderAnswers(data.analysis);
  });
  self.orderButton.on('click', 'div.done', function() {
    self.index = $(this).index();
    self.renderOneOrder();
    self.renderAnswers(data.analysis);
  })
}
SelectWords.prototype.renderOrderDone = function(data) {
  var self = this;
  var arr = [];
  var len = data.length;
  for (var i = 0; i < len; i++) {
    if (data[i] == 1) {
      arr.push('<div class="order done right-bg">' + (i + 1) + '</div>');
    } else {
      arr.push('<div class="order done error-bg">' + (i + 1) + '</div>');
    }

  }
  self.orderButton.html(arr.join(''));
};
SelectWords.prototype.renderContentDone = function(data) {
  var self = this;
  var dataBool = data.bool;
  var dataMyAnswers = data.myAnswers;
  var dataRightAnswers = data.rightAnswers;
  var _data = data.article.replace(/_____/g, '<span class="blank done"></span>');
  self.articleContent.html(_data);
  var blankSpan = self.articleContent.find('span');
  blankSpan.each(function(index, item) {
    if (dataBool[index] === 1) {
      $(this).data('indexNum', (index)).addClass('green-color');
      console.log($(this).data('indexNum'))
      $(this).html(dataMyAnswers[index]);
    } else if (dataBool[index] === 0) {
      $(this).addClass('error-span').data('indexNum', index);
      $(this).html(dataMyAnswers[index]);
      $(this).after('<span class="blank right-span">' + dataRightAnswers[index] + '</span>')
    } else {
      $(this).addClass('red-color').data('indexNum', index);
      $(this).html(dataMyAnswers[index]);
      $(this).after('<span class="blank right-span">' + dataRightAnswers[index] + '</span>')
    }
  })
}
SelectWords.prototype.reRender = function(data) {
  var self = this;
  self.articleContent.empty();
  self.orderButton.empty();
  self.elem.find('.submit').prop('disabled', true);
  self.optionTable.hide();
  self.renderOrderDone(data.bool);
  self.renderContentDone(data);
}
SelectWords.prototype.renderAnswers = function(data) {
  var self = this;
  self.answers.html(data[self.index]);
}