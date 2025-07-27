// GitHub Pages specific JS
document.addEventListener('DOMContentLoaded', function() {
    console.log('GitHub Pages site loaded successfully!');
    
    // Add a note at the bottom of the page
    const footer = document.querySelector('footer') || document.createElement('div');
    
    // Song click functionality
    document.querySelectorAll('.song-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.song-title').textContent;
            const artist = this.querySelector('.song-artist').textContent;
            
            document.getElementById('now-playing-title').textContent = title;
            document.getElementById('now-playing-artist').textContent = artist;
            
            // Simulate progress
            document.getElementById('play-pause').textContent = '⏸️';
            document.getElementById('progress').style.width = '0%';
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 1;
                document.getElementById('progress').style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(interval);
                    document.getElementById('play-pause').textContent = '▶️';
                    document.getElementById('progress').style.width = '0%';
                }
            }, 200);
        });
    });
    
    // Volume control
    document.getElementById('volume-slider').addEventListener('input', function() {
        console.log('Volume set to: ' + this.value);
    });
});
