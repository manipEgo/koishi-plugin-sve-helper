# koishi-plugin-sve-helper

[![npm](https://img.shields.io/npm/v/koishi-plugin-sve-helper?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-sve-helper)


Unofficial card search plugin for Shadowverse Evolve (SVE) based on sve-helper and Koishi.

## Credits

this is an unofficial plugin using APIs from [Shadowverse-Evolve Helper](https://www.svehelperwin.com/) and [Shadowverse-Evolve Official Website](https://shadowverse-evolve.com/), all credits go to the original author and SVE official.

## Usage

普通查询默认别名 `sve`, 可用参数等请利用 `help` 指令查看

PR 卡查询默认别名 `pr`，支持 `1`, `1,2,3`, `1-3` 三种编号输入格式

## TODO List

 - [x] 基本检索
 - [x] 高级检索
 - [x] 数量选项
 - [x] 偏移选项
 - [x] 双面卡牌
 - [x] PR卡检索
 - [ ] 去重参数
 - [ ] 各参数设置页面

## Update Log

### v1.1.0

commit id: `245f1a03df6941bf355940f2e2d185ac757cceba`

#### 新增：

 - 支持双面卡返回正反面两张查询结果
 - 支持根据编号查询 PR 卡图

#### 修复：

 - 因单个结果图片路径错误导致整个查询结果无法发送：现在错误图片返回文字提醒，不影响其他图片
 - 更新了图片路径命名规则，减少了无法显示图片数量


### v1.0.0

commit id: `efb16bef9d025a0433e2f435907bd497419e5ee0`

#### 新增：

完成主要功能，检索结果以转发形式发送。

 - 基本检索功能：关键词
 - 高级检索功能：条件筛选，与 `SVE-helper` 保持一致
 - 数量选项
 - 偏移选项
