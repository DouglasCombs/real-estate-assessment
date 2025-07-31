import sqlite3
from main import DB_PATH

def mark_solded(house_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE houses SET solded=1 WHERE id=?", (house_id,))
    conn.commit()
    conn.close()

def get_solded():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM houses WHERE solded=1 ORDER BY id DESC")
    houses = [dict(row) for row in c.fetchall()]
    conn.close()
    return houses
