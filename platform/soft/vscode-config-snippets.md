VScode 的 code snippet 中可以使用的一些变量

The following variables can be used:

    TM_SELECTED_TEXT The currently selected text or the empty string
    TM_CURRENT_LINE The contents of the current line
    TM_CURRENT_WORD The contents of the word under cursor or the empty string
    TM_LINE_INDEX The zero-index based line number
    TM_LINE_NUMBER The one-index based line number
    TM_FILENAME The filename of the current document
    TM_FILENAME_BASE The filename of the current document without its extensions
    TM_DIRECTORY The directory of the current document
    TM_FILEPATH The full file path of the current document
    CLIPBOARD The contents of your clipboard
    WORKSPACE_NAME The name of the opened workspace or folder

For inserting the current date and time:

    CURRENT_YEAR The current year
    CURRENT_YEAR_SHORT The current year’s last two digits
    CURRENT_MONTH The month as two digits (example ‘02’)
    CURRENT_MONTH_NAME The full name of the month (example ‘July’)
    CURRENT_MONTH_NAME_SHORT The short name of the month (example ‘Jul’)
    CURRENT_DATE The day of the month
    CURRENT_DAY_NAME The name of day (example ‘Monday’)
    CURRENT_DAY_NAME_SHORT The short name of the day (example ‘Mon’)
    CURRENT_HOUR The current hour in 24-hour clock format
    CURRENT_MINUTE The current minute
    CURRENT_SECOND The current second

For inserting line or block comments, honoring the current language:

    BLOCK_COMMENT_START Example output: in PHP /* or in HTML <!–
    BLOCK_COMMENT_END Example output: in PHP */ or in HTML -->
    LINE_COMMENT Example output: in PHP // or in HTML <!-- -->


```js
{
	// Place your 全局 snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and 
	// description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope 
	// is left empty or omitted, the snippet gets applied to all languages. The prefix is what is 
	// used to trigger the snippet and the body will be expanded and inserted. Possible variables are: 
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. 
	// Placeholders with the same ids are connected.
	// Example:
	// "Print to console": {
	// 	"scope": "javascript,typescript",
	// 	"prefix": "log",
	// 	"body": [
	// 		"console.log('$1');",
	// 		"$2"
	// 	],
	// 	"description": "Log output to console"
	// }
	"markdown header": {
		"scope": "markdown,md",
		"prefix": "markdown-header",
		"body": [
			"---",
			"keys: $0",
			"type: copy,blog,trim",
         "url: <>",
         "id: $CURRENT_YEAR_SHORT$CURRENT_MONTH$CURRENT_DATE-$CURRENT_HOUR$CURRENT_MINUTE$CURRENT_SECOND ",
			"---"
		],
		"description": "Log output to console"
	}
}
```

`$0` : 代表的是, 生成模板完毕后, 光标所指的位置.


最后可以生成

```md
---
keys: 
type: copy,blog,trim
url: <>
id: 211124-194819
---
```
