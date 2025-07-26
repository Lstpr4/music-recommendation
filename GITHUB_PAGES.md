# GitHub Pages Setup Guide

This project includes a GitHub Pages site to serve as a landing page for the project. The actual Flask application needs to be deployed separately to a platform that supports Python/Flask (like PythonAnywhere, Heroku, etc.).

## Accessing the GitHub Pages Site

Once set up, the GitHub Pages site is available at: 
https://Lstpr4.github.io/music-recommendation/

## Setting Up GitHub Pages

1. Go to your GitHub repository: https://github.com/Lstpr4/music-recommendation
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select the branch "main" and the folder "/docs"
5. Click "Save"

After a few minutes, your site will be published.

## Modifying the GitHub Pages Site

The GitHub Pages site is built from the HTML files in the `/docs` directory of your repository. To modify the site:

1. Edit the files in the `/docs` directory
2. Commit and push your changes to GitHub
3. GitHub will automatically rebuild and redeploy your site

```bash
# After making changes to the /docs directory
git add docs/
git commit -m "Update GitHub Pages site"
git push origin main
```

## Understanding the GitHub Pages Setup

- The `/docs` directory contains all files for the GitHub Pages site
- `index.html` is the main landing page
- This site is separate from the Flask application and serves as a project overview/documentation
