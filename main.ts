from flask import Flask, request, jsonify, g
import sqlite3
import uuid
import datetime

app = Flask(__name__)
DATABASE = 'blog.db'

#----------------DATABASE CONNECTION----------------
    def get_db():
if 'db' not in g:
g.db = sqlite3.connect(DATABASE)
g.db.row_factory = sqlite3.Row
return g.db

@app.teardown_appcontext
def close_db(exception):
db = g.pop('db', None)
if db is not None:
db.close()

#----------------INITIALIZE DATABASE----------------
    def init_db():
db = get_db()
db.executescript('''
        CREATE TABLE IF NOT EXISTS posts(
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TEXT NOT NULL
);
''')
db.commit()

#----------------AUTH SIMULATION----------------
    def check_auth():
token = request.headers.get('Authorization')
return token == "Bearer SECRET123"  # dummy check

#----------------ROUTES ----------------
@app.route('/posts', methods = ['GET'])
def get_posts():
db = get_db()
posts = db.execute('SELECT * FROM posts').fetchall()
return jsonify([dict(p) for p in posts])

@app.route('/posts/<post_id>', methods = ['GET'])
def get_post(post_id):
db = get_db()
post = db.execute('SELECT * FROM posts WHERE id = ?', (post_id,)).fetchone()
if post:
    return jsonify(dict(post))
return jsonify({ 'error': 'Post not found' }), 404

@app.route('/posts', methods = ['POST'])
def create_post():
if not check_auth():
return jsonify({ 'error': 'Unauthorized' }), 403

data = request.get_json()
post_id = str(uuid.uuid4())
created_at = datetime.datetime.utcnow().isoformat()

db = get_db()
db.execute('''
        INSERT INTO posts(id, title, content, author, created_at)
        VALUES(?, ?, ?, ?, ?)
    ''', (post_id, data['title'], data['content'], data['author'], created_at))
    db.commit()
    return jsonify({ 'id': post_id }), 201

@app.route('/posts/<post_id>', methods = ['PUT'])
def update_post(post_id):
if not check_auth():
return jsonify({ 'error': 'Unauthorized' }), 403

data = request.get_json()
db = get_db()
db.execute('''
        UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?
    ''', (data['title'], data['content'], data['author'], post_id))
    db.commit()
    return jsonify({ 'message': 'Post updated' })

@app.route('/posts/<post_id>', methods = ['DELETE'])
def delete_post(post_id):
if not check_auth():
return jsonify({ 'error': 'Unauthorized' }), 403

db = get_db()
db.execute('DELETE FROM posts WHERE id = ?', (post_id,))
db.commit()
return jsonify({ 'message': 'Post deleted' })

#----------------MAIN ----------------
if __name__ == '__main__':
    with app.app_context():
    init_db()
app.run(debug = True)
If (Debug=True)
app_context(zoom=5++)
 
 end

        end
end

if (extends==true)
TouchButtonEvent==(true)