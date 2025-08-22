import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { db } from "./firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import AddExpense from "./components/AddExpense";
import { IoFilterSharp } from "react-icons/io5";
import { FaMoneyBill1Wave } from "react-icons/fa6";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("asc");

  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const expensesData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setExpenses(expensesData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (filterDate || filterCategory) {
      const filtered = expenses.filter((expense) => {
        if (!expense.createdAt) return false;
        const expenseDate = expense.createdAt.toDate();
        const dateStr = format(expenseDate, "yyyy-MM-dd");
        const matchDate = filterDate ? dateStr === filterDate : true;
        const matchCategory = filterCategory
          ? expense.category === filterCategory
          : true;
        return matchDate && matchCategory;
      });

      const sortedExpenses = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

      setFilteredExpenses(sortedExpenses);
    } else {
      const sortedExpenses = [...expenses].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

      setFilteredExpenses(sortedExpenses);
    }
  }, [filterDate, filterCategory, expenses, sortColumn, sortDirection]);

  const handleDeleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (err) {
      console.error("Error deleting: ", err);
    }
  };

  const handleSort = (column) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) return newDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredExpenses(sortedExpenses);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <div className="navbar">
        <h3>Expense Dashboard</h3>
      </div>

      <div className="d-flex flex-column align-items-center h-100">
        <div className="filter mb-3 gap-2">
          <label htmlFor="filterDate">Filter by Date</label>
          <input
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <label htmlFor="filterCategory" className="ms-4">
            Category
          </label>
          <select
            id="filterCategory"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
          </select>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("category")}>
                Category{" "}
                {sortColumn === "category" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("description")}>
                Description{" "}
                {sortColumn === "description" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("price")}>
                Price{" "}
                {sortColumn === "price" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("createdAt")}>
                Date{" "}
                {sortColumn === "createdAt" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("createdAt")}>
                time{" "}
                {sortColumn === "createdAt" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>{expense.price ? expense.price : "-"}</td>
                <td>
                  {expense.createdAt
                    ? format(expense.createdAt.toDate(), "dd/MM/yyyy")
                    : "-"}
                </td>
                <td>
                  {expense.createdAt
                    ? format(expense.createdAt.toDate(), "HH:mm:ss")
                    : "-"}
                </td>
                <td>
                  <button
                    className="delete-butt"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-butt" onClick={handleShowModal}>
          Add Expense <FaMoneyBill1Wave />
        </button>
      </div>

      <div className="footer">
        <h4 className="me-3">by Phuriphat Kamphirapaeng</h4>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddExpense closeModal={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
