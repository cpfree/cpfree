# node.js

1. 下载 `node.js` : `node-v10.15.0-linux-x64.tar.xz`， 解压到想要安装的位置， 确认一下nodejs下bin目录是否有node 和npm文件，如果有执行软连接，如果没有重新下载执行上边步骤。
2. 建立软连接，变为全局

   ```shell
   ln -s /home/cpf/programing/sdk/nodejs/bin/npm /usr/local/bin/
   ln -s /home/cpf/programing/sdk/nodejs/bin/node /usr/local/bin/
   ```

3. 最后一步命令行 `node -v` 显示nodejs版本，检验nodejs是否已变为全局。

> node.js 在使用 npm 安装的时候可能需要 package.json 文件。
> 可使用 `npm init` 命令
> 参考网址 https://my.oschina.net/dkvirus/blog/1068813
