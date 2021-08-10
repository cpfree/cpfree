#

## MultipartFile 处理

### 方法1

```java
　　   MultipartFile file = xxx;
      CommonsMultipartFile cf= (CommonsMultipartFile)file; 
      DiskFileItem fi = (DiskFileItem)cf.getFileItem(); 

      File f = fi.getStoreLocation();

　　会在项目的根目录的临时文件夹下生成一个文件；
```

```java
let params = {phone:'19951235679', phone2:'199512356791', phone3:'199512356793'};
    let temp_form = document.createElement("form");
    temp_form.action = 'http://localhost:8080/pcRegister/toBindAccount';
    //如需打开新窗口，form的target属性要设置为'_blank'
    temp_form.target = "_self";
    temp_form.method = "post";
    temp_form.style.display = "none";
    //添加参数
    for (let key in params) {
        let opt = document.createElement("textarea");
        opt.name = key;
        opt.value = params[key];
        temp_form.appendChild(opt);
    }
    document.body.appendChild(temp_form);
    //提交数据
    temp_form.submit();

```

```java
```

```java
```

```java
```

第二种方法：

　　  transferTo(File dest)；

　　会在项目中生成一个新文件；

第三种方法：　  

　　File f = (File) xxx 强转即可。前提是要配置multipartResolver，要不然会报类型转换失败的异常。

　　　　<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <property name="maxUploadSize" value="104857600"/>
        <property name="maxInMemorySize" value="4096"/>
    </bean>
　　没试过；
第四种方法：
　　Workbook wb = Workbook.getWorkbook(xxx .getInputStream());
　　转换为输入流，直接读取；
第五种方法：
　　byte[] buffer = myfile.getBytes();
　　先转换为字节数组，没试过；