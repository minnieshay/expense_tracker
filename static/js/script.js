const form = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const editForm = document.getElementById('editExpenseForm');
const editModal = document.getElementById('editModal');

// Fetch and display expenses
async function fetchExpenses() {
    const response = await fetch('/expenses');
    const expenses = await response.json();

    expenseList.innerHTML = ''; // Clear the list
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.category}: $${expense.amount} (${expense.description || 'No description'})
            <button onclick="openEditModal(${expense.id}, '${expense.amount}', '${expense.category}', '${expense.description || ''}')">Edit</button>
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

// Open Modal
function openEditModal(id, amount, category, description) {
    const editModal = document.getElementById('editModal');
    document.getElementById('editExpenseId').value = id;
    document.getElementById('editAmount').value = amount;
    document.getElementById('editCategory').value = category;
    document.getElementById('editDescription').value = description;

    editModal.classList.add('show'); // Add the "show" class
}

// Close Modal
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    editModal.classList.remove('show'); // Remove the "show" class
}


// Update Expense
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editExpenseId').value; // Ensure ID is retrieved correctly
    const amount = document.getElementById('editAmount').value;
    const category = document.getElementById('editCategory').value;
    const description = document.getElementById('editDescription').value;

    if (!id) {
        console.error("Expense ID is missing. Cannot update expense.");
        return;
    }

    const response = await fetch(`/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, category, description })
    });

    if (response.ok) {
        closeEditModal(); // Close the modal after successful update
        fetchExpenses(); // Reload the expense list
    } else {
        console.error("Failed to update expense:", response.statusText);
    }
});

// Delete an expense
async function deleteExpense(id) {
    await fetch(`/expenses/${id}`, { method: 'DELETE' });
    fetchExpenses();
}

// Category Summary
async function fetchCategorySummary() {
    const response = await fetch('/expenses/summary');
    const summary = await response.json();

    const summaryContainer = document.getElementById('categorySummary');
    summaryContainer.innerHTML = ''; // Clear previous summary

    summary.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `${item.category}: $${item.total.toFixed(2)}`;
        summaryContainer.appendChild(div);
    });
}

// Monthly Report
async function fetchMonthlyReport() {
    const response = await fetch('/expenses/reports');
    const report = await response.json();

    const reportContainer = document.getElementById('monthlyReport');
    reportContainer.innerHTML = ''; // Clear previous reports

    report.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `${item.month}: $${item.total.toFixed(2)}`;
        reportContainer.appendChild(div);
    });
}

// Search
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = document.getElementById('searchCategory').value;
    const description = document.getElementById('searchDescription').value;
    const startDate = document.getElementById('searchStartDate').value;
    const endDate = document.getElementById('searchEndDate').value;

    const params = new URLSearchParams({ category, description, start_date: startDate, end_date: endDate });
    const response = await fetch(`/expenses/search?${params}`);
    const results = await response.json();

    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    results.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.category}: $${expense.amount} (${expense.description || 'No description'})`;
        searchResults.appendChild(li);
    });
});























// Load expenses on page load
fetchExpenses();
fetchCategorySummary();
fetchMonthlyReport();


