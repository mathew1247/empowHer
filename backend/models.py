"""
EmpowHer — SQLAlchemy User Model
Defines the `users` table with id, username, email, and hashed password.
"""

from flask_sqlalchemy import SQLAlchemy

# Shared SQLAlchemy instance imported by app.py and auth.py
db = SQLAlchemy()


class User(db.Model):
    """
    Represents a registered EmpowHer user.

    Columns:
        id       — Primary key (auto-incremented integer)
        username — Unique display name chosen at signup
        email    — Unique email address used for login
        password — bcrypt-hashed password (never stored in plain text)
    """

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # bcrypt hash

    def __repr__(self):
        return f"<User id={self.id} username={self.username} email={self.email}>"

    def to_dict(self):
        """
        Return a safe, serialisable dictionary of the user.
        Password is deliberately excluded.
        """
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }
