# quartz-summary

## summary

1. Job 表示一个工作，要执行的具体内容。此接口中只有一个方法，如下：

   ```java
   void execute(JobExecutionContext context)
   ```

2. JobDetail 表示一个具体的可执行的调度程序，Job 是这个可执行程调度程序所要执行的内容，另外 JobDetail 还包含了这个任务调度的方案和策略。
3. Trigger 代表一个调度参数的配置，什么时候去调。
4. Scheduler 代表一个调度容器，一个调度容器中可以注册多个 JobDetail 和 Trigger。当 Trigger 与 JobDetail 组合，就可以被 Scheduler 容器调度了。

## Quartz API

1. Scheduler - 与调度程序交互的主要API。
2. Job - 你想要调度器执行的任务组件需要实现的接口
3. JobDetail - 用于定义作业的实例。
4. Trigger（即触发器） - 定义执行给定作业的计划的组件。
5. JobBuilder - 用于定义/构建 JobDetail 实例，用于定义作业的实例。
6. TriggerBuilder - 用于定义/构建触发器实例。
7. Scheduler 的生命期，从 SchedulerFactory 创建它时开始，到 Scheduler 调用shutdown() 方法时结束；Scheduler 被创建后，可以增加、删除和列举 Job 和 Trigger，以及执行其它与调度相关的操作（如暂停 Trigger）。但是，Scheduler 只有在调用 start() 方法后，才会真正地触发 trigger（即执行 job），见教程一。

