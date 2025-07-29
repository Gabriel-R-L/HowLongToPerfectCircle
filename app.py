from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os
import json
from datetime import datetime
from flask_babel import Babel

app = Flask(__name__)
app.secret_key = 'perfect_circle_secret_key'

# DEBUG
DEBUG = False

# Data storage path
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'attempts.json')

# Ensure data directory exists
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

# Initialize data file if it doesn't exist
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

# Available languages
LANGUAGES = {
    'en': 'English',
    'es': 'Español',
    'fr': 'Français'
}

# Load translations
def load_translations(lang):
    if lang not in LANGUAGES:
        lang = 'en'  # Default to English
    
    translation_file = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'translations',
        f'{lang}.json'
    )
    
    with open(translation_file, 'r', encoding='utf-8') as f:
        return json.load(f)

@app.route('/')
def index():
    # Get language from session or default to English
    lang = session.get('lang', 'en')
    translations = load_translations(lang)
    
    return render_template('index.html', translations=translations, languages=LANGUAGES, current_lang=lang)

@app.route('/draw')
def draw():
    # Get language from session or default to English
    lang = session.get('lang', 'en')
    translations = load_translations(lang)
    
    return render_template('draw.html', translations=translations, languages=LANGUAGES, current_lang=lang)

@app.route('/results')
def results():
    # Get language from session or default to English
    lang = session.get('lang', 'en')
    translations = load_translations(lang)
    
    return render_template('results.html', translations=translations, languages=LANGUAGES, current_lang=lang)

@app.route('/api/submit-attempt', methods=['POST'])
def submit_attempt():
    data = request.json
    similarity = data.get('similarity', 0)
    success = similarity >= 80
    
    # Get user's IP address
    # For testing, use X-Forwarded-For header if available
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    
    # Load existing attempts
    attempts = []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            attempts = json.load(f)
    
    # Add new attempt
    attempt = {
        'timestamp': datetime.now().isoformat(),
        'similarity': similarity,
        'success': success,
        'ip_address': ip_address
    }    
    attempts.append(attempt)
    
    # Save updated attempts
    with open(DATA_FILE, 'w') as f:
        json.dump(attempts, f)
    
    return jsonify({
        'success': success,
        'similarity': similarity,
        'attempts': len(attempts)
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    # Load attempts
    attempts = []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            attempts = json.load(f)
    
    # Calculate stats
    total_attempts = len(attempts)
    successful_attempts = sum(1 for a in attempts if a['success'])
    avg_similarity = sum(a['similarity'] for a in attempts) / max(total_attempts, 1)
    
    # Count unique IP addresses
    unique_ips = set()
    for attempt in attempts:
        if 'ip_address' in attempt:
            unique_ips.add(attempt['ip_address'])
    unique_locations = len(unique_ips)
    
    return jsonify({
        'total_attempts': total_attempts,
        'successful_attempts': successful_attempts,
        'avg_similarity': avg_similarity,
        'unique_locations': unique_locations
    })

@app.route('/set-language/<lang>')
def set_language(lang):
    # Validate language
    if lang in LANGUAGES:
        session['lang'] = lang
    
    # Redirect back to the referring page or home
    referrer = request.referrer
    if referrer:
        return redirect(referrer)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=DEBUG)