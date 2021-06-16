# pro-dubbo&zookeeper

## 注意

1. provider中对Api的实现的注解`@Service`是 `org.apache.dubbo.config.annotation.Service`.
2. consumer对API的自动注入应该是 `org.apache.dubbo.config.annotation.Reference`, 而不是`@AutoWire`

   ```java
   @Reference
   private CommonService commonService;
   ```
