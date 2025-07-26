// This script checks if the audio files can be played by the browser
document.addEventListener('DOMContentLoaded', function() {
    // Try to load each audio file and report back
    const audioContainer = document.createElement('div');
    audioContainer.style.display = 'none';
    document.body.appendChild(audioContainer);
    
    // Test the first 5 audio files
    for (let i = 1; i <= 5; i++) {
        const audioPath = `/static/audio/sample${i}.mp3`;
        const audio = new Audio();
        audio.src = audioPath;
        
        audio.oncanplaythrough = function() {
            console.log(`✅ Audio file ${audioPath} loaded successfully!`);
        };
        
        audio.onerror = function() {
            console.error(`❌ Error loading audio file ${audioPath}`);
            console.error('Error code:', audio.error ? audio.error.code : 'unknown');
        };
        
        audioContainer.appendChild(audio);
    }
    
    console.log('Audio test script running...');
});
