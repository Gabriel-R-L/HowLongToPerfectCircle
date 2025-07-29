# How Long To Perfect Circle

A minimalist web application that challenges users to draw a perfect circle using only their mouse or finger. The application tracks attempts and evaluates the accuracy of each drawing.

## Concept

This application is based on the question: "How many attempts does it take for a human to draw a perfect circle using only a pencil, without any tools?"

The site presents this premise through smooth, scroll-driven transitions. At the end of the experience, users are invited to attempt drawing a perfect circle. The application tracks the number of attempts and evaluates the accuracy of each drawing. If a user's attempt reaches at least 80% similarity to a perfect circle, it is recognized as successful.

## Features

- Smooth scroll-driven transitions on the landing page
- Interactive canvas for drawing circles
- Real-time evaluation of circle accuracy
- Statistics tracking for individual users and global data
- Responsive design that works on both desktop and mobile devices

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python with Flask
- **Data Storage**: JSON file (for simplicity)

## Setup and Installation

1. Clone this repository
2. Create a virtual environment (recommended):
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On macOS/Linux
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the application:
   ```
   python app.py
   ```
5. Open your browser and navigate to `http://127.0.0.1:5000`

## Project Structure

```
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── static/                # Static files
│   ├── css/               # CSS stylesheets
│   │   ├── style.css      # Main stylesheet
│   │   ├── index.css      # Index page styles
│   │   ├── draw.css       # Drawing page styles
│   │   └── results.css    # Results page styles
│   └── js/                # JavaScript files
│       ├── main.js        # Common functionality
│       ├── index.js       # Index page functionality
│       └── draw.js        # Drawing functionality
├── templates/             # HTML templates
│   ├── base.html          # Base template
│   ├── index.html         # Landing page
│   ├── draw.html          # Drawing page
│   └── results.html       # Results page
└── data/                  # Data storage
    └── attempts.json      # Stored attempts (created automatically)
```

## How It Works

1. Users are introduced to the concept through a scroll-driven narrative
2. They are then invited to try drawing a perfect circle
3. The application evaluates the drawing by:
   - Finding the center point of the drawn shape
   - Calculating the average radius and standard deviation
   - Computing a similarity score based on how consistent the radii are
4. Results are displayed to the user and stored for statistics

## License

MIT