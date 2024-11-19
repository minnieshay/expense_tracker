# app.py
from flask import Flask, request, jsonify, render_template
from models import db, Expense

app = Flask(__name__)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Initialize the database
with app.app_context():
    db.create_all()

# Serve the main page
@app.route('/')
def index():
    return render_template('index.html')

# Route: Add an expense
@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.json
    new_expense = Expense(
        amount=data['amount'],
        category=data['category'],
        description=data.get('description', ''),
    )
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"message": "Expense added successfully!", "expense": new_expense.id}), 201

# Route: Get all expenses
@app.route('/expenses', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    expenses_list = [{
        "id": e.id,
        "amount": e.amount,
        "category": e.category,
        "description": e.description,
        "date": e.date.strftime('%Y-%m-%d %H:%M:%S')
    } for e in expenses]
    return jsonify(expenses_list), 200

# Route: Update an expense
@app.route('/expenses/<int:id>', methods=['PUT'])
def update_expense(id):
    data = request.json
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

# Update expense fields
    expense.amount = data.get('amount', expense.amount)
    expense.category = data.get('category', expense.category)
    expense.description = data.get('description', expense.description)
    db.session.commit()
    return jsonify({"message": "Expense updated successfully!"}), 200

# Route: Delete an expense
@app.route('/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Expense deleted successfully!"}), 200


@app.route('/expenses/summary', methods=['GET'])
def get_expenses_summary():
    # Query all expenses grouped by category and calculate totals
    results = db.session.query(
        Expense.category,
        db.func.sum(Expense.amount).label('total')
    ).group_by(Expense.category).all()

    # Prepare a summary response
    summary = [{"category": result[0], "total": result[1]} for result in results]
    return jsonify(summary), 200































if __name__ == '__main__':
    app.run(debug=True)
