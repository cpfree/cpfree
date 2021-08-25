# question

<details>
<summary>
1. `if (a > b){}` 和 `if (a - b > 0)` 之间有什么区别
</summary>
   `a > b` 两个数的比较不会有溢出问题, `a - b > 0` 里面有运算可能会造成溢出问题.
</details>

<details>
<summary>
2. a, b 两个整型变量如何在没有第三个变量的情况下实现替换.
</summary>
   利用加减法和位运算

   ```java
   int a, b;
   a = a + b;
   b = a - b;
   a = a - b;
   ```
</details>
