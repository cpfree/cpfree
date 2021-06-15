/**
* 滑动时间窗口限流实现
* 假设某个服务最多只能每秒钟处理100个请求，我们可以设置一个1秒钟的滑动时间窗口，
* 窗口中有10个格子，每个格子100毫秒，每100毫秒移动一次，每次移动都需要记录当前服务请求的次数 
*/
public class SlidingTimeWindow {
   // 时间窗口内最大请求数
   public final int limit = 100; 
   // 服务访问次数
   Long counter = 0L;
   // 使用LinkedList来记录滑动窗口的10个格子。
   LinkedList<Long> slots = new LinkedList<Long>();
   // 时间划分多少段落
   int split = 10;
   // 是否限流了,true:限流了，false：允许正常访问。
   boolean isLimit = false;

   private void doCheck() throws InterruptedException {
      while (true) {
         slots.addLast(counter);
         if (slots.size() > split) {
            slots.removeFirst();// 超出了，就把第一个移出。
         }

         // 比较最后一个和第一个，两者相差100以上就限流
         if ((slots.peekLast() - slots.peekFirst()) > limit) {
            System.out.println("限流了。。");
            // 修改限流标记为true
            isLimit = true;
         } else {
            // 修改限流标记为false
            isLimit = false;
         }
         Thread.sleep(1000/split);
      }
   }

   /**
    * 测试
    * @param args
    * @throws InterruptedException 
    */
   public static void main(String[] args) throws InterruptedException {
      SlidingTimeWindow timeWindow = new SlidingTimeWindow();
      //开启一个线程判断当前的限流情况.
      new Thread(new Runnable() {
         @Override
         public void run() {
            try {
               timeWindow.doCheck();
            } catch (InterruptedException e) {
               e.printStackTrace();
            }
         }
      }).start();
      
      
      //模拟请求.
      while(true) {
         //判断是否被限流了.
         if(!timeWindow.isLimit) {
            timeWindow.counter++;
            //未被限流执行相应的业务方法.
            //  executeBusinessCode();
            //模拟业务执行方法时间.
            Thread.sleep(new Random().nextInt(15));
            System.out.println("业务方法执行完了...");
         }else {
            System.out.println("被限流了，直接返回给用户");
         }
      }
   }
}