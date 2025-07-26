# Music Recommendation System

A web-based music recommendation system built with Python, Flask, HTML, CSS, and JavaScript.

## Features

- Get music recommendations based on songs or genres
- Interactive user interface with music player
- Audio playback for all songs
- Responsive design for desktop and mobile devices

## Technologies Used

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **Data Analysis**: Pandas, NumPy, Scikit-learn
- **Audio**: HTML5 Audio API

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Lstpr4/music-recommendation.git
   cd music-recommendation
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   flask run
   ```

5. Open your browser and go to `http://127.0.0.1:5000`

## Usage

- **Song-Based Recommendations**: Select a song from the dropdown and click "Get Recommendations" to find similar songs
- **Genre-Based Recommendations**: Select a genre from the dropdown and click "Get Recommendations" to find top songs in that genre
- **Audio Player**: Click on any recommended song to play it in the built-in audio player

## Project Structure

- `app.py`: Main Flask application
- `data/`: Contains the music dataset
- `static/`: Static files (CSS, JavaScript, audio files)
- `templates/`: HTML templates

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Lstpr4 - [GitHub](https://github.com/Lstpr4)

## Acknowledgements

- Sample audio files from SampleLib
- Inspired by music streaming platforms like Spotify and Apple Music
