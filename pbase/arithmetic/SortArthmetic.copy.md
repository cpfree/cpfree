# sort

参考自: <https://www.cnblogs.com/onepixel/articles/7674659.html>

## 排序算法简述

排序算法可以分为两大类

   - 比较类排序：通过比较来决定元素间的相对次序，由于其时间复杂度不能突破O(nlogn)，因此也称为非线性时间比较类排序。

   - 非比较类排序：不通过比较来决定元素间的相对次序，它可以突破基于比较排序的时间下界，以线性时间运行，因此也称为线性时间非比较类排序。 

排序算法

   比较排序
      交换排序
         冒泡排序
         快速排序
      插入排序
         简单排序
         希尔排序
      选择排序
         简单选择排序
         堆排序
      归并排序
         二路归并排序
         多路归并排序
   非比较排序
      计数排序
      桶排序
      基数排序

复杂度排序

   ![复杂度排序](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20210822110452.png)


> 相关概念
> 稳定: 如果a原本在b的前面, 而a=b, 排序之后仍然在b的前面
> 不稳定: 如果a原本在b的前面, 而a=b, 排序之后a可能在b的后面

## 排序算法简介

### 选择排序(Selection Sort)

选择排序(Selection-sort)是一种简单直观的排序算法。它的工作原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

![选择排序](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/849589-20171015224719590-1433219824.gif)

算法描述

   1. 给定一组记录, 进行第一轮比较得到最小记录, 将此纪录与第一个记录位置进行交换
   2. 排除第一个记录, 接下来按照步骤1进行

### 选择排序

```java
/**
* Select sort
* @param orderArr
* @param orderDirect ture : Sort from small to large,
*/
public static void selectSort(int[] orderArr, boolean orderDirect) {
   int mx, mxidx;
   for (int i = 0, len = orderArr.length; i < len; i++) {
      mx = orderArr[i];
      mxidx = i;
      for (int j = i + 1; j < len; j++) {
            // 若orderDirext 为 true, 由小至大进行排序
            if ((orderArr[j] < mx) == orderDirect) {
//              if (orderArr[j] < mx) {
               mx = orderArr[j];
               mxidx = j;
            }
      }
      if (mxidx != i) {
            orderArr[mxidx] = orderArr[i];
            orderArr[i] = mx;
      }
   }
}
```

### 插入排序(Insertion Sort)

插入排序（Insertion-Sort）的算法描述是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

![插入排序(Insertion Sort)](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/849589-20171015225645277-1151100000.gif)

算法描述

   - 从第一个元素开始，该元素可以认为已经被排序；
   - 取出下一个元素，在已经排序的元素序列中从后向前扫描；
   - 如果该元素（已排序）大于新元素，将该元素移到下一位置；
   - 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置；
   - 将新元素插入到该位置后；
   - 重复步骤2~5。

   ```java
   // 简化版
   public static void insertSort(int[] orderArr) {
      Objects.requireNonNull(orderArr);
      int j, tmp;
      int len = orderArr.length;
      for (int i = 1; i < len; i++) {
         // 保存代插入数据
         tmp = orderArr[i];
         j = i;
         // 找到数据中大于带插入数据的位置, 否则就将数据向左移动
         while (j >= 1 && orderArr[j - 1] > tmp) {
               orderArr[j] = orderArr[j - 1];
               j--;
         }
         orderArr[j] = tmp;
      }
   }

   /**
   * Select sort
   * 优化版
   * @param orderArr
   * @param orderDirect ture : Sort from small to large,
   */
   public static void insertSort(int[] orderArr, boolean orderDirect) {
      Objects.requireNonNull(orderArr);
      for (int i = 1, len = orderArr.length, j, tmp; i < len; i++) {
         tmp = orderArr[i];
         j = i;
         if (orderDirect) {
               while (j >= 1 && orderArr[j - 1] > tmp) {
                  orderArr[j] = orderArr[j - 1];
                  j--;
               }
         } else {
               while (j >= 1 && orderArr[j - 1] < tmp) {
                  orderArr[j] = orderArr[j - 1];
                  j--;
               }
         }
         orderArr[j] = tmp;
      }
   }
   ```

### 希尔排序(Shell Sort)

1959年Shell发明，第一个突破O(n2)的排序算法，是简单插入排序的改进版。它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫**缩小增量排序**。

算法描述

   - 选择一个增量序列t1，t2，…，tk，其中ti>tj，tk=1；
   - 按增量序列个数k，对序列进行k 趟排序；
   - 每趟排序，根据对应的增量ti，将待排序列分割成若干长度为m 的子序列，分别对各子表进行直接插入排序。仅增量因子为1 时，整个序列作为一个表来处理，表长度即为整个序列的长度。

![希尔排序](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/849589-20180331170017421-364506073.gif)

### 冒泡排序

冒泡排序是一种简单的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。 

![冒泡排序图解](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/849589-20171015223238449-2146169197.gif)

算法描述

   1. 比较相邻的元素, 如果第一个比第二个大, 交换它们.
   2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
   3. 针对所有的元素重复以上的步骤，除了最后一个；
   4. 重复步骤1~3，直到排序完成。

冒泡排序

   ```java
   /**
   * Select sort
   * Sort from small to large
   * @param orderArr
   */
   public static void bubbleSort(int[] orderArr) {
      int len = orderArr.length;
      // iplus 值保持比i大一
      int i;
      while (--len > 0) {
         for (i = 0; i < len; i++) {
               if (orderArr[i] > orderArr[i + 1]) {
                  int tmp = orderArr[i];
                  orderArr[i] = orderArr[i + 1];
                  orderArr[i + 1] = tmp;
               }
         }
      }
   }
   ```

冒泡排序(排序过程中如果一次循环后发现已经排序完成, 则后续无需再比较, 直接退出)

   ```java
   /**
   * Select sort
   * Sort from small to large
   * @param orderArr
   */
   public static void bubbleSort(int[] orderArr) {
      int len = orderArr.length;
      // iplus 值保持比i大一
      int i;
      // 如果一次循环中没有进行交换的元素, 则为false, 否则为true
      boolean flag;
      while (--len > 0) {
         flag = false;
         for (i = 0; i < len; i++) {
               if (orderArr[i] > orderArr[i + 1]) {
                  flag = true;
                  int tmp = orderArr[i];
                  orderArr[i] = orderArr[i + 1];
                  orderArr[i + 1] = tmp;
               }
         }
         if (!flag) {
            break;
         }
      }
   }
   ```

冒泡排序(带方向参数)

   ```java
   /**
   * Select sort
   * @param orderArr
   * @param orderDirect ture : Sort from small to large,
   */
   public static void bubbleSort(int[] orderArr, boolean orderDirect) {
      Objects.requireNonNull(orderArr);
      int len = orderArr.length;
      while (--len > 0) {
         for (int j = 0, jPlus; j < len; j++) {
               jPlus = j + 1;
               if (orderDirect ? orderArr[j] > orderArr[jPlus] : orderArr[j] < orderArr[jPlus]) {
                  int tmp = orderArr[j];
                  orderArr[j] = orderArr[jPlus];
                  orderArr[jPlus] = tmp;
               }
         }
      }
   }
   ```

python版冒泡排序

   ```python
   # 实现一个冒泡排序
   def bubboSort(arr):
      len1 = len(arr) - 1
      i = 0
      while i < len1:
         if arr[i] > arr[i + 1]:
               tmp = arr[i]
               arr[i] = arr[i + 1]
               arr[i+1] = tmp
         i = i + 1
      len1 = len1 - 1
   ```

### 归并排序

归并排序是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为2-路归并。 

![归并排序](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/849589-20171015230557043-37375010.gif)

算法描述
   把长度为n的输入序列分成两个长度为n/2的子序列；
   对这两个子序列分别采用归并排序；
   将两个排序好的子序列合并成一个最终的排序序列。

归并排序是一种稳定的排序方法。和选择排序一样，归并排序的性能不受输入数据的影响，但表现比选择排序好的多，因为始终都是O(nlogn）的时间复杂度。代价是需要额外的内存空间。

   ```js
   function mergeSort(arr) {
      varlen = arr.length;
      if(len < 2) {
         returnarr;
      }
      varmiddle = Math.floor(len / 2),
         left = arr.slice(0, middle),
         right = arr.slice(middle);
      returnmerge(mergeSort(left), mergeSort(right));
   }
   
   function merge(left, right) {
      varresult = [];
   
      while(left.length>0 && right.length>0) {
         if(left[0] <= right[0]) {
               result.push(left.shift());
         }else{
               result.push(right.shift());
         }
      }
   
      while(left.length)
         result.push(left.shift());
   
      while(right.length)
         result.push(right.shift());
   
      returnresult;
   }
   ```

### 快速排序

快速排序的基本思想：通过一趟排序将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，则可分别对这两部分记录继续进行排序，以达到整个序列有序。

![快速排序](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/849589-20171015230936371-1413523412.gif)

快速排序使用分治法来把一个串（list）分为两个子串（sub-lists）。具体算法描述如下：

   从数列中挑出一个元素，称为 “基准”（pivot）；
   重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作；
   递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。

   ```java
   // 快速排序简版, 以第一个数字作为基准
   // [start, end): 包含头,不包含尾
   private static void $quickSort(int[] orderArr, int start, int end) {
      Objects.requireNonNull(orderArr);
      if (start >= end) {
         return;
      }
      int i = start;
      int j = end - 1;
      int tmp = orderArr[i];
      while (i < j) {
         while (i < j && orderArr[j] >= tmp) {
               j --;
         }
         if (i < j) {
               orderArr[i++] = orderArr[j];
         }
         while (i < j && orderArr[i] < tmp) {
               i ++;
         }
         if (i < j) {
               orderArr[j--] = orderArr[i];
         }
      }
      orderArr[i] = tmp;
      $quickSort(orderArr, start, i);
      $quickSort(orderArr, i + 1, end);
   }
   ```

python

```python
# 实现一个快速排序
def quickSort(arr):
   _quickSort(arr, 0, len(arr)-1)

def _quickSort(arr, st, end):
   if st >= end:
      return
   i, j , tmp = st, end, arr[st]
   while i < j:
      while i < j and arr[j] >= tmp:
         j = j - 1
      if i < j:
         arr[i] = arr[j]
         i = i + 1
      while i < j and arr[i] < tmp:
         i = i + 1
      if i < j :
         arr[j] = arr[i]
         j = j -1
   arr[i] = tmp
   _quickSort(arr, st, i - 1)
   _quickSort(arr, i + 1, end)
```

### 堆排序

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/849589-20171015231308699-356134237.gif)

### 计数排序(Counting Sort)

计数排序不是基于比较的排序算法，其核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。 作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

   - 找出待排序的数组中最大和最小的元素；
   - 统计数组中每个值为i的元素出现的次数，存入数组C的第i项；
   - 对所有的计数累加（从C中的第一个元素开始，每一项和前一项相加）；
   - 反向填充目标数组：将每个元素i放在新数组的第C(i)项，每放一个元素就将C(i)减去1。

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/849589-20171015231740840-6968181.gif)

```js
function countingSort(arr, maxValue) {
    varbucket =newArray(maxValue + 1),
        sortedIndex = 0;
        arrLen = arr.length,
        bucketLen = maxValue + 1;
 
    for(vari = 0; i < arrLen; i++) {
        if(!bucket[arr[i]]) {
            bucket[arr[i]] = 0;
        }
        bucket[arr[i]]++;
    }
 
    for(varj = 0; j < bucketLen; j++) {
        while(bucket[j] > 0) {
            arr[sortedIndex++] = j;
            bucket[j]--;
        }
    }
 
    returnarr;
}
```

计数排序是一个稳定的排序算法。当输入的元素是 n 个 0到 k 之间的整数时，时间复杂度是O(n+k)，空间复杂度也是O(n+k)，其排序速度快于任何比较排序算法。当k不是很大并且序列比较集中时，计数排序是一个很有效的排序算法。

### 桶排序(Bucket Sort)

> 参考: <https://blog.csdn.net/csdnsevenn/article/details/83218431?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.base&spm=1001.2101.3001.4242>

桶排序是计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。桶排序 (Bucket sort)的工作的原理：假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排）。

> 试题: 一个长度为20的double数组, 取值范围在`(0, 10)` 内, 要求用最快的速度, 将组内元素排序

> 但数值过大, 或者不是整数时无法使用计数排序的思想, 此时可以采用桶排序.

每一个桶（bucket）代表一个区间范围，里面可以承载一个或多个元素。桶排序的第一步，就是创建这些桶，确定每一个桶的区间范围：

代码示例

   ```js
   function bucketSort(arr, bucketSize) {
      if(arr.length === 0) {
         returnarr;
      }
   
      vari;
      varminValue = arr[0];
      varmaxValue = arr[0];
      for(i = 1; i < arr.length; i++) {
         if(arr[i] < minValue) {
            minValue = arr[i];               // 输入数据的最小值
         }elseif(arr[i] > maxValue) {
            maxValue = arr[i];               // 输入数据的最大值
         }
      }
   
      // 桶的初始化
      varDEFAULT_BUCKET_SIZE = 5;           // 设置桶的默认数量为5
      bucketSize = bucketSize || DEFAULT_BUCKET_SIZE;
      varbucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;  
      varbuckets =newArray(bucketCount);
      for(i = 0; i < buckets.length; i++) {
         buckets[i] = [];
      }
   
      // 利用映射函数将数据分配到各个桶中
      for(i = 0; i < arr.length; i++) {
         buckets[Math.floor((arr[i] - minValue) / bucketSize)].push(arr[i]);
      }
   
      arr.length = 0;
      for(i = 0; i < buckets.length; i++) {
         insertionSort(buckets[i]);                     // 对每个桶进行排序，这里使用了插入排序
         for(varj = 0; j < buckets[i].length; j++) {
               arr.push(buckets[i][j]);                     
         }
      }
   
      returnarr;
   }
   ```


桶排序最好情况下使用线性时间O(n)，桶排序的时间复杂度，取决与对各个桶之间数据进行排序的时间复杂度，因为其它部分的时间复杂度都为O(n)。很显然，桶划分的越小，各个桶之间的数据越少，排序所用的时间也会越少。但相应的空间消耗就会增大。 

时间空间复杂度

   假设原始数列有n个元素，分成m个桶，平均每个桶的元素个数为n/m。

下面我们来逐步分析算法复杂度：

   1. 第一步求数列最大最小值，运算量为n。
   2. 第二步创建空桶，运算量为m。
   3. 第三步遍历原始数列，运算量为n。
   4. 第四步在每个桶内部做排序，由于使用了O（nlogn）的排序算法，所以运算量为 n/m * log(n/m ) * m。
   5. 第五步输出排序数列，运算量为n。

加起来，总的运算量为 `3n+m+ n/m * log(n/m ) * m = 3n+m+n(logn-logm)` 。

去掉系数，时间复杂度为：

   `O(n+m+n(logn-logm))`

空间复杂度就很明显了：

   空桶占用的空间 + 数列在桶中占用的空间 = O（m+n）。

### 基数排序(Radix Sort)

基数排序是按照低位先排序，然后收集；再按照高位排序，然后再收集；依次类推，直到最高位。有时候有些属性是有优先级顺序的，先按低优先级排序，再按高优先级排序。最后的次序就是高优先级高的在前，高优先级相同的低优先级高的在前。

算法描述
   取得数组中的最大数，并取得位数；
   arr为原始数组，从最低位开始取每个位组成radix数组；
   对radix进行计数排序（利用计数排序适用于小范围数的特点）；

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/849589-20171015232453668-1397662527.gif)

```js
varcounter = [];
function radixSort(arr, maxDigit) {
    varmod = 10;
    vardev = 1;
    for(vari = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
        for(varj = 0; j < arr.length; j++) {
            varbucket = parseInt((arr[j] % mod) / dev);
            if(counter[bucket]==null) {
                counter[bucket] = [];
            }
            counter[bucket].push(arr[j]);
        }
        varpos = 0;
        for(varj = 0; j < counter.length; j++) {
            varvalue =null;
            if(counter[j]!=null) {
                while((value = counter[j].shift()) !=null) {
                      arr[pos++] = value;
                }
          }
        }
    }
    returnarr;
}
```

基数排序基于分别排序，分别收集，所以是稳定的。但基数排序的性能比桶排序要略差，每一次关键字的桶分配都需要O(n)的时间复杂度，而且分配之后得到新的关键字序列又需要O(n)的时间复杂度。假如待排数据可以分为d个关键字，则基数排序的时间复杂度将是O(d*2n) ，当然d要远远小于n，因此基本上还是线性级别的。

基数排序的空间复杂度为O(n+k)，其中k为桶的数量。一般来说n>>k，因此额外空间需要大概n个左右。
