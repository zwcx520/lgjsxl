window.addEventListener('load', function () {
    // ===== 常量配置区（统一改配置不用改DOM代码）=====
    const TIP_KEY = "app_tip_version"; // 本地存储key（改用版本存储）
    const APP_TIP_VER = "1"; // ✅关键：修改这个数字(1→2/3/4)，所有用户下次打开就会重新弹窗
    const PRIVACY_URL = "privacy.html";   // 替换成真实隐私地址
    const AGREEMENT_URL = "userservices.html"; // 替换成真实服务协议地址
    const Z_INDEX = 9999;

    // 【修改缓存判断逻辑】：读取本地存储版本，和当前版本不一致则弹窗
    const localSaveVer = localStorage.getItem(TIP_KEY);
    if (localSaveVer !== APP_TIP_VER) {
        // 1. 创建遮罩层
        const mask = document.createElement('div');
        Object.assign(mask.style, {
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.6)',
            zIndex: Z_INDEX,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '15px'
        });

        // 2. 创建弹窗盒子
        const box = document.createElement('div');
        Object.assign(box.style, {
            maxWidth: '520px',
            width: '90%',
            background: '#000',
            borderRadius: '10px',
            padding: '20px',
            maxHeight: '80vh',
            overflowY: 'auto'
        });

        // 弹窗HTML模板（仅修改h3样式：红色+加粗）
        box.innerHTML = `
            <h3 style="text-align:center;margin:0 0 12px;color:red;font-weight:bold;">欢迎使用力哥健身训练系统！</h3>
            <div style="line-height:1.7;font-size:14px;">
💡1.本程序是一款免费健身训练软件，内置免费训练计划，无任何收费功能<br><br>
2.使用前请在设置里面详细查看使用手册，使用前了解本程序所有功能，了解本程序的隐私政策和用户服务协议<br><br>
3.本程序网络信号弱的时候会造成APP加载缓慢，属于正常现象，数据不会丢失！
            </div>
            <div style="margin:16px 0;display:flex;gap:20px;justify-content:center;">
                《<a href="${PRIVACY_URL}" target="_blank" style="color:#0066ff">隐私政策</a>》
                《<a href="${AGREEMENT_URL}" target="_blank" style="color:#0066ff">用户服务协议</a>》
            </div>
            <center><button id="agreeBtn" style="width:50%;padding:10px;background:#2563eb;color:#fff;border:0;border-radius:6px;font-size:15px;">同意并使用</button></center>
        `;

        // 组装DOM
        mask.appendChild(box);
        document.body.appendChild(mask);

        // 同意按钮事件：点击后存入最新版本号
        const agreeBtn = document.getElementById('agreeBtn');
        agreeBtn.addEventListener('click', () => {
            mask.remove();
            // 存入当前最新版本，下次版本不变不再弹窗
            localStorage.setItem(TIP_KEY, APP_TIP_VER);
        });
    }

    // ===== 原有页面初始化逻辑 =====
    // 确保jQuery已加载再执行
    if (typeof $ !== 'undefined') {
        $("#r_date").val(fmtToday());
        $("#hourWage").val(getWage());
        render();
        statistics();
    }
});





