
/* ================================================
   Global site tag (gtag.js) - Google Analytics  
================================================ */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-SNGE4TXFRV');

/* ================================================
   百度访问量统计
================================================ */
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?a9a2284c332611280a6ea5793a0bf60a";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();



/* ============================================= start
   页面信息, 从markdown文件中提取, 提取文件头部 */

const headInfo = {
   headStr: '',
   props: {
      url: [],
      type: '',
      id: '',
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
            // 若值里面有 ',' 则表示数组, 否则为字符串.
            if (vs.length == 1) {
               this.props[k] = vs[0].trim();
            } else {
               this.props[k] = vs.map(it => it.trim()).filter(it => it.length > 0);
            }
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
   
/* 页面信息, 从markdown文件中提取, 提取文件头部 
================================================ end */



/* ============================================= start
   置顶功能 */
$('.to-top').toTop();
/* 置顶功能 
================================================ end */
   


/* ============================================= start
   PWA 离线化 */
if (typeof navigator.serviceWorker !== 'undefined') {
   navigator.serviceWorker.register('/static/js/pwa.js')
}
/* PWA 离线化 
================================================ end */



/* ============================================= start
   随机更改首页面图片方法  
================================================ end */
(function randomChangeCoverBg() {
   var r = document.querySelector(':root');
   var random = Math.ceil(Math.random() * 6);
   r.style.setProperty('--bg-bg', 'url(/static/img/cover-' + random + '.jpg) center center / cover');
})();




/* ============================================= start
   gitalk 评论系统配置  
================================================ end */

const gitalk = new Gitalk({
   clientID: 'edf6d1bdc2b647c0d53f',
   clientSecret: '9b65a8278d7e52a2f8e85d39126796b74e297086',
   repo: 'gitalk-p-note', // 仓库名字
   owner: 'helowcode', // github名字
   admin: ['cpfree'], // 使用人or管理员
   // facebook-like distraction free mode
   distractionFreeMode: false
})

// const gitalk = new Gitalk({
//    clientID: 'faff8cd89408b43aacc0',
//    clientSecret: 'ef8cdceb9d95fb2e48464c2cba8bc2a00120ef91',
//    repo: 'comment-test', // 仓库名字
//    owner: 'helowcode', // github名字
//    admin: ['cpfree'], // 使用人or管理员
//    // facebook-like distraction free mode
//    distractionFreeMode: false
// })

// 获取 gitalk 的 title 和 id
function calcGitalkIdAndTitle () {
   var obj = {id: '', title: ''}
   // 优先从 headInfo 中获取 title 和 id
   if (headInfo && headInfo.props && headInfo.props.id) {
      var props = headInfo.props;
      if (props.id.length <= 50) {
         obj.id = props.id;
         if (props.title && props.title.length <= 50) {
            obj.title = props.title;
         } else {
            obj.title = props.id;
            console.log('配置了title 但是title 没有不合法, title用id替代, title: ' + props.title);
         }
         return obj;
      } else {
         console.warn('配置了Id 但是id 没有不合法 ---- 长度超过50 ==>  id: ', headInfo.props.id);
      }
   }
   // 若 headInfo 中没有配置id和title, 则通过 URL 计算id, title
   var title = location.hash.match(/#(.*?)([?]|$)/)
   if (title != null && title.length > 1) {
      title = title[1];
   } else {
      title = ''
   }
   // gitalk 评论组件 的id,title 不能超过50个字符
   if (!title || title.length > 50) {
      // 取 title 后50个字符
      // title = title.substring(title.length - 50, title.length)
      obj.id = ''
   } else {
      obj.title = title;
      obj.id = title;
   }
   return obj;
}

$docsify.plugins = [].concat(function(i) {
	var e = Docsify.dom;
	i.mounted(function(i) {
		var n = e.create("div");
		n.id = "gitalk-container";
		var t = e.getNode("#main");
		n.style = "width: " + t.clientWidth + "px; margin: 0 auto 20px;", e.appendTo(e.find(".content"), n)
      console.log('gitalk 添加 gitalk-container')
	}), i.doneEach(function(i) {
      // 移除所有元素
      var n = document.getElementById("gitalk-container")
      if (n) {
         for (; n.hasChildNodes();) {
            n.removeChild(n.firstChild);
         }
         var obj = calcGitalkIdAndTitle();
         console.log('gitalk render gitalk-container by ==> ', obj)
         gitalk.options.id = obj.id;
         gitalk.options.title = obj.title;
         // 渲染 gitalk 评论组件(id 和 title 有意义才渲染)
         if (gitalk.options.id && gitalk.options.title && 
            gitalk.options.title.length <= 50 && gitalk.options.id.length <= 50) {
            gitalk.render("gitalk-container")
         }
      }
	})
}, $docsify.plugins);


