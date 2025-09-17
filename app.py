from flask import Flask, jsonify, request
from flask_cors import CORS
from wordfind import generate

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['GET'])
def generate_words():
    min_length = request.args.get('min_length', default=3, type=int)
    max_length = request.args.get('max_length', default=8, type=int)
    max_words = request.args.get('max_words', default=20, type=int)

    letters, chosen_word_dict, rejects = generate(min_length, max_length, max_words)
    print  (letters, chosen_word_dict)

    return jsonify({
        'letters': letters,
        'words': chosen_word_dict
    })

if __name__ == '__main__':
    app.run(debug=True)
