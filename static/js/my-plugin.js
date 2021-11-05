
const headInfo = {
   headStr: '',
   props: {
      url: [],
      type: ''
   },
   init: function () {
      headInfo.headStr = '';
      headInfo.props = {};
   },
   // 对 markdown 首行进行解析
   parse: function (content) {
      this.headStr = content;
      content.split('\n').forEach(it => {
         var a = it.indexOf(':');
         if (a > 0) {
            var k = it.substring(0, a).trim();
            var vs = it.substring(a + 2).split(',');
            this.props[k] = vs.map(it => it.trim()).filter(it => it.length > 0);
         }
      })
   },
   renderHtml: function () {
      // url
      var obj = this.props;
      var keywordsHtml = '';
      var urlHtml = '';
      var domHtml = ''
         + '<div class="header-box">'
         + '   <div class="article-info-box">'
         + '      @keywords'
         + '   </div>'
         + '   <div class="ref-url-box">'
         + '      @url'
         + '   </div>'
         + '</div>';
      // render
      if (obj.keywords && obj.keywords.length > 0) {
         keywordsHtml += '<div class="keywords-box"><span class="label">关键字：</span>';
         keywordsHtml += obj.keywords.map(it => '<span class="keywords">' + it + '</span>').join('');
         keywordsHtml += '</div>';
      }
      // render
      if (obj.url && obj.url.length > 0) {
         urlHtml += '<div class="label-url"><span class="label">参考网址：</span></div>' +
            '<div class="ref-url">';
         urlHtml += obj.url.map(it => {
            if (it.startsWith('<') && it.endsWith('>')) {
               it = it.substring(1, it.length-1);
            }
            return it;
         }).map(it => '<a href="' + it + '">' + it + '</a>').join('');
         urlHtml += '</div>';
      }
      domHtml = domHtml.replace('@keywords', keywordsHtml)
      domHtml = domHtml.replace('@url', urlHtml)
      return domHtml;
   }
}

// 置顶功能
$('.to-top').toTop();

// PWA 离线化
if (typeof navigator.serviceWorker !== 'undefined') {
   navigator.serviceWorker.register('/static/js/pwa.js')
}

// 随机更改首页面图片
function randomChangeCoverBg() {
   var r = document.querySelector(':root');
   var random = Math.ceil(Math.random() * 6);
   r.style.setProperty('--bg-bg', 'url(/static/img/cover-' + random + '.jpg) center center / cover');
}
randomChangeCoverBg();

// gitalk 评论系统配置
// const gitalk = new Gitalk({
//    clientID: '971a227f66568ad21bd9',
//    clientSecret: '42eba56ec63f50c5cced68648f9925261ab856c6',
//    repo: 'cpfree', // 仓库名字
//    owner: 'cpfree', // github名字
//    admin: ['cpfree'], // 使用人or管理员
//    // facebook-like distraction free mode
//    distractionFreeMode: false,
//    id: 'my-test-id-1'
// })
const gitalk = new Gitalk({
   clientID: '14d358faa55c2715bde6',
   clientSecret: 'aaee9f49676bea35e11f720391b9b4c0a24d9e1a',
   repo: 'cpfree', // 仓库名字
   owner: 'cpfree', // github名字
   admin: ['cpfree'], // 使用人or管理员
   // facebook-like distraction free mode
   distractionFreeMode: false,
   id: 'my-test-id-2',
   title: 'my-test-title-2'
})
