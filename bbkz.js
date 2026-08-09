


// ===================== 【核心：在这里修改版本号】=====================
// 每次想重新弹窗，只需要修改这里的版本即可（例如 V123 → V124 / 2.0 / 1.5.3）
const CURRENT_VERSION = "V1.0";
// ===================================================================

// 下载函数：直接下载，不跳转页面
function downloadApk() {
    const url = "https://lgjsxl.netlify.app/lgjsxl.apk";
    const fileName = "力哥健身训练系统";
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = "_self";
    link.click();
    link.remove();
}

// 关闭弹窗
function closeModal() {
    const mask = document.getElementById('updateModalMask');
    if (mask) mask.remove();
}

// 创建并显示更新弹窗
function showUpdateModal() {
    if (document.getElementById('updateModalMask')) return;

    // 遮罩层
    const mask = document.createElement('div');
    mask.id = 'updateModalMask';
    mask.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
    `;

    // 弹窗主体
    const modalBox = document.createElement('div');
    modalBox.style.cssText = `
        width: 300px;
        background: #fff;
        border-radius: 8px;
        padding: 25px 20px;
        box-sizing: border-box;
        text-align: center;
    `;

    // 弹窗标题（自动读取上面定义的版本）
    const title = document.createElement('h3');
    title.innerText = `发现新版本 ${CURRENT_VERSION}`;
    title.style.cssText = `
        margin: 0 0 20px 0;
        font-size: 18px;
        color: #333;
    `;

    // 提示文案
    const desc = document.createElement('p');
    desc.innerText = '1.新版本完善所有的UI布局，完善所有功能漏洞，美化弹窗布局！\n2.本次更新不会删除数据，建议立即更新！如若新版本安装失败。请卸载旧版本后再安装！';
    desc.style.cssText = `
        margin: 0 0 25px 0;
        font-size: 14px;
        color: #666;
    `;

    // 按钮容器
    const btnWrap = document.createElement('div');
    btnWrap.style.cssText = `
        display: flex;
        justify-content: space-between;
        gap: 10px;
    `;

    // 立即更新按钮
    const updateBtn = document.createElement('button');
    updateBtn.innerText = '立即更新';
    updateBtn.style.cssText = `
        flex: 1;
        height: 36px;
        border: none;
        border-radius: 4px;
        background: #1677ff;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
    `;
    updateBtn.onclick = function() {
        downloadApk();
        closeModal();
    };

    // 取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = '取消';
    cancelBtn.style.cssText = `
        flex: 1;
        height: 36px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #fff;
        color: #333;
        font-size: 14px;
        cursor: pointer;
    `;
    cancelBtn.onclick = closeModal;

    // 组装DOM
    btnWrap.appendChild(updateBtn);
    btnWrap.appendChild(cancelBtn);
    modalBox.appendChild(title);
    modalBox.appendChild(desc);
    modalBox.appendChild(btnWrap);
    mask.appendChild(modalBox);
    document.body.appendChild(mask);

    // 点击遮罩空白处关闭弹窗
    mask.onclick = function(e) {
        if (e.target === mask) closeModal();
    };
}

// ===================== 版本判断核心逻辑 =====================
window.onload = function() {
    // 读取浏览器本地存储中，上次已经展示过的版本
    const showedVersion = localStorage.getItem('update_modal_version');

    // 逻辑：版本不一致 → 弹窗，并记录当前版本；版本一致 → 不弹窗
    if (showedVersion !== CURRENT_VERSION) {
        showUpdateModal();
        // 把当前版本存入本地，标记为「已弹窗」
        localStorage.setItem('update_modal_version', CURRENT_VERSION);
    }
}




