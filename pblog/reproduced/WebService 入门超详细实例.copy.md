# WebService 入门超详细实例

编程环境：
1、Eclipse mars.2
2、JDK 1.8

如果测试过程中，出现错误，可能是因为 jdk 版本过低，请升级 jdk 版本然后重新测试。

---

---

## 一、创建服务端

### 1、新建 java 项目，命名为 TheService

### 2、在 TestService 下创建包，包名为 com.xx.service，在该包下新建类，命名为 ServiceHello

```java
package com.zl.service;

import javax.jws.WebService;
import javax.xml.ws.Endpoint;

@WebService
public class ServiceHello {

    public String getValue(String name){

        return "hello:"+name;
    }
    public static void main(String[] args) {
        Endpoint.publish("http://localhost:9095/service/ServiceHello", new ServiceHello());
        System.out.println("Publish Success!!! ");
    }

}
```

其中，getValue（String name）是为服务端供客户端调用的方法，main 方法第一句的作用是发布服务端，端口号任意，但必须未被调用。

此外，在类名上方打上`@WebService`的注解。

###### 3、运行`main`方法，若打印出`Publish Success!!!`，则说明服务端发布成功。

![img](https://upload-images.jianshu.io/upload_images/4760019-75512e785d2fc355.png?imageMogr2/auto-orient/strip|imageView2/2/w/862/format/webp)

###### 4、此时发布成功，我们来测试一下。

测试地址：
http://localhost:9095/service/ServiceHello?wsdl
(Service 为固定的，ServiceHello 为类名，?wsdl 为固定的页面)

输入地址，看到 xml 内容，说明发布成功

![img](https://upload-images.jianshu.io/upload_images/4760019-4246d3d3088e8b65.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

### 二、创建客户端：

###### 1、新建 Java Project,命名为 TheClient。

###### 2、在 TestClient 下创建包，包名为 com.xx.client。

###### 3、打开命令提示窗口输入以下命令生成客户端。

格式：wsimport -s "src 目录" -p “生成类所在包名” -keep “wsdl 发布地址”

```cpp
wsimport -s C:\Workspaces\JAVA\TheClient\src -p com.zl.client -keep http://localhost:9095/service/ServiceHello?wsdl
```

###### 4、刷新 TestClient,检查生成类

![img](https://upload-images.jianshu.io/upload_images/4760019-052c9b9acd716e4b.png?imageMogr2/auto-orient/strip|imageView2/2/w/395/format/webp)

### 三、测试

在 com.xx.client 包下，新建类 ServiceTest。

```csharp
package com.zl.client;

public class ServiceTest {
    public static void main(String[] args){
        ServiceHello hello = new ServiceHelloService().getServiceHelloPort();
        String name = hello.getValue("zl");
        System.out.println(name);
    }
}
```

编译测试方法，返回结果.

![img](https://upload-images.jianshu.io/upload_images/4760019-4be60d47643467a3.png?imageMogr2/auto-orient/strip|imageView2/2/w/610/format/webp)

此时，简单的 webservice 实例完成。
