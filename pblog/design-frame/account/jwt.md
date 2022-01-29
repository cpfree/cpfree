---
keys: 
type: copy,blog,trim
url: <>
id: 220129-220528
---

# JWT(java web token)

> 参考自: 
> - <https://www.cnblogs.com/wrc-blog/p/14256071.html>
> - <https://www.jianshu.com/p/e34a579c63a0>

## JWT简介

- JWT 是基于 RFC 7519 标准定义的一种可以安全传输的规范, 这个规范允许我们使用 JWT 在前后端之间传递安全可靠的信息。
- JWT 由于使用了数字签名，所以是可信任和安全的。

通过 session 管理用户登录状态成本越来越高，使用无状态的 token 的方式做登录身份校验显得越来越流行，不仅可以减轻服务器的压力, 由于 token 是在授权头（Authorization header）中发送的，因此做单点登陆的时候还没有cookie跨域问题.

而 JWT(java web token) 就是目前最流行的单点登录跨域身份验证解决方案。

## JWT 组成

一个 JWT 实际上就是一个字符串，未加密前的 jwt 就是一个`json`, 它由**头部、载荷与签名**三部分组成。

1. header(头部): 用于描述关于该 JWT 的最基本的信息，例如其类型以及签名所用的算法等。

   ```json
   {
     "typ": "JWT",
     "alg": "HS256"
   }
   ```

   header 主要包含两个部分, `alg` 指加密类型，可选值为 `HS256`、`RSA` 等等，`typ=JWT` 为固定值，表示 token 的类型。

2. payload(载荷): 载荷就是存放有效信息的地方。

   ```json
   {
     "sub": "1340502208",
     "name": "John Doe",
     "role": "admin"
   }
   ```

   官方定义的 payload 一般包括以下内容

   - iss：Issuer，发行者
   - sub：Subject，主题
   - aud：Audience，观众
   - exp：Expiration time，过期时间
   - nbf：Not before
   - iat：Issued at，发行时间
   - jti：JWT ID

3. signature(签证): jwt 的第三部分是一个签证信息，这个签证信息由三部分组成

   1. 头部经 base64 编码后的字符
   2. 是载荷经 base64 编码后的字符
   3. 是盐（密钥），通常存于服务器

   之后将`1`和`2`用`.`连接，通过头部中声明的加密算法进行加盐（3）计算，得到第三部分, 伪代码如下.

   ```code
   EncodeString = Base64(header) + "." + Base64(payload)
   token = HS256(EncodeString, "秘钥")
   ```

   > 签名是用于验证消息在传递过程中有没有被更改，并且，对于使用私钥签名的 token，它还可以验证 JWT 的发送方是否为它所称的发送方。

下面是一个JWT示例, 对应的密钥是 `123456`

   ```log
      eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0ODIzIiwic3ViIjoiQ1BGIiwiaWF0IjoxNjQzNDY1MzM3LCJleHAiOjE2NDM0Njg5MzcsInJvbGVzIjoiYWRtaW4sdXNlciIsImVtYWlsIjoiMTIzQG9oLmNvbSJ9.JBmv97KOYYNRsKKcHpy26uLPN6JrwJzV_WdqzIpwEx0
   ```

   可以去 <https://jwt.io/> 上面去验证解析.

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1643465822645.png)

## JWT 工作原理

1. 首先, 用户登录后, 服务器向前台发送一个 JWT.

2. 用户想要访问受保护的路由或者资源的时候，应当携带 `JWT`，通常放在请求头中的 `Authorization` 上, 如 `Bearer token`

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1643444967390.png)

3. 服务器的路由或网关去检查 Authorization header 中的 JWT 是否有效，如果有效，则用户可以访问受保护的资源。

#### JWT 验证过程

1. 签名验证

   服务器获取到一个 JWT 的时候，首先要对这个 JWT 的完整性进行验证，这个就是签名认证。

   验证方式如下:

   1. 截开 JWT 前缀, 根据上面内容来看是 `Bearer `, 获取到 `token`.
   2. 分离 `token` 为 header, payload, signature.
   3. 对 header 做 base64 解码, 获得 JWT 使用的算法编码.
   4. 使用后端保存的密钥, 和得到的编码对 header, payload 进行签证计算, 算出 signature.

      如 header 使用的编码为 `HS256`. 则执行以下伪代码.

      ```code
      EncodeString = Base64(header) + "." + Base64(payload)
      token = HS256(EncodeString, "秘钥")
      ```

      > 接收方生成签名的时候必须使用跟 JWT 发送方相同的密钥，意味着要做好密钥的安全传递或共享

   5. 将算出的 signature 与 token 带的 signature 进行对比, 若完全相同, 表明信息是正确的. 若不同，就可以认为这个 JWT 是一个被篡改过的串，自然就属于验证失败了。

2. 载体验证

   > 在验证一个 JWT 的时候，签名认证是每个实现库都会自动做的，但是 payload 的认证是由使用者来决定的。由于载体里面存放的内容根据需求各有不同, 因此, 载体验证一般需要由使用者亲自完成.

   > 以下是官方的载体验证规范.

   - iss(Issuser)：如果签发的时候这个 claim 的值是“a.com”，验证的时候如果这个 claim 的值不是“a.com”就属于验证失败
   - sub(Subject)：如果签发的时候这个 claim 的值是“liuyunzhuge”，验证的时候如果这个 claim 的值不是“liuyunzhuge”就属于验证失败
   - aud(Audience)：如果签发的时候这个 claim 的值是“['b.com','c.com']”，验证的时候这个 claim 的值至少要包含 b.com，c.com 的其中- 一个才能验证通过
   - exp(Expiration time)：如果验证的时候超过了这个 claim 指定的时间，就属于验证失败；nbf(Not Before)：如果验证的时候小于这- 个 claim 指定的时间，就属于验证失败
   - iat(Issued at)：它可以用来做一些 maxAge 之类的验证，假如验证时间与这个 claim 指定的时间相差的时间大于通过 maxAge 指定的一个- 值，就属于验证失败
   - jti(JWT ID)：如果签发的时候这个 claim 的值是“1”，验证的时候如果这个 claim 的值不是“1”就属于验证失败

   > 以登录认证来说，在签发 JWT 的时候，完全可以只用 sub 跟 exp 两个 claim，用 sub 存储用户的 id，用 exp 存储它本次登录之后的过期时间，然后在验证的时候仅验证 exp 这个 claim，以实现会话的有效期管理。

## JWT 生成与解析代码实例

1. 引入依赖

   ```xml
   <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt</artifactId>
      <version>0.9.1</version>
   </dependency>
   ```

2. 编写测试类

   ```java
   import io.jsonwebtoken.Claims;
   import io.jsonwebtoken.JwtBuilder;
   import io.jsonwebtoken.Jwts;
   import io.jsonwebtoken.SignatureAlgorithm;
   import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

   import java.util.Date;

   public class JwtTest {

      @Test
      public void testJwt() throws InterruptedException {
         Date date = new Date();

         final String encodeString = "123456";

         //生成jwt令牌
         JwtBuilder jwtBuilder = Jwts.builder()
                  // 设置载荷 : jwt编码, 对象, 签发日期, 过期时间
                  .setId("4823")
                  .setSubject("CPF")
                  .setIssuedAt(date)
                  .setExpiration(new Date(date.getTime() + 3600 * 1000))
                  // 设置自定义的载荷
                  .claim("roles","admin,user")
                  .claim("email","123@oh.com")
                  // 使用 HS256 对称加密算法签名, 第二个参数为秘钥
                  .signWith(SignatureAlgorithm.HS256, encodeString);

         // 生成 jwt
         final String jwtToken = jwtBuilder.compact();
         System.out.println("生成的JWT: " + jwtToken);

         // 解析 jwt
         final Claims claims = Jwts.parser().setSigningKey(encodeString).parseClaimsJws(jwtToken).getBody();
         System.out.println("解析的内容: " + claims);

         // 更换一个 ID
         jwtBuilder.setId("1234");
         final String jwtToken2 = jwtBuilder.compact();
         System.out.println("\n替换id后的Jwt: " + jwtToken2);

         final String[] split1 = jwtToken.split("\\.");
         final String[] split2 = jwtToken2.split("\\.");
         final String errToken = split1[0] + "." + split2[1] + "." + split1[2];
         System.out.println("将两个JWT的载荷进行拼接JWT : " + errToken);

         System.out.println("\n然后就发现解析会失败!");
         // 解析 jwt
         Jwts.parser().setSigningKey(encodeString).parseClaimsJws(errToken).getBody();
      }

   }
   ```

3. 输出

   ```log
   生成的JWT: eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0ODIzIiwic3ViIjoiQ1BGIiwiaWF0IjoxNjQzNDQ4MzEyLCJleHAiOjE2NDM0NTE5MTIsInJvbGVzIjoiYWRtaW4sdXNlciIsImVtYWlsIjoiMTIzQG9oLmNvbSJ9.h-0EDrWj7Lnqfz7Jnjt0DKrGwvdicaA8BKlxJroYWB0
   解析的内容: {jti=4823, sub=CPF, iat=1643448312, exp=1643451912, roles=admin,user, email=123@oh.com}

   替换id后的Jwt: eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMjM0Iiwic3ViIjoiQ1BGIiwiaWF0IjoxNjQzNDQ4MzEyLCJleHAiOjE2NDM0NTE5MTIsInJvbGVzIjoiYWRtaW4sdXNlciIsImVtYWlsIjoiMTIzQG9oLmNvbSJ9.4cf8EQO1Vfm9Bcu2GCIJGlAt4eKbqb_Q_26-tfFUHao
   将两个JWT的载荷进行拼接JWT : eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMjM0Iiwic3ViIjoiQ1BGIiwiaWF0IjoxNjQzNDQ4MzEyLCJleHAiOjE2NDM0NTE5MTIsInJvbGVzIjoiYWRtaW4sdXNlciIsImVtYWlsIjoiMTIzQG9oLmNvbSJ9.h-0EDrWj7Lnqfz7Jnjt0DKrGwvdicaA8BKlxJroYWB0

   然后就发现解析会失败!

   Exception in thread "main" io.jsonwebtoken.SignatureException: JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted.
      at io.jsonwebtoken.impl.DefaultJwtParser.parse(DefaultJwtParser.java:354)
      at io.jsonwebtoken.impl.DefaultJwtParser.parse(DefaultJwtParser.java:481)
      at io.jsonwebtoken.impl.DefaultJwtParser.parseClaimsJws(DefaultJwtParser.java:541)
   ```

## JWT 使用 RSA 加密实例

相对于 `HS256` 对称加密, `RSA` 非对称加密更加安全一些.

### 用 JDK 中的 keytool 生成 RSA 证书

   为了生成 JWT Token 我们还需要使用 RSA 算法来进行签名。这里我们使用 JDK 提供的证书管理工具 Keytool 来生成 RSA 证书 ，格式为 `jks` 格式。

#### keytool 生成证书命令参考：

   ```shell
   keytool -genkey -alias felordcn -keypass felordcn -keyalg RSA -storetype PKCS12 -keysize 1024 -validity 365 -keystore d:/keystores/felordcn.jks -storepass 123456 -dname "CN=(Felord), OU=(felordcn), O=(felordcn), L=(zz), ST=(hn), C=(cn)"
   ```

   命令参数详解

   | 参数        | 默认               | 含义                                                                                                                                        |
   | ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
   | genkey      |                    | 在用户主目录中创建一个默认文件".keystore",还会产生一个 mykey 的别名，mykey 中包含用户的公钥、私钥和证书                                     |
   | alias       | `mykey`            | 产生别名                                                                                                                                    |
   | keystore    | `用户系统默认目录` | 指定密钥库的名称(产生的各类信息将不在.keystore 文件中)                                                                                      |
   | keyalg      | `DSA`              | 指定密钥的算法 (如 RSA DSA（如果不指定默认采用 DSA）)                                                                                       |
   | validity    |                    | 指定创建的证书有效期多少天                                                                                                                  |
   | keysize     | `1024`             | 指定密钥长度                                                                                                                                |
   | storepass   |                    | 指定密钥库的密码(获取 keystore 信息所需的密码)                                                                                              |
   | keypass     |                    | 指定别名条目的密码(私钥的密码)                                                                                                              |
   | dname       |                    | 指定证书拥有者信息 例如： "CN=名字与姓氏,OU=组织单位名称,O=组织名称,L=城市或区域名称,ST=州或省份名称,C=单位的两字母国家代码"                |
   | list        |                    | 显示密钥库中的证书信息 keytool -list -v -keystore 指定 keystore -storepass 密码                                                             |
   | v           |                    | 显示密钥库中的证书详细信息                                                                                                                  |
   | export      |                    | 将别名指定的证书导出到文件 keytool -export -alias 需要导出的别名 -keystore 指定 keystore -file 指定导出的证书位置及证书名称 -storepass 密码 |
   | file        |                    | 参数指定导出到文件的文件名                                                                                                                  |
   | delete      |                    | 删除密钥库中某条目 keytool -delete -alias 指定需删除的别 -keystore 指定 keystore -storepass 密码                                            |
   | printcert   |                    | 查看导出的证书信息 keytool -printcert -file yushan.crt                                                                                      |
   | keypasswd   |                    | 修改密钥库中指定条目口令 keytool -keypasswd -alias 需修改的别名 -keypass 旧密码 -new 新密码 -storepass keystore 密码 -keystore sage         |
   | storepasswd |                    | 修改 keystore 口令 keytool -storepasswd -keystore e:/yushan.keystore(需修改口令的 keystore) -storepass 123456(原始密码) -new yushan(新密码) |
   | import      |                    | 将已签名数字证书导入密钥库 keytool -import -alias 指定导入条目的别名 -keystore 指定 keystore -file 需导入的证书                             |

#### keytool 生成命令实操

1. 用 JDK 中的 keytool 生成 RSA 证书, 生成 rsa.jws

   `keytool -genkey -keyalg RSA -alias oh -keypass 212003 -storepass 456123 -keystore P:\git\rsa.jws`

   其中 `-alias oh -keypass 212003 -storepass 456123` 我们要作为配置使用要记下来。我们要使用下面定义的这个类来读取证书

   > - 在控制台输入之后, 会提示`名字与姓氏`, 组织名称之类的乱七八糟的东西, 先填就填, 不填可以直接回车通过, 最后在否的地方输入个 `y` 就可以.
   > - 最后还会提示 _迁移到行业标准格式 PKCS12_ 之类的, 可以不用管, 

   ```shell
   D:\programing\sdk\jdk-current\bin>keytool -genkey -keyalg RSA -alias oh -keypass 212003 -storepass 456123 -keystore P:\git\rsa.jws
   您的名字与姓氏是什么?
   [Unknown]:  chen
   您的组织单位名称是什么?
   [Unknown]:  hydroxyl
   您的组织名称是什么?
   [Unknown]:
   您所在的城市或区域名称是什么?
   [Unknown]:
   您所在的省/市/自治区名称是什么?
   [Unknown]:
   该单位的双字母国家/地区代码是什么?
   [Unknown]:
   CN=chen, OU=hydroxy, O=Unknown, L=Unknown, ST=Unknown, C=Unknown是否正确?
   [否]:  y

   Warning:
   JKS 密钥库使用专用格式。建议使用 "keytool -importkeystore -srckeystore P:\git\rsa.jws -destkeystore P:\git\rsa.jws -deststoretype pkcs12" 迁移到行业标准格式 PKCS12。
   ```

2. 通过代码去验证生成的`rsa.jwt`文件是否能正常使用

   ```java

   import javax.crypto.BadPaddingException;
   import javax.crypto.Cipher;
   import javax.crypto.IllegalBlockSizeException;
   import javax.crypto.NoSuchPaddingException;
   import java.io.FileInputStream;
   import java.security.*;
   import java.security.cert.Certificate;
   import java.util.Base64;
   import java.util.Enumeration;

   public class RsaUtils {

      private static Signature getSignature(String algorithm, String provider) throws NoSuchAlgorithmException, NoSuchProviderException {
         Signature signature;
         if (null == provider || provider.length() == 0) {
               signature = Signature.getInstance(algorithm);
         } else {
               signature = Signature.getInstance(algorithm, provider);
         }
         return signature;
      }

      /**
      * 验签
      */
      public static boolean verify(byte[] message, byte[] signMessage, PublicKey publicKey, String algorithm,
                                    String provider) throws NoSuchAlgorithmException, NoSuchProviderException, InvalidKeyException, SignatureException {
         Signature signature = getSignature(algorithm, provider);
         signature.initVerify(publicKey);
         signature.update(message);
         return signature.verify(signMessage);
      }

      /**
      * 签名
      */
      public static byte[] sign(byte[] message, PrivateKey privateKey, String algorithm, String provider) throws NoSuchAlgorithmException, NoSuchProviderException, InvalidKeyException, SignatureException {
         Signature signature = getSignature(algorithm, provider);
         signature.initSign(privateKey);
         signature.update(message);
         return signature.sign();
      }

      /**
      * 公钥加密
      */
      public static byte[] encrypt(byte[] content, PublicKey publicKey) throws NoSuchPaddingException, NoSuchAlgorithmException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException {
         Cipher cipher = Cipher.getInstance("RSA");
         cipher.init(Cipher.ENCRYPT_MODE, publicKey);
         return cipher.doFinal(content);
      }

      /**
      * 私钥解密
      */
      public static byte[] decrypt(byte[] content, PrivateKey privateKey) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
         Cipher cipher = Cipher.getInstance("RSA");
         cipher.init(Cipher.DECRYPT_MODE, privateKey);
         return cipher.doFinal(content);
      }

      @SuppressWarnings("java:S106")
      public static void main(String[] args) throws Exception {

         final String jwtFilePath = "P:\\git\\rsa.jws";
         final String storePass = "456123";
         final String keyPass = "212003";
         final String keyAlias = "oh";

         // 加载 JWS 文件
         KeyStore keyStore = KeyStore.getInstance("JKS");
         try (FileInputStream in = new FileInputStream(jwtFilePath)) {
               keyStore.load(in, storePass.toCharArray());
         }

         // 获取公钥
         Certificate certificate = keyStore.getCertificate(keyAlias);
         PublicKey publicKey = certificate.getPublicKey();
         String publicKeyString = Base64.getEncoder().encodeToString(publicKey.getEncoded());
         System.out.println("publicKey ==> " + publicKeyString);

         // 加载私钥, 加载私钥需要密码
         PrivateKey privateKey  = (PrivateKey) keyStore.getKey(keyAlias, keyPass.toCharArray());
         String privateKeyString = Base64.getEncoder().encodeToString(privateKey.getEncoded());
         System.out.println("privateKey ==> "+ privateKeyString);
         System.out.println();

         /* 公钥加密, 私钥解密 */
         final String secretString = "这是密文-这是密文-这是密文";
         System.out.println("加密前 ==> " + secretString);

         byte[] secretByte = encrypt(secretString.getBytes(), publicKey);
         System.out.println("公钥加密 ==> " + Base64.getEncoder().encodeToString(secretByte));

         byte[] decodeByte = decrypt(secretByte, privateKey);
         System.out.println("私钥解密 ==> " + new String(decodeByte));
         System.out.println();


         /* 私钥签名加密, 公钥验证 */
         final String signSecretString = "密文信息";
         // 测试签名
         final byte[] sha1withRSAS = sign(signSecretString.getBytes(), privateKey, "SHA1withRSA", null);
         System.out.println("私钥签名: " + Base64.getEncoder().encodeToString(sha1withRSAS));

         // 公钥验证
         boolean verify = verify(signSecretString.getBytes(), sha1withRSAS, publicKey, "SHA1withRSA", null);
         System.out.println("公钥验证: " + verify);
      }
   }
   ```

3. 打印输出

   ```log
   keyAlias: oh
   publicKey ==> MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlQUvw6ZEAhlxpSZWPyHuFsFiWAYgdSiM4hEVxzweZsOMian+VvsonVUzv9358Zqh+rZ/i1uQ5CeJmarfXL83LM7KNcv/O7YP98wh9N3BtCpyQwo9wcx0Ph7//T4mWnc75qCmTeOxIidi68NRisHDzg1T61u2LDyALWtb1SoOV5wt3Nts0cq+lPNxh4QTGGe2nP+mbI88VxQviCTUNneKPpBiJ7rQ2E8UYwC7WYrqLc7ZlpuYCUsZvDfsxFvBqWnCAuVMd/GxBkrOB+YbWCh7ez5TdEofU1LrgsPyrILRR7kW7NZZ2nCGfv/p8TEYqaDiyXZZzGvmDwsD/8b3YYgohwIDAQAB
   privateKey ==> MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCVBS/DpkQCGXGlJlY/Ie4WwWJYBiB1KIziERXHPB5mw4yJqf5W+yidVTO/3fnxmqH6tn+LW5DkJ4mZqt9cvzcszso1y/87tg/3zCH03cG0KnJDCj3BzHQ+Hv/9PiZadzvmoKZN47EiJ2Lrw1GKwcPODVPrW7YsPIAta1vVKg5XnC3c22zRyr6U83GHhBMYZ7ac/6ZsjzxXFC+IJNQ2d4o+kGInutDYTxRjALtZiuotztmWm5gJSxm8N+zEW8GpacIC5Ux38bEGSs4H5htYKHt7PlN0Sh9TUuuCw/KsgtFHuRbs1lnacIZ+/+nxMRipoOLJdlnMa+YPCwP/xvdhiCiHAgMBAAECggEAVM4O0JjeOxOfyQx4KJV2mRyUiuNxtTrOchim/CsKYhEG+ZD0XSuxgVfri1UX2JbXd4ZEL1p8qlqVxA2p724iSC2mhdcB+Uky7SIOcPuCMLW3MM+zNYbU4EVkCQpFaVZRkH38JnddZsJjWSheT0jV1X1gNKCMm8ASccaXDEhSwSgP2/0O7YbN2AuS6gP/9Ut/0zlX6KVNUQGmYZHA5Zyd2cPCsstkli/Jz9U6Cmyl4x0NH8PJo5d6Zyda/47BR5WHo37WIU6skejPYK94O4ymKnGGoT+SRFFaoMmrHgmAdX9uOoskYh+HHtwLbcQCNGo+8eiK8Lv6CQUQX4XLxeIbgQKBgQDfh7cero/xsPNGO/6vQ3vdFVwbwvb/7zjHRCS27F19Oz83B29Mj8WJbCAD+DNap16zrhby3cPPNUwvXocGbEltKrgnZWocBEpdoZRN4GgDt5lLuxUQ9ZI2DJscr9LSUJaIPD8r505xO4syHBRgshtXmF4dLgQHDDsPiaOKYxq75QKBgQCqqrdI5zn0GxFWFonTBQ4whPCr7O+dcmhCyyNZ3J/K9wF13xKTwfkDqeXPbyJLN1g0bUoLXZnBXbmJEvTndFIyaFS5qdWSXjeP2qGVYcDlNc8V3ynwk8LpnQH8e4CsDhbH1vb0F1kmvJH4c5ecrDTo5exwSEGUE58g6KSAWkFD+wKBgQCXtOVMdo8NKtpBHbDBxJxJNRj5Yn3+v54aZ54/Y/Yja1WBBJO+M4mOtgqYhxhbe2JjslCy7l3ZwMN/FrmvW0kORUMMweCdOTA7kdE0dYxCkZYB9uvaQcDE3BNeCdqckMNJnRIGuwrbAN182d/erKKv9aJSTYvAOMXQyspqvs5DHQKBgQCkMBKeP11guz2lbY9whJePFAYZ0JsBBNTLFXTP+dF8yL8N7+qGXgE7hhLByi/a3sarwUyPvJ+0CH/7IFKd7Sk6t2ZzK7F828lmSrZS6TVTDb5JU2WcvfqxFsyXYxV58R/3Z5YzY9bvzlA8DrCYGI/aU4Bw0QLN+0aGuWmw1aOeSwKBgDqbOYI6R7Lu5V5uBTD99cNfK9xtygLy3BVOQVAnyubUL1IWZMuwKKOiPAFRiSwin3OvcQVFJfndgifWRnUqWQdNktXr/xZGUa7t1yVSzuvLtZeTVkzjyeiWNLO2QqUdJsC4ZsDm9BUoK3IzFWCXrQxJU+MboiYAaopA5ZKJaRI7

   加密前 ==> 这是密文-这是密文-这是密文
   公钥加密 ==> HYQeegMdF9Jmp9jd2mvkGjaMJ0as/gVLnfp1WjxAG62/HNfVXQWpJZZa/4aioiHYP23JYuM3a84hMw+Rb2/fkZJrSWEZBF2IbOtzPsBi2EqOKrzTdnc4FyCWNnJHwMyz2TpTsQDuU1QB3imsuUvr2xz5OQpD4KiyiechpreWqFw8Ns+1lTMGyRIyTba9bFGTBvjR2KSBVro9cUN0XaCKiqMzwjg7E7CBiO4GgIfU6fCiGAPydnYUDsAufYv/qBSKv5EuFnXuo8uWzbfxaHqzHycQ/eRXlDHIfAIlYrk/jzFz2jEtUL6D49IFstHsykWzu+mzu/EXT8P4s5FWk6ZKzg==
   私钥解密 ==> 这是密文-这是密文-这是密文

   私钥签名: bXCQ974mmP5q3F19Pwzj3u+UHBTOWrRA057+RgWXu3EDbQa+w1pHo8S4YInI+JJFN18OPVoQOrIdoa3ipwJgTa1rNuDsCOE5FfPa2yqiHDpD/t6q11L5cGC91+Y5c46NSBrXUTjpta4t+0Y6Xld62vVrAHq7XdrieLkbzn2+gQGPbkxiLxkvHoJDTl0S5EB86qcMlezRcxKWvzGPmugK83YMMUcBVi12YHB583EJeQ2QKXIIJqOLE8FL45zudhqfVOcgXXifRs0T5mwN0hBEHgi4cc2jbbViZwodf81NM0USaolNPVcB1WbWcmCn/MUS2dp8vTDAN0cmOMVD17SMxw==
   公钥验证: true
   ```

## 单点登录: `Spring security` + `auth2`+ `JWT` + `RSA` 相关配置

   这仅仅是部分配置: 针对 `Jwt 转换器` 的配置

   ```java
   package cn.hydroxyl.sso.auth2.config;

   import cn.hydroxyl.sso.auth2.config.comp.JwtTokenEnhancer;
   import cn.hydroxyl.sso.auth2.service.UserServiceImpl;
   import lombok.AllArgsConstructor;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.core.io.ClassPathResource;
   import org.springframework.security.authentication.AuthenticationManager;
   import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
   import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
   import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
   import org.springframework.security.oauth2.provider.token.TokenEnhancer;
   import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
   import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
   import org.springframework.security.rsa.crypto.KeyStoreKeyFactory;

   import java.security.KeyPair;
   import java.util.ArrayList;
   import java.util.List;

   @AllArgsConstructor
   @Configuration
   @EnableAuthorizationServer
   public class Oauth2ServerConfig extends AuthorizationServerConfigurerAdapter {

      private final UserServiceImpl userDetailsService;
      private final AuthenticationManager authenticationManager;
      private final JwtTokenEnhancer jwtTokenEnhancer;

      /**
      * 用来配置授权（authorization）以及令牌（token）的访问端点和令牌服务(token services)。
      *
      * 1. 密码模式下配置认证管理器 AuthenticationManager 以及 jwt
      * 2. 设置 AccessToken的存储介质tokenStore， 默认使用内存当做存储介质。
      */
      @Override
      public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
         List<TokenEnhancer> delegates = new ArrayList<>();
         delegates.add(jwtTokenEnhancer);
         delegates.add(accessTokenConverter());
         // 密码模式下使用 authenticationManager 管理器
         endpoints.authenticationManager(authenticationManager)
                  // 配置加载用户信息的服务
                  .userDetailsService(userDetailsService)
                  .accessTokenConverter(accessTokenConverter());
      }

      /**
      * Jwt 转换器
      */
      @Bean
      public JwtAccessTokenConverter accessTokenConverter() {
         JwtAccessTokenConverter jwtAccessTokenConverter = new JwtAccessTokenConverter();
         jwtAccessTokenConverter.setKeyPair(keyPair());
         return jwtAccessTokenConverter;
      }

      @Bean
      public KeyPair keyPair() {
         // rsa 密钥文件, 以及对应的 storePass, keyPass, alias
         final ClassPathResource rsaJksRes = new ClassPathResource("rsa.jks");
         final String storePass = "456123";
         final String keyPass = "212003";
         final String alias = "oh";
         return new KeyStoreKeyFactory(rsaJksRes, storePass.toCharArray()).getKeyPair(alias, keyPass.toCharArray());
      }
   }
   ```
