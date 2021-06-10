# vscode 配置

## vscode 配置模板代码

> Version: 1.54.3 (system setup)

1. F1, 或 Ctrl + P 打开vscode 命令窗口

2. 输入 `snippet` 或 其它命令后选择 `配置用户代码片段`.
   ![配置模板代码](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210610122755.png)

3. 输入脚本

   ```json
   "markdown header": {
      "scope": "markdown,md",
      "prefix": "markdown-header",
      "body": [
         "---",
         "keys: $0",
         "type:",
         "---"
      ],
      "description": "Log output to console"
   }
   ```

4. 使用方式

   1. F1, 或 Ctrl + P 打开vscode 命令窗口
   2. Insert snippet
   3. 选择模板
