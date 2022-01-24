---
keys: 
type: copy,blog,trim
url: <>
id: 220124-202702
---

# spring 配置转换器

## spring 中的 Converter 和 Formater

两者的作用一样，都是类型转换。

`org.springframework.format.Formatter` 只能做 `String` 类型到其他类型的转换。

`org.springframework.core.convert.converter.Converter` 可以做任意类型的转换。

### 配置 Formatter

> Spring 启动后, 会自动注册扫描到的实现 Formatter 的 Component.

```java
@Component
public class UserFormatter implements Formatter<User> {
    @Override
    public User parse(String text, Locale locale) {
        if (NumberUtils.isParsable(text)) {
            User s =  new User();
            s.setAge(Integer.parseInt(text));
            return s;
        }
        return null;
    }

    @Override
    public String print(User money, Locale locale) {
        if (money == null) {
            return null;
        }
        return money.getAge()+"";
    }
}
```

### 配置 Converter

> Spring 启动后, 会自动注册扫描到的实现 Converter 的 Component.

```java
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.core.convert.converter.Converter;

/**
 * <b>Description : </b>
 *
 * @author CPF
 * @date 2019/5/8 21:16
 **/
@Component
public class TimeStringConver implements Converter<String, Date>{

    // 日期转换格式
    private static final String pattern = "yyyy-MM-dd hh:mm:ss";
    // 构造函数
    public TimeStringConver(String pattern) {
        super();
        this.pattern = pattern;
    }

    @Override
    public Date convert(String arg0) {
        if (ValidateUtil.isNumeric(arg0)){
            return new Date(Long.parseLong(arg0));
        }
        //  yyyy-MM-dd
        SimpleDateFormat sd = new SimpleDateFormat(pattern);
        try {
            return sd.parse(arg0);
        } catch (ParseException e) {
            //e.printStackTrace();
            throw new IllegalAccessError("日期转换出错！！");
        }
    }
}
```

## 配置 apache 转换器

> apache 用的转换器和 spring 用的不是同一个, 一般项目里面最好只有一个转换器, 例如使用 spring 转换器.

```java
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.Converter;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;

/**
 * <b>Description : </b>
 *
 * @author CPF
 * @date 2019/5/8 21:45
 **/
@Component
public class AppInit {

    private static Logger logger = LoggerFactory.getLogger(AppInit.class);

    @Service
    public class SearchReceive implements ApplicationListener<ContextRefreshedEvent> {
        @Override
        public void onApplicationEvent(ContextRefreshedEvent event) {
            if (event.getApplicationContext().getParent() == null) {//保证只执行一次
                registerApacheConvert();
            }
        }
    }

    private static void registerApacheConvert(){
        logger.info("registerApacheDateConvert");
        // 注册 Date 转换
        ConvertUtils.register(new Converter() {
            @Override
            public <T> T convert(Class<T> aClass, Object o) {
                if (o == null) {
                    return null;
                }
                if (o instanceof String){
                    String string = (String) o;
                    if (StringUtils.isBlank(string)) {
                        return null;
                    }
                    if (ValidateUtil.isNumeric(string)){
                        return (T) new Date(Long.parseLong(string));
                    }
                }
                logger.warn("org.apache.commons.beanutils.ConvertUtils cover ==> " + o);
                return (T) o;
            }
        }, Date.class);
        // 注册 BigDecimal 转换
        ConvertUtils.register(new Converter() {
            @Override
            public <T> T convert(Class<T> aClass, Object o) {
                if (o == null) {
                    return null;
                }
                if (o instanceof String){
                    String trim = o.toString().trim();
                    if (trim.equals("")) {
                        return null;
                    }
                    return (T)new BigDecimal(trim);
                }
                logger.warn("org.apache.commons.beanutils.ConvertUtils cover ==> " + o);
                return (T) o;
            }
        }, BigDecimal.class);
    }
}
```

