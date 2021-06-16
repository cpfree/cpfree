# mybatis 配置

## 直接使用Mybatis配置

## 使用 spring-mybatis 时的配置




#### 配置一定要放对位置（否则会出现报错）

      The content of element type "configuration" must match "(properties?,settings?,typeAliases?,typeHandlers?,objectFactory?,objectWrapperFactory?,reflectorFactory?,plugins?,environments?,databaseIdProvider?,mappers?)".

#### 列名和属性名不一致的情况

   plan1. 数据库查询起别名
   plan2. 使用 resultMapa


#### 定义别名、
   在mybatis-config.xml 中配置别名， 在映射文件中可以直接使用 alias 配置的值
   ```XML
   <!--定义别名-->
   <typeAliases>
      <typeAlias alias="Student" type="cn.cpf.commons.entity.Student"/>
   </typeAliases>
   ```
####

# Spring配置mapper扫描的两种方式



版权

一, mapperLocations方式

1, spring-mybatis.xml

![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616103454.png)

2, 项目结构

![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616103502.png)

3, numMapper.xml

![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616103507.png)

二, configLocation方式

1, spring-mybatis.xml

![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616103511.png)

2, mybatis-config.xml

![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616103516.png)

3, BankMapper.xml

![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616103523.png)

二者的区别:

mapperLocations方式直接配置dao层和mapper对应的映射关系

configLocation方式以中间代理文件(mybatis-config.xml)的形式, 配置dao层和mapper对应的映射关系

