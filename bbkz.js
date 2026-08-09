
/**
 * 力哥健身训练系统 - 版本更新提示模块
 * 使用 IIFE 封装，不污染全局命名空间，避免与 app.js 等脚本冲突。
 *
 * 对外仅暴露一个命名空间：window.LGUpdate
 *   LGUpdate.version    当前版本号
 *   LGUpdate.show()     手动弹出更新提示
 *   LGUpdate.close()    关闭更新提示
 *   LGUpdate.download() 下载最新安装包
 */
(function (global) {
    'use strict';

    // ===================== 【核心：在这里修改版本号】=====================
    // 每次想重新弹窗，只需要修改这里的版本即可（例如 V1.0 → V1.1 / 2.0 / 1.5.3）
    const CURRENT_VERSION = 'V1.0';
    // =====================================================================

    const STORAGE_KEY = 'update_modal_version';
    const MASK_ID = 'lg_update_modal_mask';
    const APK_URL = 'https://lgjsxl.netlify.app/lgjsxl.apk';
    const APK_NAME = '力哥健身训练系统';
    const Z_INDEX = 99999;

    function downloadApk() {
        const link = document.createElement('a');
        link.href = APK_URL;
        link.download = APK_NAME;
        link.target = '_self';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function closeUpdateModal() {
        const mask = document.getElementById(MASK_ID);
        if (mask && mask.parentNode) {
            mask.parentNode.removeChild(mask);
        }
    }

    function showUpdateModal() {
        if (document.getElementById(MASK_ID)) return;

        const mask = document.createElement('div');
        mask.id = MASK_ID;
        Object.assign(mask.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: String(Z_INDEX)
        });

        const modalBox = document.createElement('div');
        Object.assign(modalBox.style, {
            width: '300px',
            background: '#fff',
            borderRadius: '8px',
            padding: '25px 20px',
            boxSizing: 'border-box',
            textAlign: 'center'
        });

        const title = document.createElement('h3');
        title.textContent = '发现新版本 ' + CURRENT_VERSION;
        Object.assign(title.style, {
            margin: '0 0 20px 0',
            fontSize: '18px',
            color: '#333'
        });

        const desc = document.createElement('p');
        desc.textContent = '1.新版本完善所有的UI布局，完善所有功能漏洞，美化弹窗布局！\n2.本次更新不会删除数据，建议立即更新！如若新版本安装失败。请卸载旧版本后再安装！';
        Object.assign(desc.style, {
            margin: '0 0 25px 0',
            fontSize: '14px',
            color: '#666',
            whiteSpace: 'pre-line'
        });

        const btnWrap = document.createElement('div');
        Object.assign(btnWrap.style, {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px'
        });

        const updateBtn = document.createElement('button');
        updateBtn.textContent = '立即更新';
        Object.assign(updateBtn.style, {
            flex: '1',
            height: '36px',
            border: 'none',
            borderRadius: '4px',
            background: '#1677ff',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer'
        });
        updateBtn.addEventListener('click', function () {
            downloadApk();
            closeUpdateModal();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        Object.assign(cancelBtn.style, {
            flex: '1',
            height: '36px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#fff',
            color: '#333',
            fontSize: '14px',
            cursor: 'pointer'
        });
        cancelBtn.addEventListener('click', closeUpdateModal);

        btnWrap.appendChild(updateBtn);
        btnWrap.appendChild(cancelBtn);
        modalBox.appendChild(title);
        modalBox.appendChild(desc);
        modalBox.appendChild(btnWrap);
        mask.appendChild(modalBox);
        document.body.appendChild(mask);

        mask.addEventListener('click', function (e) {
            if (e.target === mask) closeUpdateModal();
        });
    }

    function checkAndShow() {
        const showedVersion = localStorage.getItem(STORAGE_KEY);
        if (showedVersion !== CURRENT_VERSION) {
            showUpdateModal();
            localStorage.setItem(STORAGE_KEY, CURRENT_VERSION);
        }
    }

    // 使用 addEventListener 而非 window.onload 赋值，避免覆盖其他脚本的 onload 处理器
    if (document.readyState === 'complete') {
        checkAndShow();
    } else {
        window.addEventListener('load', checkAndShow);
    }

    // 对外暴露单一命名空间
    global.LGUpdate = Object.freeze({
        version: CURRENT_VERSION,
        show: showUpdateModal,
        close: closeUpdateModal,
        download: downloadApk
    });

})(window);
