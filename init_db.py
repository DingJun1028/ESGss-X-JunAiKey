import sqlite3
import os

# 設定資料庫檔案名稱
DB_NAME = "junai_key.db"

def init_db():
    # 如果資料庫已存在，先刪除以確保乾淨重置 (視需求可註解掉)
    if os.path.exists(DB_NAME):
        os.remove(DB_NAME)
        print(f"⚠️ 舊資料庫 {DB_NAME} 已移除，正在重新初始化...")

    # 建立連接
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    print("🚀 正在建立資料庫架構...")

    # 1. 建立係數表 (Carbon Factors)
    # 對應 No-Code Backend 的 carbon_factors
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS carbon_factors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        factor REAL NOT NULL,
        unit TEXT NOT NULL
    )
    ''')

    # 2. 建立活動數據表 (Activity Data)
    # 對應 No-Code Backend 的 activity_data
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS activity_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        amount REAL NOT NULL,
        factor_id INTEGER NOT NULL,
        source TEXT,
        memo TEXT,
        FOREIGN KEY (factor_id) REFERENCES carbon_factors (id)
    )
    ''')

    print("🌱 正在注入種子數據 (Seeding)...")

    # 3. 注入預設係數 (Seed Data)
    factors = [
        ('Electricity', 0.495, 'kWh'),   # 電力
        ('Petrol', 2.3, 'L'),            # 汽油
        ('Water', 0.150, 'm3'),          # 水
        ('Paper', 0.9, 'kg')             # 紙張
    ]
    
    cursor.executemany('INSERT INTO carbon_factors (name, factor, unit) VALUES (?, ?, ?)', factors)

    # 4. 注入一筆測試用活動紀錄
    cursor.execute('''
        INSERT INTO activity_data (date, amount, factor_id, source, memo)
        VALUES (datetime('now'), 500, 1, 'JunAiKey_Init', '系統初始化測試數據')
    ''')

    # 提交變更並關閉
    conn.commit()
    conn.close()
    
    print(f"✅ 資料庫 {DB_NAME} 初始化完成！")
    print("系統已就緒。")

if __name__ == "__main__":
    init_db()
