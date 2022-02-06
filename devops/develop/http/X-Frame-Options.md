# X-Frame-Options

X-Frame-Options 头主要是为了防止站点被别人劫持,iframe引入

X-Frame-Options 有三个值:

- DENY: 表示该页面不允许在 frame 中展示，即便是在相同域名的页面中嵌套也不允许。
- SAMEORIGIN: 表示该页面可以在相同域名页面的 frame 中展示。
- `ALLOW-FROM uri`: 表示该页面可以在指定来源的 frame 中展示。

> 另外, 还可以直接去掉这个头, 此时表示所有的url都不限制.

## 1.springboot 配置

spring-security 支持 EnableWebSecurity 这个anotation来设置不全的安全策略

```java
import com.alibaba.spring.websecurity.DefaultWebSecurityConfigurer;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.header.writers.frameoptions.WhiteListedAllowFromStrategy;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
 
import java.util.Arrays;
 
@EnableWebSecurity
@Configuration
public class WebSecurityConfig extends DefaultWebSecurityConfigurer {
 
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
       //disable 默认策略。 这一句不能省。 
        http.headers().frameOptions().disable();
       //新增新的策略。 
        http.headers().addHeaderWriter(new XFrameOptionsHeaderWriter(
                new WhiteListedAllowFromStrategy(
                        Arrays.asList("http://itaobops.aliexpress.com", "https://cpp.alibaba-inc.com",
                                "https://pre-cpp.alibaba-inc.com"))));
    }
}
```

上面配置语句

1. `http.headers().frameOptions().sameOrigin()`: 表示该页面可以在相同域名页面的 frame 中展示。
2. `http.headers().frameOptions().disable();`: 直接去除x-frame-options header配置

## nginx 配置

- add_header X-Frame-Options ALLOWALL; #允许所有域名iframe
- add_header X-Frame-Options DENY; #不允许任何域名iframe,包括相同的域名
- add_header X-Frame-Options SANEORIGIN; #允许相同域名iframe,如a.test.com允许b.test.com
- add_header X-Frame-Options ALLOW-FROM uri; #允许指定域名iframe,

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1644066351125.png)
