from flask import Flask, jsonify, request
from flask_cors import CORS
from wordfind import choose
from wordrecord import markwordused

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

@app.route('/choose', methods=['GET'])
def api_choose():
    letters, chosen_word_dict = choose()
    if letters is None:
        return jsonify({'error': 'No unused words available.'}), 404
    return jsonify({'letters': letters, 'words': chosen_word_dict})

@app.route('/markwordused', methods=['POST'])
def api_markwordused():
    data = request.get_json()
    word = data.get('word')
    if not word:
        return jsonify({'error': 'No word provided.'}), 400
    markwordused(word)
    return jsonify({'status': 'success', 'word': word})

if __name__ == '__main__':
    app.run(debug=True, port=5050)
