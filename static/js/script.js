const form = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');

// Fetch and display expenses
async function fetchExpenses() {
    const response = await fetch('/expenses');
    const expenses = await response.json();

    expenseList.innerHTML = ''; // Clear the list
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.category}: $${expense.amount} (${expense.description || 'No description'})
            <button onclick="deleteExpense(${expense.id})">Delete</button>
        `;
        expenseList.appendChild(li);
    });
}

// Add new expense
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    await fetch('/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, category, description })
    });

    form.reset();
    fetchExpenses();
});

// Delete an expense
async function deleteExpense(id) {
    await fetch(`/expenses/${id}`, { method: 'DELETE' });
    fetchExpenses();
}

// Load expenses on page load
fetchExpenses();
