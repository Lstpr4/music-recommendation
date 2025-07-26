import os
import pandas as pd
import numpy as np
from flask import Flask, render_template, request, jsonify
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load music data
def load_music_data():
    try:
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'music_data.csv')
        music_df = pd.read_csv(data_path)
        return music_df
    except Exception as e:
        print(f"Error loading music data: {e}")
        return pd.DataFrame()

# Preprocess and prepare the music data
def prepare_music_data(music_df):
    # Select features for recommendation
    features = ['popularity', 'danceability', 'energy', 'valence']
    
    # Scale the features
    scaler = MinMaxScaler()
    music_features = scaler.fit_transform(music_df[features])
    
    return music_features

# Get recommendations based on a song
def get_recommendations_by_song(song_id, music_df, music_features, num_recommendations=5):
    # Find the index of the song
    song_idx = music_df[music_df['song_id'] == song_id].index[0]
    
    # Calculate similarity scores
    similarities = cosine_similarity([music_features[song_idx]], music_features)
    
    # Get the indices of the most similar songs (excluding the input song)
    similar_indices = similarities.argsort()[0][::-1][1:num_recommendations+1]
    
    # Get the recommended songs
    recommendations = music_df.iloc[similar_indices].to_dict('records')
    
    return recommendations

# Get recommendations based on genre
def get_recommendations_by_genre(genre, music_df, music_features, num_recommendations=5):
    # Filter songs by genre
    genre_songs = music_df[music_df['genre'] == genre]
    
    if len(genre_songs) == 0:
        return []
    
    # Sort by popularity and take top recommendations
    recommended_songs = genre_songs.sort_values('popularity', ascending=False).head(num_recommendations)
    
    return recommended_songs.to_dict('records')

# Global variables
music_df = load_music_data()
music_features = prepare_music_data(music_df) if not music_df.empty else None

@app.route('/')
def index():
    return render_template('index.html', genres=sorted(music_df['genre'].unique()))

@app.after_request
def add_header(response):
    """Add headers to allow audio playback."""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@app.route('/audio-test')
def audio_test():
    """A test page for directly playing audio files."""
    return render_template('audio-test.html')

@app.route('/get_songs', methods=['GET'])
def get_songs():
    return jsonify({'songs': music_df[['song_id', 'title', 'artist', 'audio_path']].to_dict('records')})

@app.route('/recommend', methods=['POST'])
def recommend():
    if request.method == 'POST':
        data = request.get_json()
        recommendation_type = data.get('type', 'song')
        num_recommendations = int(data.get('num_recommendations', 5))
        
        if recommendation_type == 'song':
            song_id = int(data.get('song_id', 1))
            recommendations = get_recommendations_by_song(song_id, music_df, music_features, num_recommendations)
            return jsonify({'recommendations': recommendations})
        elif recommendation_type == 'genre':
            genre = data.get('genre', 'Pop')
            recommendations = get_recommendations_by_genre(genre, music_df, music_features, num_recommendations)
            return jsonify({'recommendations': recommendations})
        else:
            return jsonify({'error': 'Invalid recommendation type'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
