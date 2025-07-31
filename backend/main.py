
from fastapi import FastAPI, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import sqlite3
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





DB_PATH = "realestate.db"
IMG_DIR = "images"
os.makedirs(IMG_DIR, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


# Delete a house and its images
@app.delete("/houses/{house_id}")
def delete_house(house_id: int):
    conn = get_db()
    c = conn.cursor()
    # Delete images from disk
    c.execute("SELECT path FROM images WHERE house_id=?", (house_id,))
    for row in c.fetchall():
        img_path = row["path"]
        if os.path.exists(img_path):
            os.remove(img_path)
    # Delete from images table
    c.execute("DELETE FROM images WHERE house_id=?", (house_id,))
    # Delete from houses table
    c.execute("DELETE FROM houses WHERE id=?", (house_id,))
    conn.commit()
    conn.close()
    return {"ok": True}
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import sqlite3
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "realestate.db"
IMG_DIR = "images"
os.makedirs(IMG_DIR, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

@app.on_event("startup")
def startup():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS houses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT,
        type TEXT,
        rooms INTEGER,
        area REAL,
        floor TEXT,
        amenities TEXT,
        deposit TEXT,
        rental TEXT,
        whole_price TEXT,
        price_per_meter TEXT,
        solded INTEGER DEFAULT 0
    )
    """)
    c.execute("""
    CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        house_id INTEGER,
        path TEXT,
        FOREIGN KEY(house_id) REFERENCES houses(id) ON DELETE CASCADE
    )
    """)
    # Add 'floor' column if missing
    try:
        c.execute("ALTER TABLE houses ADD COLUMN floor TEXT")
    except Exception:
        pass
# Mark property as solded
@app.post("/houses/{house_id}/solded")
def mark_solded(house_id: int):
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE houses SET solded=1 WHERE id=?", (house_id,))
    conn.commit()
    conn.close()
    return {"ok": True}

# Get solded properties
@app.get("/houses/solded/")
def get_solded():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM houses WHERE solded=1 ORDER BY id DESC")
    houses = [dict(row) for row in c.fetchall()]
    for house in houses:
        c.execute("SELECT path FROM images WHERE house_id = ? ORDER BY id DESC", (house['id'],))
        house['images'] = [row['path'] for row in c.fetchall()]
    conn.close()
    return houses

@app.post("/houses/")
def add_house(
    address: str = Form(...),
    type: str = Form(...),
    rooms: int = Form(...),
    area: float = Form(...),
    floor: str = Form(None),
    amenities: str = Form(...),
    deposit: str = Form(None),
    rental: str = Form(None),
    whole_price: str = Form(None),
    price_per_meter: str = Form(None),
    images: list[UploadFile] = File([])
):
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO houses (address, type, rooms, area, floor, amenities, deposit, rental, whole_price, price_per_meter)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (address, type, rooms, area, floor, amenities, deposit, rental, whole_price, price_per_meter))
    house_id = c.lastrowid
    for img in images:
        img_path = os.path.join(IMG_DIR, f"{house_id}_{img.filename}")
        with open(img_path, "wb") as f:
            f.write(img.file.read())
        c.execute("INSERT INTO images (house_id, path) VALUES (?, ?)", (house_id, img_path))
    conn.commit()
    conn.close()
    return {"id": house_id}
# Get solded/rented properties
    # ...existing code...

@app.get("/houses/")
def list_houses(skip: int = 0, limit: int = 5, type: str = None):
    conn = get_db()
    c = conn.cursor()
    query = "SELECT * FROM houses"
    params = []
    if type and type and type.lower() != "all":
        query += " WHERE type = ?"
        params.append(type)
    query += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, skip])
    c.execute(query, params)
    houses = [dict(row) for row in c.fetchall()]
    for house in houses:
        c.execute("SELECT path FROM images WHERE house_id = ? ORDER BY id DESC", (house['id'],))
        house['images'] = [row['path'] for row in c.fetchall()]
    conn.close()
    return houses

@app.get("/images/{img_path}")
def get_image(img_path: str):
    return FileResponse(os.path.join(IMG_DIR, img_path))
@app.delete("/houses/{house_id}")
def delete_house(house_id: int):
    conn = get_db()
    c = conn.cursor()
    # Delete images from disk
    c.execute("SELECT path FROM images WHERE house_id=?", (house_id,))
    for row in c.fetchall():
        img_path = row["path"]
        if os.path.exists(img_path):
            os.remove(img_path)
    # Delete from images table
    c.execute("DELETE FROM images WHERE house_id=?", (house_id,))
    # Delete from houses table
    c.execute("DELETE FROM houses WHERE id=?", (house_id,))
    conn.commit()
    conn.close()
    return {"ok": True}

