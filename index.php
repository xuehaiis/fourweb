<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>云资料分享站 - 演示版</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand">
          <div class="brand-mark">云</div>
          <div>
            <div class="brand-title">云资料分享站</div>
            <div class="brand-sub">百度网盘资料分类管理演示版</div>
          </div>
        </div>
        <nav class="nav" aria-label="页面切换">
          <button class="active" type="button" data-view-btn="home">资料首页</button>
          <button type="button" data-view-btn="admin">后台管理</button>
        </nav>
      </div>
    </header>

    <main>
      <section id="homeView">
        <div class="toolbar">
          <div class="searchbox">
            <input id="searchInput" type="search" placeholder="搜索资料名称、类型或说明">
          </div>
          <div class="stats" id="resourceStats"></div>
        </div>
        <div class="category-strip" id="categoryStrip"></div>
        <div class="resource-grid" id="resourceGrid"></div>
        <div class="empty hidden" id="emptyState">没有找到匹配的资料</div>
      </section>

      <section id="adminView" class="hidden">
        <div class="admin-layout">
          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title" id="formTitle">新增资料</h2>
            </div>
            <div class="panel-body">
              <form id="resourceForm" class="form-grid">
                <input id="resourceId" type="hidden">
                <label>
                  资料名称
                  <input id="nameInput" required maxlength="80" placeholder="例如：2026前端学习路线">
                </label>
                <label>
                  资料类型
                  <select id="typeInput" required>
                    <option value="课程资料">课程资料</option>
                    <option value="软件工具">软件工具</option>
                    <option value="电子书">电子书</option>
                    <option value="设计素材">设计素材</option>
                    <option value="办公模板">办公模板</option>
                    <option value="其他资料">其他资料</option>
                  </select>
                </label>
                <label>
                  网盘链接
                  <input id="linkInput" required type="url" placeholder="https://pan.baidu.com/s/...">
                </label>
                <label>
                  提取码
                  <input id="codeInput" maxlength="12" placeholder="例如：abcd">
                </label>
                <label>
                  说明
                  <textarea id="descInput" required maxlength="260" placeholder="写清楚资料内容、适合人群或版本信息"></textarea>
                </label>
                <div class="form-actions">
                  <button class="btn primary" type="submit">保存资料</button>
                  <button class="btn" id="resetBtn" type="button">清空表单</button>
                </div>
              </form>
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">资料列表</h2>
              <button class="btn warn" id="restoreBtn" type="button">恢复示例数据</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>类型</th>
                    <th>说明</th>
                    <th>提取码</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody id="adminTable"></tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
  <script src="app.js"></script>
</body>
</html>
