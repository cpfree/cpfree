# mybatis 使用示例

[TOC]

## 简介

> mybatis 直接使用的时候是通过 SqlSessionFactory 来创建会话的, 此时由mybatis对c3p0等数据源以及事物进行管理.
> 但是如果和spring集成的话一般会使用spring对数据源和事物进行管理, 因此还需要mybatis-spring包来帮助集成

## 配置相关(mybatis+C3p0)

### pom 文件

   ```xml
   <!-- 没有填版本号, 一般根据最新的发布版本填入即可 -->
   <dependencies>
      <dependency>
         <groupId>com.mchange</groupId>
         <artifactId>c3p0</artifactId>
      </dependency>
      <dependency>
         <groupId>mysql</groupId>
         <artifactId>mysql-connector-java</artifactId>
      </dependency>
      <dependency>
         <groupId>org.mybatis</groupId>
         <artifactId>mybatis</artifactId>
      </dependency>
      <dependency>
         <groupId>cglib</groupId>
         <artifactId>cglib</artifactId>
      </dependency>
   </dependencies>

   <build>
      <!--告诉 maven, 在打包时, 要打包 resource 下的文件-->
      <resources>
         <resource>
               <directory>src/main/resources</directory>
               <includes>
                  <include>**/*.properties</include>
                  <include>**/*.xml</include>
               </includes>
               <filtering>false</filtering>
         </resource>
         <resource>
               <directory>src/main/java</directory>
               <includes>
                  <include>**/*.xml</include>
               </includes>
               <filtering>false</filtering>
         </resource>
      </resources>
   </build>
   ```

### db.properties

   ```properties
   #mysql
   db.driver=com.mysql.jdbc.Driver
   db.url=jdbc:mysql://127.0.0.1:3306/frame4j?autoReconnect=true&useSSL=false
   db.user=root
   db.password=11111
   ```

### xml 配置文件 mybatis-config.xml

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE configuration
         PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
         "http=//mybatis.org/dtd/mybatis-3-config.dtd">

   <configuration>
      <!-- 配置扫描文件 -->
      <properties resource="db.properties"/>

      <environments default="development">
         <environment id="development">
               <!-- 配置事务类型 -->
               <transactionManager type="JDBC"/>
               <!-- 配置数据源 -->
               <dataSource type="POOLED">
                  <property name="driver" value="${db.driver}"/>
                  <property name="url" value="${db.url}"/>
                  <property name="username" value="${db.user}"/>
                  <property name="password" value="${db.password}"/>
               </dataSource>
         </environment>
      </environments>

      <!-- 配置扫描路径 -->
      <mappers>
         <package name="cn.cpf.mybatis.IDao"/>
      </mappers>

   </configuration>
   ```

### MySqlSessionFactory.java

   ```java
   import org.apache.ibatis.io.Resources;
   import org.apache.ibatis.session.*;

   import java.io.IOException;
   import java.io.InputStream;

   // 配置为饿汉式
   public class MySqlSessionFactory {

      private static SqlSessionFactory sqlSessionFactory = null;

      private MySqlSessionFactory(){}

      static {
            try {
               InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
               sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
         } catch (IOException e) {
               e.printStackTrace();
         }
      }

      public static SqlSession getInstance(){
         return sqlSessionFactory.openSession();
      }

      public static SqlSession getBatchInstance(){
         return sqlSessionFactory.openSession(ExecutorType.BATCH);
      }
   }
   ```

### 简单使用

简单使用(不正确的方式)

   ```java
   public static void main(String[] args) {
      // SqlSession 不是线程同步的, 因此应该用作线程级, 如果用于Web请求的话, 应该用完即销毁(关闭)
      SqlSession instance = MySqlSessionFactory.getInstance();
      UserMapper mapper = instance.getMapper(UserMapper.class);
      User admin = mapper.selectByUsername("admin");
      System.out.println(admin);
      instance.close();
   }
   ```

推荐的方式(使用try()管理)

   ```java
   public static void main(String[] args) {
      // 使用try完成自动关闭
      try (SqlSession instance = MySqlSessionFactory.getInstance()) {
         UserMapper mapper = instance.getMapper(UserMapper.class);
         User admin = mapper.selectByUsername("admin");
         System.out.println(admin);
      }
   }
   ```

## 配置相关(mybatis+C3p0+Spring)

> mybatis 如果和spring集成的话一般会使用spring对数据源和事物进行管理, 因此还需要mybatis-spring包来帮助集成

- Jdbc文件同上

### pom 文件(mybatis+C3p0+Spring)

   ```xml
   <!-- 没有填版本号, 一般根据最新的发布版本填入即可 -->
   <dependencies>
      <dependency>
         <groupId>com.mchange</groupId>
         <artifactId>c3p0</artifactId>
      </dependency>
      <dependency>
         <groupId>mysql</groupId>
         <artifactId>mysql-connector-java</artifactId>
      </dependency>
      <dependency>
         <groupId>org.mybatis</groupId>
         <artifactId>mybatis</artifactId>
      </dependency>
      <dependency>
         <groupId>cglib</groupId>
         <artifactId>cglib</artifactId>
      </dependency>
      <!-- 用于衔接Spring和 Mybatis -->
      <dependency>
         <groupId>org.mybatis</groupId>
         <artifactId>mybatis-spring</artifactId>
      </dependency>
      <!-- Spring 相关 -->
      <dependency>
         <groupId>org.springframework</groupId>
         <artifactId>spring-tx</artifactId>
      </dependency>
      <dependency>
         <groupId>org.springframework</groupId>
         <artifactId>spring-jdbc</artifactId>
      </dependency>
   </dependencies>

   <build>
      <!--告诉 maven, 在打包时, 要打包 resource 下的文件-->
      <resources>
         <resource>
               <directory>src/main/resources</directory>
               <includes>
                  <include>**/*.properties</include>
                  <include>**/*.xml</include>
               </includes>
               <filtering>false</filtering>
         </resource>
         <resource>
               <directory>src/main/java</directory>
               <includes>
                  <include>**/*.xml</include>
               </includes>
               <filtering>false</filtering>
         </resource>
      </resources>
   </build>
   ```

### mybatis-config.xml

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE configuration
         PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
         "http=//mybatis.org/dtd/mybatis-3-config.dtd">

   <configuration>
   </configuration>
   ```

> mybatis-config 此时实际上已经不需要配置了, 如果想加入一些其它内容, 可以在Spring配置文件中引入这个文件

### spring-config.xml 部分配置

```xml

   <!-- 引入入jdbc文件 -->
    <bean id="propertyConfigurer" class="com.cdb.adapter.util.PropertyPlaceHolder" 
        p:ignoreUnresolvablePlaceholders="true">
        <property name="locations">
            <list>
                <value>classpath:jdbc.properties</value>
            </list>
        </property>
    </bean>

    <!--	开启注解扫描 -->
    <context:component-scan base-package="cn.cpf.exercise"></context:component-scan>

    <!-- dataSource -->
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource"
          destroy-method="close">
        <property name="driverClass" value="${db.driver}"></property>
        <property name="jdbcUrl" value="${db.url}"></property>
        <property name="user" value="${db.user}"></property>
        <property name="password" value="${db.password}"></property>
    </bean>

    <!--	开启mapperScanner扫描 -->
    <bean id="mapperScanner" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!-- mybatis Mapper接口 -->
        <property name="basePackage" value="cn.cpf.exercise.base.mapper"/>
    </bean>
    
    <!-- 使用spring的会话管理 -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <!-- mybatis Mapper.xml 文件 -->
        <property name="mapperLocations" value="classpath:mapper/*.xml"/>
    </bean>

    <!--	 使用spring的事务管理 -->
    <bean name="transactionManager"
          class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <tx:annotation-driven transaction-manager="transactionManager"/>

    <!-- 配置当出现Exception、RuntimeException、Exception时采用对应的事务操作 -->
    <tx:advice id="userTxAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="delete*" propagation="REQUIRED" read-only="false"
                       rollback-for="java.lang.Exception" no-rollback-for="java.lang.RuntimeException"/>
            <tx:method name="insert*" propagation="REQUIRED" read-only="false"
                       rollback-for="java.lang.RuntimeException"/>
            <tx:method name="update*" propagation="REQUIRED" read-only="false"
                       rollback-for="java.lang.Exception"/>
            <tx:method name="find*" propagation="SUPPORTS"/>
            <tx:method name="get*" propagation="SUPPORTS"/>
            <tx:method name="select*" propagation="SUPPORTS"/>
        </tx:attributes>
    </tx:advice>

```

### ServiceImpl.java

   ```java
   package cn.cpf.exercise.service;

   import cn.cpf.exercise.abs.RicTypeMapping;
   import cn.cpf.exercise.abs.TcdbBean;
   import cn.cpf.exercise.abs.TcdbMdsMapper;
   import cn.cpf.exercise.base.mapper.*;
   import org.springframework.stereotype.Service;

   import javax.annotation.Resource;
   import java.util.List;

   @Service
   public class InterestServiceImpl implements InterestService {

      @Resource
      private FppInterestMappingMapper fppInterestMappingMapper;

      @Override
      public List<RicTypeMapping> queryNeedSend(String type) {
         return fppInterestMappingMapper.selectRicTypeMapping(type);
      }

      @Override
      public int deleteTableData(String type) {
         return getSuitcaseMapper(type).deleteTableData(type);
      }
   }
   ```

### Mapper.java

   ```java
   package cn.cpf.exercise.base.mapper;

   import cn.cpf.exercise.abs.RicTypeMapping;
   import org.apache.ibatis.annotations.Param;

   import java.util.List;

   public interface FppInterestMappingMapper {

      List<RicTypeMapping> selectRicTypeMapping(@Param("type") String type);

   }
   ```
