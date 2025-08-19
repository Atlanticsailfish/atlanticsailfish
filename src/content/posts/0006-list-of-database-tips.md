---
title: list-of-database-tips
published: 2025-08-16
description: ''
image: ''
tags: []
category: ''
draft: true 
lang: ''
---

上线初期备份了一版数据库并写入到了测试数据库内，后续发现一父表因为暂存9条子表数据全部消失，在生产库无影无踪，幸而在测试数据库的早期生产库备份里找得

或许以后可以不删除测试的ceta_app 转而新建一个ceta_app_pord_bk，仅用于数据查询，不连接前端页面

搭配每天12:30， 00:30 两次备份的数据库，找回数据简直就是练了自在极意功