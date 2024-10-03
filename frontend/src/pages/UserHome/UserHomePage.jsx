import React from 'react';

function UserHomePage() {
  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Log the user data to the console for debugging
  console.log(user); // Corrected from console,log to console.log

  return (
    <div className="user-home-page">
      <h1>User Home Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.firstName} {user.lastName}!</p>
          <p>Email: {user.email}</p>
          <p>Mobile: {user.mobile}</p>
          <p>Address: {user.address}, {user.city}</p>
          <p>User Type: {user.type}</p>
        </div>
      ) : (
        <p>No user data found. Please log in.</p>
      )}
    </div>
  );
}

export default UserHomePage;
