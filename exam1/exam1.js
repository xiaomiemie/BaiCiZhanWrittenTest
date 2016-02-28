$(function(){
 var lq = new LoadQuestion({
  url:'data.json',
  articleElem:$('.article1 .content'),
  optionsElem:$('.article1 .options'),
  answersElem:$('.article1 .right-answer'),
  analysisElem:$('.article1 .answer-analysis')
 });
})