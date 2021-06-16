# java tip

## for(;;)和while(true)的区别

> TODO `while (1);` 不是java语言, 此处可能不对

一直知道for(;;)和while(true)都是无限循环，今天搜了下原理

在编程中，我们常常需要用到无限循环，常用的两种方法是while (1) 和 for (；；)。这两种方法效果完全一样，但那一种更好呢？让我们看看它们编译后的代码：

`while (1);`编译后

   ```assembly
   test eax,eax
   je foo+23h
   jmp foo+18h
   ```

`for(;;);`编译后

   ```assembly
   jmp foo+23h
   ```

> 一目了然，`for(;;)`指令少，不占用寄存器，而且没有判断跳转，比while (1)好。
> while 虽然比 for 指令多了三行，但也仅仅多了三行指令, 三行指令的优化在实际开发中的效果微乎其微, 与其关注这些微不足道的东西, 不如将重点放在可维护性上, 毕竟`while(true);` 比 `for(;;)` 更容易理解.
