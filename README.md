# AKWABA · 非洲品味之家

用故事讀懂象牙海岸（科特迪瓦）的藝術、文化與生活。響應式靜態網站，手機、平板、電腦都能看。

- 正式網址：https://maison.victseng.com/
- 簡體版：網址加上 `/zh-hans/`（自動轉換，並使用大陸的地名叫法）

## 內容放在哪裡

| 檔案 | 內容 |
|---|---|
| `data/cards.json` | 12 章底圖（`layer: "底圖"`）和所有解讀卡 |
| `data/routes.json` | 路線；每一站都要有法文站名 `fr` |
| `data/occasions.json` | 場合指南 |
| `config.json` | 網址、GA4 評估 ID、Search Console 驗證碼、聯絡方式 |

改內容只要改這幾個 JSON 檔。推到 `main` 之後，GitHub Actions 會自動重建網站，大約 1–2 分鐘上線。

## 每週自動更新

每週日有一個 Claude 排程任務研究新資訊、交叉查核，然後開一個 **Pull Request（更新提案）**。
你在手機上打開 PR，看過內容和來源，按 **Merge** 就會上線；不想要就按 **Close**。
每個 PR 都會先跑 `check.js`：檢查來源網址、法文站名、卡片連結和有沒有混到簡體字。

規則寫在 `CONTENT_GUIDE.md`。

## 本機預覽

```bash
npm install      # 安裝簡繁轉換套件（可省略，省略時只產生繁體版）
node check.js    # 檢查內容
node build.js    # 產生 dist/
```

## SEO 與分析

- 每張卡、每條路線都有獨立網址、標題、描述、結構化資料（Article / TouristTrip / Person）
- 自動產生 `sitemap.xml`、`robots.txt`、繁簡 `hreflang`
- 在 `config.json` 填入 `ga4`（例如 `G-XXXXXXXXXX`）就會啟用 Google Analytics 4
- 自訂事件：`show_driver_card`、`mission_done`、`filter_domain`、`contact_email`、`contact_linkedin`

© Victor Tseng 曾浩瑜
