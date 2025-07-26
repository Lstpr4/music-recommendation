#!/bin/bash
# Download sample mp3 files for all songs
# We will use free sample mp3s from SampleLib

SAMPLES=(
  "https://download.samplelib.com/mp3/sample-3s.mp3"
  "https://download.samplelib.com/mp3/sample-6s.mp3"
  "https://download.samplelib.com/mp3/sample-9s.mp3"
  "https://download.samplelib.com/mp3/sample-12s.mp3"
  "https://download.samplelib.com/mp3/sample-15s.mp3"
)

for i in {1..30}; do
  # Cycle through the samples for variety
  index=$(( (i-1) % 5 ))
  url=${SAMPLES[$index]}
  echo "Downloading sample$i.mp3..."
  curl -s -L -o "sample$i.mp3" "$url"
done

echo "All files downloaded successfully!"
