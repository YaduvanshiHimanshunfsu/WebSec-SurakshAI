import sqlite3
import os

DB = 'sandbox.db'

def init_db():
    print("Initializing sandbox database...")
    db = sqlite3.connect(DB)
    db.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)")
    db.execute("INSERT OR IGNORE INTO users VALUES (1, 'admin', 'secret123')")
    db.execute("INSERT OR IGNORE INTO users VALUES (2, 'alice', 'password')")
    db.commit()
    db.close()
    print("Done.")

if __name__ == '__main__':
    # Move to sandbox dir if not already there
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    init_db()
