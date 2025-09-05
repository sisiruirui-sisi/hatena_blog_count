// はてなブログ文字数カウンター（コンテンツスクリプト）
(function() {
    'use strict';

    // 文字数をカウントする関数
    function countChars(text) {
        if (!text) return 0;
        
        // 画像タグを文字として扱う処理
        let processedText = text;
        
        // はてなフォトライフの画像記法 [f:id:xxx:xxx] を1文字としてカウント
        processedText = processedText.replace(/\[f:id:[^\]]+\]/g, '○');
        
        // HTMLの画像タグを1文字としてカウント
        processedText = processedText.replace(/<img[^>]*>/gi, '○');
        
        // その他のHTMLタグを除去
        processedText = processedText.replace(/<[^>]*>/g, '');
        
        return processedText.length;
    }

    // 現在の文字数を取得する関数
    function getCurrentCharCount() {
        console.log('getCurrentCharCount: 開始');
        
        // タイトル要素を探す
        const titleSelectors = [
            'input[name="title"]',
            '#title',
            '.entry-title-input',
            'input[placeholder*="タイトル"]',
            'input[placeholder*="題名"]'
        ];
        
        let titleInput = null;
        for (let selector of titleSelectors) {
            titleInput = document.querySelector(selector);
            if (titleInput) {
                console.log('タイトル要素発見:', selector);
                break;
            }
        }
        
        // 本文要素を探す
        const bodySelectors = [
            'textarea[name="body"]',
            '#body',
            '.entry-content',
            'textarea.entry-content-body',
            'textarea[class*="editor"]',
            'textarea[placeholder*="記事"]',
            'textarea[placeholder*="内容"]'
        ];
        
        let bodyTextarea = null;
        for (let selector of bodySelectors) {
            bodyTextarea = document.querySelector(selector);
            if (bodyTextarea) {
                console.log('本文要素発見:', selector);
                break;
            }
        }
        
        const titleCount = titleInput ? countChars(titleInput.value) : 0;
        const bodyCount = bodyTextarea ? countChars(bodyTextarea.value) : 0;
        
        //console.log('文字数カウント結果:', { titleCount, bodyCount });
        
        return {
            titleCount: titleCount,
            bodyCount: bodyCount
        };
    }

    // メッセージリスナー（ポップアップからの要求に応答）
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        //console.log('メッセージ受信:', request);
        
        if (request.action === 'getCharCount') {
            const charCount = getCurrentCharCount();
            //console.log('文字数データ送信:', charCount);
            sendResponse(charCount);
        }
        
        return true; // 非同期レスポンス用
    });

    //console.log('はてなブログ文字数カウンター: コンテンツスクリプト読み込み完了');
    //console.log('現在のURL:', location.href);
})();