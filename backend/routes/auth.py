"""
EmpowHer — Auth Blueprint
Handles all authentication routes:
  POST /api/auth/signup   — Register a new user
  POST /api/auth/login    — Authenticate and set JWT cookie
  POST /api/auth/logout   — Clear the JWT cookie
  GET  /api/auth/profile  — Protected route: return current user info
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    unset_jwt_cookies,
)
from flask_bcrypt import Bcrypt
from models import db, User

# ── Blueprint & Bcrypt setup ───────────────────────────────────────────────────
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
bcrypt = Bcrypt()   # Initialised with the app in app.py via bcrypt.init_app(app)


# ── POST /api/auth/signup ──────────────────────────────────────────────────────
@auth_bp.route("/signup", methods=["POST"])
def signup():
    """
    Register a new user.

    Expects JSON body:
        { "username": str, "email": str, "password": str }

    Returns:
        201 — { "message": "...", "user": { id, username, email } }
        400 — { "error": "..." }  on validation / duplicate errors
    """
    data = request.get_json(silent=True)

    # ── Input validation ────────────────────────────────────────────────────
    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    username = data.get("username", "").strip()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not username or not email or not password:
        return jsonify({"error": "username, email, and password are all required."}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    # ── Duplicate check ─────────────────────────────────────────────────────
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists."}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "This username is already taken."}), 400

    # ── Hash password & persist ─────────────────────────────────────────────
    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user  = User(username=username, email=email, password=hashed_pw)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Account created successfully! Welcome to EmpowHer 💜",
        "user": new_user.to_dict(),
    }), 201


# ── POST /api/auth/login ───────────────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate a user and set a JWT inside an HTTP-only cookie.

    Expects JSON body:
        { "email": str, "password": str }

    Returns:
        200 — { "message": "...", "user": { id, username, email } }
              + Set-Cookie: access_token_cookie (HttpOnly)
        400 — { "error": "..." }
        401 — { "error": "Invalid email or password." }
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "email and password are required."}), 400

    # ── Look up user ────────────────────────────────────────────────────────
    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password."}), 401

    # ── Create JWT and inject into cookie ───────────────────────────────────
    # Identity is stored as the user's id (integer → str for JWT subject)
    access_token = create_access_token(identity=str(user.id))

    response = jsonify({
        "message": f"Welcome back, {user.username}! 💜",
        "user": user.to_dict(),
    })

    # set_access_cookies writes the JWT into an HTTP-only cookie automatically
    set_access_cookies(response, access_token)

    return response, 200


# ── POST /api/auth/logout ──────────────────────────────────────────────────────
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """
    Log out the current user by clearing the JWT cookie.

    Returns:
        200 — { "message": "Logged out successfully." }
        401 — if no valid JWT cookie is present
    """
    response = jsonify({"message": "Logged out successfully. See you soon! 👋"})
    unset_jwt_cookies(response)   # Clears access_token_cookie from the browser
    return response, 200


# ── GET /api/auth/profile ──────────────────────────────────────────────────────
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    """
    Protected route — return the authenticated user's profile.

    The @jwt_required() decorator verifies the JWT stored in the cookie.
    get_jwt_identity() returns the user id we embedded at login.

    Returns:
        200 — { "user": { id, username, email } }
        401 — if cookie is missing / expired / invalid
        404 — if user id no longer exists in the database
    """
    user_id = get_jwt_identity()          # Reads identity from the verified JWT
    user    = db.session.get(User, int(user_id))

    if not user:
        return jsonify({"error": "User not found."}), 404

    return jsonify({"user": user.to_dict()}), 200
