# project-question

## build时打包时总是不能把resources资源打包进class文件中

后来发现

```xml
    <groupId>cn.cpf</groupId>
    <artifactId>endpoint-io-transfer</artifactId>
    <packaging>pom</packaging>
    <version>1.0-RELEASE</version>
```

其中的 `packaging`, 写成了 `pom` 应该改为jar, 之后刷新下就好了

