import React from "react";
import "./UserTable.css";

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => onEdit(user)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => onDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
