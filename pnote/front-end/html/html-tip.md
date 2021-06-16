# skill

[TOC]

## html 导入另一个 html

### 方案一 div 引入

```html
<body>
  <div id="page1"></div>
  <div id="page2"></div>
  <script>
    $("#page1").load("page/Page_1.html");
    $("#page2").load("page/Page_2.html");
  </script>
</body>
```

### 方案二 iframe 引入

```html
<head> </head>
<body>
  <div id="page1">
    <iframe
      width="100%"
      height="170"
      src="page/Page_1.html"
      frameborder="no"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
    ></iframe>
  </div>
  <div id="page2">
    <iframe
      width="100%"
      height="170"
      src="page/Page_2.html"
      frameborder="no"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
    ></iframe>
  </div>
</body>
```

### 方案三 object 引入

```html
<head>
  <object
    style="border:0px"
    type="text/x-scriptlet"
    data="page/Page_1.html"
    width="100%"
    height="150"
  >
  </object>
</head>
```

### 方案四 import 引入(HTML5)

```html
<head>
  <link rel="import" href="page/Page_1.html" id="page1" />
</head>
<body>
  <script>
    console.log(page1.import.body.innerHTML);
  </script>
</body>
```

### 其它

bootstrap 的 panel 组件引入.
或者 easyui 的 window 组件引入.

> https://www.web-tinker.com/article/20637.html

---

## 值传递

### 如何获得父框架的 JS 变量值

```html
<script type="text/javascript">
  var id = 100;
</script>

<iframe src="b.html"> </iframe>
```

`如何在b.html里获得a.html里的JS里的变量id的值？`

1. 方案一 : 获取父页面
   parent.id
   window.parent.id
2. 方案二 : 获取顶层页面对象
   top.id
   window.top.id
3. 方案三 : 通过 dom 对象获取
4. 方案四 : 通过 src 直接将值带进子页面(变量一旦传递就不可变), `<iframe src="b.html?id=xxx">`

## js 与 Json 转换

### JSON 转换为对象

```js
let jsonString =
  '{"type":"assetManagementPlanQuoteAdd","data":{"cesh1":"fjkd2","cesh":"fjkd","cesh2":"fjkd3","par":{"kk":{"qq":"ff"}}}}';
console.log(jsonString);
// 方案一
let obj = $.parseJSON(jsonString);
console.log(obj);
// 方案二
obj = eval("(" + jsonString + ")");
console.log(obj);
// 对象转 JSON
let json = JSON.stringify(obj);
console.log(json);
```

## 判断 js 对象为空

1. 将 json 对象转化为 json 字符串，再判断该字符串是否为"{}"

   ```js
   var data = {};
   var b = JSON.stringify(data) == "{}";
   alert(b); //true
   ```

2. for in 循环判断

   ```js
   var obj = {};
   var b = function() {
     for (var key in obj) {
       return false;
     }
     return true;
   };
   alert(b()); //true
   ```

3. jquery 的 isEmptyObject 方法

   ```js
   var data = {};
   var b = $.isEmptyObject(data);
   alert(b); //true
   ```

   > 此方法是 jquery 将 2 方法(for in)进行封装，使用时需要依赖 jquery

4. Object.getOwnPropertyNames()方法

   ```js
   var data = {};
   var arr = Object.getOwnPropertyNames(data);
   alert(arr.length == 0); //true
   ```

   > <p style="color:red">注意：此方法不兼容ie8，其余浏览器没有测试</p>
   > 此方法是使用Object对象的getOwnPropertyNames方法，获取到对象中的属性名，存到一个数组中，返回数组对象，我们可以通过判断数组的length来判断此对象是否为空

5. 使用 ES6 的 Object.keys()方法

   ```js
   var data = {};
   var arr = Object.keys(data);
   alert(arr.length == 0); //true
   ```

   > 与 4 方法类似，是 ES6 的新方法, 返回值也是对象中属性名组成的数组

## 下载文件

### js 方式

1. `window.open`

   ```js
   window.open("static\\file\\tmpl\\交易对手库机构注册信息表.xlsx", "_self");
   ```

2. a 标签

   ```js
   function downLoadFile(res) {
     const ele = document.createElement("a");
     ele.setAttribute("href", res.url); //设置下载文件的url地址
     ele.setAttribute("download", "download"); //用于设置下载文件的文件名
     ele.click();
   }
   ```

3. form 表单

   ```js
   /**
    *@param {[url]} url [get请求的url地址]
    *@param {[Object]} data [请求参数：{name:value , name2:value2 , name3:value3}]
    */
   function downLoadFile(url, data) {
     var $iframe = $("<iframe />");
     var $form = $('<form  method="get" target="_self"/>');
     $form.attr("action", url); //设置get的url地址
     for (var key in data) {
       //设置请求的参数
       $form.append(
         '<input type="hidden"  name="' + key + '" value="' + data[key] + '" />'
       );
     }
     $iframe.append($form);
     $(document.body).append($iframe);
     $form[0].submit(); //提交表单
     $iframe.remove(); //移除框架
   }
   ```

> ✅

## 下载

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
  </head>
  <body>
    <a href="/download/papers/abc.doc">点击链接下载</a>
    <button onclick="download1()">点击按钮下载</button>
    <button onclick="download2">点击按钮下载</button>

    <script>
      // 会打开一个空白页下载，然后空白页消失，用户体验不好
      function download1() {
        window.open("/download/papers/1");
      }

      // 直接下载，用户体验好
      function download2() {
        var $form = $('<form method="GET"></form>');
        $form.attr("action", "/download/papers/1");
        $form.appendTo($("body"));
        $form.submit();
      }
    </script>
  </body>
</html>
```

### HTML事件处理程序

元素支持的每个事件都可以使用一个相应事件处理程序同名的HTML属性指定。这个属性的值应该是可以执行的JavaScript代码，我们可以为一个button添加 click事件处理程序

`<input type="button" value="Click Here" onclick="alert('Clicked!');" />`
在HTML事件处理程序中可以包含要执行的具体动作，也可以调用在页面其它地方定义的脚本,刚才的例子可以写成这样

   ```html
   <input type="button" value="Click Here" onclick="showMessage();" />
   <script type="text/javascript">
         function showMessage() {
            alert('Clicked!');
         }
   </script>
   ```

在HTML中指定事件处理程序书写很方便，但是有两个缺点。

首先，存在加载顺序问题，如果事件处理程序在html代码之后加载，用户可能在事件处理程序还未加载完成时就点击按钮之类的触发事件，存在时间差问题。

其次，这样书写html代码和JavaScript代码紧密耦合，维护不方便。

### 父子页面相互调用

iframe 子页面获取当前页面src

`window.location.pathname`

父页面获取相关子页面的src

`$('iframe#contentFrame').attr('src')`
