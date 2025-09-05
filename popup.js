// ポップアップ用JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const titleCountElement = document.getElementById('title-count');
    const bodyCountElement = document.getElementById('body-count');
    const totalCountElement = document.getElementById('total-count');
    const counterDisplay = document.getElementById('counter-display');
    const errorDisplay = document.getElementById('error-display');
    const refreshBtn = document.getElementById('refresh-btn');
    
    // 文字数を取得してポップアップを更新
    function updatePopup() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            
            // はてなブログの編集ページかチェック
            if (!currentTab.url.includes('blog.hatena.ne.jp') || !currentTab.url.includes('/edit')) {
                showError();
                return;
            }
            
            // コンテンツスクリプトから文字数データを取得
            chrome.tabs.sendMessage(currentTab.id, {action: 'getCharCount'}, function(response) {
                if (chrome.runtime.lastError || !response) {
                    showError();
                    return;
                }
                
                showCounter();
                
                const titleCount = response.titleCount || 0;
                const bodyCount = response.bodyCount || 0;
                const totalCount = titleCount + bodyCount;
                
                titleCountElement.textContent = titleCount.toLocaleString();
                bodyCountElement.textContent = bodyCount.toLocaleString();
                totalCountElement.textContent = totalCount.toLocaleString();
                
                // 色の設定
                totalCountElement.className = 'counter-value';
                if (totalCount > 10000) {
                    totalCountElement.classList.add('warning');
                } else if (totalCount > 5000) {
                    totalCountElement.classList.add('caution');
                }
            });
        });
    }
    
    function showCounter() {
        counterDisplay.style.display = 'block';
        errorDisplay.style.display = 'none';
    }
    
    function showError() {
        counterDisplay.style.display = 'none';
        errorDisplay.style.display = 'block';
    }
    
    // 初回実行
    updatePopup();
    
    // 1秒ごとに更新
    setInterval(updatePopup, 1000);
    
    // 再読み込みボタン
    refreshBtn.addEventListener('click', function() {
        updatePopup();
    });
});