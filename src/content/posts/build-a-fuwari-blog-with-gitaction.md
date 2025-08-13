---
title: Build A Fuwari Blog With GitAction
published: 2025-08-13
description: '记录GitAction部署该博客过程遇到的一些小问题'
image: ''
tags: []
category: 'Blogging'
draft: false 
lang: ''
---

# 第一个问题：仓库映射

我部署的base是[https://atlanticsailfish.github.io](https://atlanticsailfish.github.io)使用`username/username`格式的仓库，Github会自动给予一个不含仓库名称的公网链接，在配置`astro.config.mjs`的过程中，应该将
`base`置空，如果留下了`base: '/'`，那博客就会变成只有文字的空壳...hhh
```
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://atlanticsailfish.github.io',
  base: '',
})
```
# 第二个问题：DNS映射

Github给予的公网地址[https://atlanticsailfish.github.io](https://atlanticsailfish.github.io)在大陆访问并不稳定，故笔者使用DNS映射自定义域名[https://blog.daqiyu.dpdns.org/](https://blog.daqiyu.dpdns.org/)，在映射成功后，笔者发现访问时不时会中断一段时间，经过排查发现最有可能的是，打开放在后台的GithubPage DNS映射页面，隔一段时间自动进行检测，在检测期间访问就会中断，保存后关闭该页面即可

:::note
再次感谢原作者[saicaca](https://github.com/saicaca/fuwari)提供的博客框架
:::