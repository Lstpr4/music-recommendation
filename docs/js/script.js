document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const songSelect = document.getElementById('song-select');
    const genreSelect = document.getElementById('genre-select');
    const recommendBySongBtn = document.getElementById('recommend-by-song');
    const recommendByGenreBtn = document.getElementById('recommend-by-genre');
    const resultsContainer = document.getElementById('results');
    const nowPlayingTitle = document.getElementById('now-playing-title');
    const nowPlayingArtist = document.getElementById('now-playing-artist');
    const playPauseBtn = document.getElementById('play-pause');
    const progressBar = document.getElementById('progress');
    const audioPlayer = document.getElementById('audio-player');
    const volumeSlider = document.getElementById('volume-slider');

    // State
    let allSongs = [];
    let isPlaying = false;
    let currentSong = null;
    let progressInterval = null; // Used for both simulation and tracking real audio

    // Load songs on page load
    fetchSongs();

    // Event Listeners
    recommendBySongBtn.addEventListener('click', recommendBySong);
    recommendByGenreBtn.addEventListener('click', recommendByGenre);
    playPauseBtn.addEventListener('click', togglePlayPause);
    volumeSlider.addEventListener('input', adjustVolume);
    
    // Set initial volume
    audioPlayer.volume = volumeSlider.value;

    // Fetch all songs
    async function fetchSongs() {
        try {
            const response = await fetch('/get_songs');
            const data = await response.json();
            allSongs = data.songs;
            
            // Populate song select dropdown
            songSelect.innerHTML = '';
            allSongs.forEach(song => {
                const option = document.createElement('option');
                option.value = song.song_id;
                option.textContent = `${song.title} - ${song.artist}`;
                songSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }

    // Get recommendations by song
    async function recommendBySong() {
        const songId = parseInt(songSelect.value);
        if (!songId) return;

        try {
            const response = await fetch('/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'song',
                    song_id: songId,
                    num_recommendations: 5
                }),
            });

            const data = await response.json();
            displayRecommendations(data.recommendations);
        } catch (error) {
            console.error('Error getting recommendations:', error);
        }
    }

    // Get recommendations by genre
    async function recommendByGenre() {
        const genre = genreSelect.value;
        if (!genre) return;

        try {
            const response = await fetch('/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'genre',
                    genre: genre,
                    num_recommendations: 5
                }),
            });

            const data = await response.json();
            displayRecommendations(data.recommendations);
        } catch (error) {
            console.error('Error getting recommendations:', error);
        }
    }

    // Display recommendations in the results container
    function displayRecommendations(recommendations) {
        if (!recommendations || recommendations.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No recommendations found.</p>';
            return;
        }

        resultsContainer.innerHTML = '';
        recommendations.forEach(song => {
            const songCard = document.createElement('div');
            songCard.classList.add('song-card');
            songCard.dataset.songId = song.song_id;
            
            songCard.innerHTML = `
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <p>Album: ${song.album}</p>
                <div class="meta">
                    <span>Year: ${song.release_year}</span>
                    <span>Genre: ${song.genre}</span>
                </div>
            `;
            
            songCard.addEventListener('click', () => playSong(song));
            resultsContainer.appendChild(songCard);
        });
    }

    // Play a song (real audio)
    function playSong(song) {
        console.log('Playing song:', song.title, 'Path:', song.audio_path);
        
        // Stop current song if playing
        if (audioPlayer.src) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            // Remove previous event listeners to prevent duplicates
            audioPlayer.removeEventListener('timeupdate', updateProgress);
            audioPlayer.removeEventListener('error', handleAudioError);
            audioPlayer.removeEventListener('ended', handleSongEnded);
        }
        
        // Update UI
        nowPlayingTitle.textContent = song.title;
        nowPlayingArtist.textContent = song.artist;
        playPauseBtn.textContent = '⏸️';
        progressBar.style.width = '0%';
        
        // Update state
        currentSong = song;
        isPlaying = true;
        
        // Set audio source and play
        try {
            // Ensure audio path is valid and add a cache buster
            let audioPath = song.audio_path;
            if (!audioPath.startsWith('/')) {
                audioPath = '/' + audioPath;
            }
            
            // Add a cache buster to avoid caching issues with audio files
            const cacheBuster = '?cb=' + new Date().getTime();
            audioPlayer.src = audioPath + cacheBuster;
            
            // Force the browser to load the audio again
            audioPlayer.load();
            
            // Set volume from slider
            audioPlayer.volume = volumeSlider.value;
            
            // Add event listeners for audio player
            audioPlayer.addEventListener('timeupdate', updateProgress);
            audioPlayer.addEventListener('ended', handleSongEnded);
            audioPlayer.addEventListener('error', handleAudioError);
            audioPlayer.addEventListener('canplay', () => {
                console.log('Audio can play!');
            });
            
            // Play the audio
            const playPromise = audioPlayer.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Audio playback started successfully');
                    })
                    .catch(error => {
                        console.error('Playback error:', error);
                        handleAudioError(error);
                    });
            }
        } catch (error) {
            handleAudioError(error);
        }
    }
    
    // Handle song ended event
    function handleSongEnded() {
        playPauseBtn.textContent = '▶️';
        isPlaying = false;
    }
    
    // Adjust volume of audio player
    function adjustVolume() {
        if (audioPlayer) {
            audioPlayer.volume = volumeSlider.value;
            console.log('Volume set to:', volumeSlider.value);
        }
    }
    
    // Handle audio errors
    function handleAudioError(error) {
        console.error('Error playing audio:', error);
        
        // Get more specific error info
        let errorMessage;
        if (audioPlayer.error) {
            const errorCode = audioPlayer.error.code;
            const errorMessages = {
                1: 'The fetching process was aborted',
                2: 'Network error occurred while loading',
                3: 'Error decoding the audio file',
                4: 'Audio file not supported'
            };
            errorMessage = errorMessages[errorCode] || 'Unknown error';
        } else {
            errorMessage = 'The audio file may be missing or in an unsupported format';
        }
        
        // Show a user-friendly message with specific details
        const message = `Could not play "${currentSong.title}". ${errorMessage}.\n\nTrying to load from: ${audioPlayer.src}`;
        console.warn(message);
        
        // For better user experience, don't show alert every time
        // alert(message);
        
        // Update the player UI to show error
        nowPlayingTitle.textContent = currentSong.title + ' (Error playing)';
        playPauseBtn.textContent = '▶️';
        isPlaying = false;
        
        // Simulate progress for demo purposes
        simulateAudioProgress();
    }
    
    // Simulate audio progress for demo purposes
    function simulateAudioProgress() {
        // Clear any existing interval
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        let progress = 0;
        progressInterval = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                playPauseBtn.textContent = '▶️';
                isPlaying = false;
            }
        }, 300); // 30 seconds for a full song (100 * 300ms = 30000ms = 30s)
    }
    
    // Update progress bar based on audio current time
    function updateProgress() {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${percent}%`;
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (!currentSong) return;
        
        if (isPlaying) {
            // Pause
            if (audioPlayer.src && !audioPlayer.error) {
                audioPlayer.pause();
            }
            
            // Pause the simulation if we're using that
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            
            playPauseBtn.textContent = '▶️';
            isPlaying = false;
        } else {
            // Resume
            if (audioPlayer.src && !audioPlayer.error) {
                audioPlayer.play().catch(handleAudioError);
                playPauseBtn.textContent = '⏸️';
                isPlaying = true;
            } else {
                // If we're using simulation, restart it
                playPauseBtn.textContent = '⏸️';
                isPlaying = true;
                simulateAudioProgress();
            }
        }
    }
});
