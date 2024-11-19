from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each expense
    amount = db.Column(db.Float, nullable=False)  # Amount spent
    category = db.Column(db.String(50), nullable=False)  # e.g., "Food", "Transport"
    description = db.Column(db.String(200), nullable=True)  # Optional details
    date = db.Column(db.DateTime, default=datetime.utcnow)  # Date of expense
