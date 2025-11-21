import { useState, useEffect } from "react";
import axios from "axios";
import UserTable from "./components/UserTable";
import UserForm from "./components/UserForm";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";
const USERS_PER_PAGE = 5;

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users whenever searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }

    // Reset to page 1 when searching
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      setError("Failed to load user list. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new user
  const handleCreateUser = async (userData) => {
    try {
      const response = await axios.post(API_URL, userData);

      // Fake API → create local ID
      const newUser = {
        ...response.data,
        id: users.length + 1,
      };

      setUsers((prev) => [newUser, ...prev]);
      setIsFormOpen(false);
    } catch (err) {
      setError("Failed to create user. Please try again.");
      console.error("Error creating user:", err);
    }
  };

  // Update user
  const handleUpdateUser = async (userData) => {
    try {
      await axios.put(`${API_URL}/${editingUser.id}`, userData);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...userData } : user
        )
      );

      setIsFormOpen(false);
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user. Please try again.");
      console.error("Error updating user:", err);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      console.error("Error deleting user:", err);
    }
  };

  // Open edit form
  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // Open create form
  const handleAddClick = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  // Handle form submit
  const handleFormSubmit = async (userData) => {
    if (editingUser) {
      await handleUpdateUser(userData);
    } else {
      await handleCreateUser(userData);
    }
  };

  // Pagination calculation
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>User Management</h1>
          <button className="btn btn-add" onClick={handleAddClick}>
            + Add User
          </button>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {loading && <div className="loading">Loading...</div>}

        {!loading && (
          <>
            <UserTable
              users={currentUsers}
              onEdit={handleEditClick}
              onDelete={handleDeleteUser}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {isFormOpen && (
          <UserForm
            user={editingUser}
            onSubmit={handleFormSubmit}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
}

export default App;
