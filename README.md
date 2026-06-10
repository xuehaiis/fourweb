# 云资料分享站 PHP + MySQL 版

## 运行步骤

1. 创建 MySQL 数据库和表：导入 `database.sql`。
2. 复制 `config.example.php` 为 `config.php`，并修改数据库连接信息：
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`
3. 把项目放到 PHP 站点目录，通过浏览器访问 `index.php`。

## 本地便携环境

当前项目已带有本地 PHP 和 MySQL：

- 启动：右键 PowerShell 运行 `start-local.ps1`
- 停止：右键 PowerShell 运行 `stop-local.ps1`
- 访问地址：`http://127.0.0.1:8000/index.php`

## 文件说明

- `index.php`：页面入口
- `styles.css`：页面样式
- `app.js`：前台交互和后台管理请求
- `api/resources.php`：资料增删改查接口
- `config.php`：MySQL 连接配置
- `database.sql`：建库、建表和示例数据
