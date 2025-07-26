# PythonAnywhere Deployment Guide for Music Recommendation System

This guide will help you deploy this Flask application to [PythonAnywhere](https://www.pythonanywhere.com/), which offers a free tier that can host Flask applications.

## Steps for Deployment:

1. **Sign up for PythonAnywhere**:
   - Go to [PythonAnywhere.com](https://www.pythonanywhere.com/)
   - Create a free account

2. **Open a Bash console**:
   - After logging in, go to the Dashboard
   - Click on "Bash" under "New console"

3. **Clone your GitHub repository**:
   ```bash
   git clone https://github.com/Lstpr4/music-recommendation.git
   cd music-recommendation
   ```

4. **Create a virtual environment and install dependencies**:
   ```bash
   mkvirtualenv --python=/usr/bin/python3.9 music-env
   pip install -r requirements.txt
   ```

5. **Configure a Web app**:
   - Go to the "Web" tab in PythonAnywhere
   - Click "Add a new web app"
   - Choose "Manual configuration"
   - Select "Python 3.9"
   - Set the path to your Flask app: `/home/yourusername/music-recommendation/app.py`

6. **Configure WSGI file**:
   - PythonAnywhere will create a WSGI file for you
   - Click on the WSGI file link in the web app configuration
   - Replace the content with:
   ```python
   import sys
   path = '/home/yourusername/music-recommendation'
   if path not in sys.path:
       sys.path.append(path)

   from app import app as application
   ```

7. **Set up Static Files**:
   - In the "Web" tab, under "Static Files"
   - Add the following mappings:
     - URL: `/static/` -> Directory: `/home/yourusername/music-recommendation/static`

8. **Reload the web app**:
   - Click the "Reload" button for your web app

9. **Visit your app**:
   - Your app will be available at: `yourusername.pythonanywhere.com`

## Troubleshooting:

- Check the error logs in the "Web" tab if your app doesn't work
- Make sure all files have the right permissions
- Ensure your virtual environment has all the required packages
- Check that static files are properly configured

## Updating Your App:

When you make changes to your GitHub repository, you can update your PythonAnywhere deployment:

1. Open a Bash console in PythonAnywhere
2. Navigate to your app directory
3. Pull the latest changes:
   ```bash
   cd ~/music-recommendation
   git pull
   ```
4. Reload the web app from the "Web" tab
