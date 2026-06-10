const API_URL = "api/resources.php";

let resources = [];
let activeCategory = "全部";

const viewButtons = document.querySelectorAll("[data-view-btn]");
const homeView = document.querySelector("#homeView");
const adminView = document.querySelector("#adminView");
const searchInput = document.querySelector("#searchInput");
const categoryStrip = document.querySelector("#categoryStrip");
const resourceGrid = document.querySelector("#resourceGrid");
const emptyState = document.querySelector("#emptyState");
const resourceStats = document.querySelector("#resourceStats");
const adminTable = document.querySelector("#adminTable");
const resourceForm = document.querySelector("#resourceForm");
const formTitle = document.querySelector("#formTitle");
const resourceId = document.querySelector("#resourceId");
const nameInput = document.querySelector("#nameInput");
const typeInput = document.querySelector("#typeInput");
const linkInput = document.querySelector("#linkInput");
const codeInput = document.querySelector("#codeInput");
const descInput = document.querySelector("#descInput");
const resetBtn = document.querySelector("#resetBtn");
const restoreBtn = document.querySelector("#restoreBtn");

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "请求失败，请稍后重试");
  }

  return data;
}

async function loadResources() {
  try {
    const result = await requestJson(API_URL);
    resources = result.data || [];
    renderAll();
  } catch (error) {
    showError(error.message);
  }
}

function showError(message) {
  resourceStats.textContent = message;
  resourceGrid.innerHTML = "";
  adminTable.innerHTML = "";
  emptyState.classList.remove("hidden");
  emptyState.textContent = message;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCategories() {
  return ["全部", ...Array.from(new Set(resources.map(item => item.type)))];
}

function getFilteredResources() {
  const keyword = searchInput.value.trim().toLowerCase();

  return resources.filter(item => {
    const inCategory = activeCategory === "全部" || item.type === activeCategory;
    const haystack = `${item.name} ${item.type} ${item.desc} ${item.code}`.toLowerCase();
    return inCategory && (!keyword || haystack.includes(keyword));
  });
}

function renderCategories() {
  const categories = getCategories();

  if (!categories.includes(activeCategory)) {
    activeCategory = "全部";
  }

  categoryStrip.innerHTML = categories.map(category => `
    <button class="chip ${category === activeCategory ? "active" : ""}" type="button" data-category="${escapeHtml(category)}">
      ${escapeHtml(category)}
    </button>
  `).join("");
}

function renderHome() {
  renderCategories();
  const list = getFilteredResources();

  resourceStats.textContent = `共 ${resources.length} 份资料，当前显示 ${list.length} 份`;
  resourceGrid.innerHTML = list.map(item => `
    <article class="resource-card">
      <div class="resource-head">
        <div class="resource-title">${escapeHtml(item.name)}</div>
        <span class="tag" title="${escapeHtml(item.type)}">${escapeHtml(item.type)}</span>
      </div>
      <p class="desc">${escapeHtml(item.desc)}</p>
      <div class="meta">
        <span>百度网盘</span>
        <span>提取码：${escapeHtml(item.code || "无")}</span>
      </div>
      <a class="download" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">打开网盘链接</a>
    </article>
  `).join("");

  emptyState.textContent = "没有找到匹配的资料";
  emptyState.classList.toggle("hidden", list.length > 0);
  resourceGrid.classList.toggle("hidden", list.length === 0);
}

function renderAdmin() {
  adminTable.innerHTML = resources.map(item => `
    <tr>
      <td class="table-title">${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.type)}</td>
      <td class="table-desc">${escapeHtml(item.desc)}</td>
      <td>${escapeHtml(item.code || "无")}</td>
      <td>
        <div class="row-actions">
          <button class="btn" type="button" data-edit="${escapeHtml(item.id)}">编辑</button>
          <button class="btn danger" type="button" data-delete="${escapeHtml(item.id)}">删除</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAll() {
  renderHome();
  renderAdmin();
}

function resetForm() {
  resourceForm.reset();
  resourceId.value = "";
  formTitle.textContent = "新增资料";
  typeInput.value = "课程资料";
  nameInput.focus();
}

viewButtons.forEach(button => {
  button.addEventListener("click", () => {
    const view = button.dataset.viewBtn;
    viewButtons.forEach(item => item.classList.toggle("active", item === button));
    homeView.classList.toggle("hidden", view !== "home");
    adminView.classList.toggle("hidden", view !== "admin");
  });
});

categoryStrip.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderHome();
});

searchInput.addEventListener("input", renderHome);

resourceForm.addEventListener("submit", async event => {
  event.preventDefault();

  const payload = {
    id: resourceId.value,
    name: nameInput.value.trim(),
    type: typeInput.value,
    link: linkInput.value.trim(),
    code: codeInput.value.trim(),
    desc: descInput.value.trim()
  };

  const method = resourceId.value ? "PUT" : "POST";

  try {
    await requestJson(API_URL, {
      method,
      body: JSON.stringify(payload)
    });
    await loadResources();
    resetForm();
  } catch (error) {
    alert(error.message);
  }
});

adminTable.addEventListener("click", async event => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    const item = resources.find(resource => String(resource.id) === editButton.dataset.edit);
    if (!item) return;

    resourceId.value = item.id;
    nameInput.value = item.name;
    typeInput.value = item.type;
    linkInput.value = item.link;
    codeInput.value = item.code || "";
    descInput.value = item.desc;
    formTitle.textContent = "编辑资料";
    nameInput.focus();
  }

  if (deleteButton) {
    const item = resources.find(resource => String(resource.id) === deleteButton.dataset.delete);
    if (!item) return;

    const ok = confirm(`确定删除“${item.name}”吗？`);
    if (!ok) return;

    try {
      await requestJson(API_URL, {
        method: "DELETE",
        body: JSON.stringify({ id: item.id })
      });
      await loadResources();
      if (String(resourceId.value) === String(item.id)) {
        resetForm();
      }
    } catch (error) {
      alert(error.message);
    }
  }
});

resetBtn.addEventListener("click", resetForm);

restoreBtn.addEventListener("click", async () => {
  const ok = confirm("恢复示例数据会覆盖数据库里的资料，确定继续吗？");
  if (!ok) return;

  try {
    const result = await requestJson(`${API_URL}?action=restore`, {
      method: "POST",
      body: JSON.stringify({})
    });
    resources = result.data || [];
    activeCategory = "全部";
    searchInput.value = "";
    renderAll();
    resetForm();
  } catch (error) {
    alert(error.message);
  }
});

loadResources();
