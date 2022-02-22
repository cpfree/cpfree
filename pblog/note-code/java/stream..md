# stream

## findFirst 和 findAny

有些流有一个出现顺序（encounter order）来指定流中项目出现的逻辑顺序（比如由List或排序好的数据列生成的流）。对于这种流，你可能想要找到第一个元素。为此有一个findFirst方法，它的工作方式类似于findany。

如果是并行流, 而你不关心返回的元素是哪个，请使用findAny，因为它在使用并行流时限制较少。

## tip

1. 使用 stream 获取其中一个, 即刻返回

   因为流的运行规则, 从list里面找到一个数据之后, 即可就可以返回, 而不是循环查找全部.

   ```java
   list.stream()
   	.filter(u -> u.getName().equals("cpf"))
   	.findAny()
   	.ifPresent(u -> System.out.println(u.getName()));
   ```
