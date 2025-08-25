---
title: 数据库随笔
published: 2025-08-25
description: ''
image: ''
tags: [Devops, DBA, Database]
category: 'Work'
draft: false 
lang: ''
---

**是的，作为一名DevOps，会一些数据库也是很理所当然的事情吧**

## 提前设计备份策略

项目上线初期，基本数据已有之后便备份一份完整数据库数据并写入到了测试环境的数据库内，经过几天的兵荒马乱之后，发现一父表关联的9条子表数据在生产环境无影无踪，幸而在测试数据库的早期生产库备份里找到。

也可采用不删除测试的ceta_app_test，转而新建一个ceta_app_pord_bk_time的方法，仅用于数据查询，不连接前端页面。

再搭配每天12:30，00:30 两次备份数据库，找回数据如喝水。

```bash
# ==============================================================================
# PostgreSQL 生产数据库备份脚本 (优化版)
# 使用 pg_dump 从 Docker 容器中导出数据库
# ==============================================================================

# --- 配置参数 ---
POSTGRES_COMPOSE_DIR="/opt/yourprojectname/docker-compose-installer/" # 生产环境 docker-compose.yml 所在目录
POSTGRES_CONTAINER_NAME="postgres_prod"                     # 生产环境 PostgreSQL 容器名称
POSTGRES_DB_NAME="ceta_app"                                # 要备份的数据库名称
POSTGRES_USER="postgres"                                   # 数据库用户
BACKUP_DIR="/home/username/postgres_prod_bk/"                # 备份文件保存目录
LOG_FILE="${BACKUP_DIR}backup_postgres_prod.log"           # 日志文件路径 (已修改)

# 备份文件名前缀 (ceta_app_prod_dump_YYYYMMDD_HHMMSS.sql)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}${POSTGRES_DB_NAME}_prod_dump_${TIMESTAMP}.sql"

# 定义要保留的备份天数，例如：保留最近7天的备份
RETENTION_DAYS=7

# --- 函数：记录日志 ---
# 这个函数的作用是将信息同时输出到控制台和日志文件
log_message() {
    echo "[$(date +'[%Y-%m-%d %H:%M:%S]')] $1" | tee -a ${LOG_FILE}
}

# --- 备份执行 ---
log_message "============================================================"
log_message "开始备份数据库: ${POSTGRES_DB_NAME}"

# 切换到 docker-compose 目录
cd ${POSTGRES_COMPOSE_DIR} || { log_message "错误: 无法进入 ${POSTGRES_COMPOSE_DIR} 目录。"; exit 1; }

# 执行 pg_dump
if docker exec ${POSTGRES_CONTAINER_NAME} pg_dump -Fc -U ${POSTGRES_USER} ${POSTGRES_DB_NAME} > ${BACKUP_FILE}; then
    log_message "数据库备份成功: ${BACKUP_FILE}"
else
    log_message "错误: 数据库备份失败！"
    # 如果备份失败，删除可能已创建的不完整文件
    if [ -f "${BACKUP_FILE}" ]; then
        rm "${BACKUP_FILE}"
        log_message "已删除不完整的备份文件: ${BACKUP_FILE}"
    fi
    exit 1
fi

# --- 清理旧备份 ---
log_message "开始清理超过 ${RETENTION_DAYS} 天的旧备份..."

# 使用 find 命令查找并删除旧文件，并记录删除的文件名
# -print0 和 xargs -0 确保文件名中包含空格或特殊字符也能正确处理
find ${BACKUP_DIR} -name "${POSTGRES_DB_NAME}_prod_dump_*.sql" -type f -mtime +${RETENTION_DAYS} -print0 | while IFS= read -r -d $'\0' file; do
    log_message "正在删除旧备份文件: ${file}"
    rm "${file}"
done

log_message "旧备份清理完成。"
log_message "备份任务结束。"
log_message "============================================================"
```