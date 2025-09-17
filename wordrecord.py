# 
# sqlite db words.db is not visible in the directory then
# 1. create db with the structure 
#    word : string
#    usecount :  integer preset to 0

# 2. populate it with the words from goodwords.txt
import sqlite3
import random
import os

def init():
    # only try if the db does not exist

    if os.path.exists('words.db'):
        return
    conn = sqlite3.connect('words.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS words
                 (word TEXT PRIMARY KEY, used BOOLEAN)''')
    conn.commit()
    # load words from goodwords.txt
    with open('goodwords.txt', 'r') as f:
        words = f.read().splitlines()
        # the word is before the colon
        words = [line.split(':')[0] for line in words if ':' in line]
        for word in words:
            c.execute("INSERT OR IGNORE INTO words (word, used) VALUES (?, ?)", (word, 0))
    conn.commit()   
    conn.close()

def getnewword():
    # get a random unused word from the db
    import sqlite3
    import random
    conn = sqlite3.connect('words.db')
    c = conn.cursor()
    c.execute("SELECT word FROM words WHERE used = 0")
    words = c.fetchall()
    if not words:
        conn.close()
        return None
    word = random.choice(words)[0]
    conn.close()
    return word

def markwordused(word):
    conn = sqlite3.connect('words.db')
    c = conn.cursor()
    c.execute("UPDATE words SET used = 1 WHERE word = ?", (word,))
    conn.commit()
    conn.close()


init()