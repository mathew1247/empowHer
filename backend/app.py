"""
EmpowHer — Flask Application Entry Point
=========================================
Initialises Flask, SQLAlchemy, Flask-Bcrypt, Flask-JWT-Extended, and Flask-CORS,
then registers the auth Blueprint and creates all database tables on startup.

Run in development:
    python app.py

Run with Flask CLI:
    flask run --debug
"""

import os
from datetime import timedelta

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Load variables from .env before anything else touches os.environ
load_dotenv()

# Local imports (models.py and routes/auth.py live next to this file)
from models import db
from routes.auth import auth_bp, bcrypt


def create_app() -> Flask:
    """
    Application factory — creates and fully configures the Flask app.
    Using a factory makes the app easily testable and importable.
    """
    app = Flask(__name__)

    # ── Core Flask config ──────────────────────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me-in-production")

    # ── PostgreSQL / SQLAlchemy config ─────────────────────────────────────
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:password@localhost:5432/empowher_db",
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Suppress deprecation warning

    # ── JWT config ─────────────────────────────────────────────────────────
    app.config["JWT_SECRET_KEY"]          = os.getenv("JWT_SECRET_KEY", "change-jwt-key")
    app.config["JWT_TOKEN_LOCATION"]      = ["cookies"]   # Read JWT from cookies only
    app.config["JWT_ACCESS_COOKIE_NAME"]  = "access_token_cookie"
    app.config["JWT_COOKIE_SECURE"]       = False         # True in production (HTTPS)
    app.config["JWT_COOKIE_SAMESITE"]     = "Lax"        # Protect against CSRF
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False         # Disabled for simplicity; enable in prod
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

    # ── CORS config ────────────────────────────────────────────────────────
    # Flask-CORS 6.x still uses `supports_credentials` (not allow_credentials).
    # allow_credentials was silently ignored, causing preflight to fail.
    # Vite uses 5173 by default but falls back to 5174/5175 if the port is busy.
    CORS(
        app,
        origins=[
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:3000",
        ],
        supports_credentials=True,   # Required for HTTP-only cookie cross-origin
    )

    # ── Extension initialisation ───────────────────────────────────────────
    db.init_app(app)       # Bind SQLAlchemy to this app instance
    bcrypt.init_app(app)   # Bind Bcrypt to this app instance
    JWTManager(app)        # Bind JWT manager to this app instance

    # ── Blueprint registration ─────────────────────────────────────────────
    # All auth routes are prefixed with /api/auth (defined in the blueprint)
    app.register_blueprint(auth_bp)

    # ── JWT error handlers ─────────────────────────────────────────────────
    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"error": "Unauthorized. Please log in."}), 401

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify({"error": "Unprocessable token. Please log in again."}), 422

    # ── Create tables ──────────────────────────────────────────────────────
    with app.app_context():
        db.create_all()   # Creates `users` table if it does not already exist
        print("[OK] Database tables verified / created.")

    return app


# ── Entry point ────────────────────────────────────────────────────────────────
app = create_app()

if __name__ == "__main__":
    # debug=True enables hot-reload and detailed error pages in development.
    # NEVER run with debug=True in production.
    app.run(
        debug=os.getenv("FLASK_DEBUG", "True") == "True",
        host="0.0.0.0",
        port=5000,
    )
