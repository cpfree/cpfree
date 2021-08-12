# jquery 实现把 span 标签 替换成a标签

## jquery 将 span 和 a 标签互换

1. 粗狂的方案：

   ```java
   // 假设span的数目比a多,先备份少的,然后替换多的,然后在把备份替换回来。顺序不能错。
   $('a').replaceWith(function(){
      return $("<a2 />", {html: $(this).html()});
   });
   $('span').replaceWith(function(){
      return $("<a />", {html: $(this).html()});
   });
   $('a2').replaceWith(function(){
      return $("<span />", {html: $(this).html()});
   });
   ```

2. 细致的方案:

   // 初始化的时候，给全部span跟a不同的class。然后,假设span的数目比a多, 从最多的开始替换。顺序不能错。

   ```java
   $('span.spanClassName').replaceWith(function(){
      return $("<a />", {html: $(this).html(), class:$(this).attr('class')});
   });

   $('a.aClassName').replaceWith(function(){
      return $("<span />", {html: $(this).html(), class:$(this).attr('class')});
   });
   ```
