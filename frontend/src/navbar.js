import React from "react";
import { Link,  useMatch, useResolvedPath } from "react-router-dom";
import { useAuth } from './pages/AuthContext'; // Import the useAuth hook to access user data

export default function Navbar() {
  const { user, logout } = useAuth(); // Access user data and logout function from the authentication context

  const handleLogout = () => {
    logout(); // Call the logout function
    
  };

  return (
    <nav className="nav">
      {/* Welcomes the user when the user is logged in */}
      {user ? (
        <Link to="/" className="site-title">
          Welcome, {user.username}
        </Link>
      ) : (
        <Link to="/" className="site-title">
          Receipt Tracker
        </Link>
      )}
      
      <ul>
        <CustomLink to="/about" className="nav-options">About</CustomLink>
        {/* Switches to logout if user is logged in */}
        {user ? (
          <CustomLink to="/" className="nav-options" onClick={handleLogout}>Logout</CustomLink>
        ) : (
          <CustomLink to="/login" className="nav-options">Login</CustomLink>
        )}
      </ul>
    </nav>
  );
}

// This function is to highlight the selected page in the navbar 
function CustomLink({ to, children, ...props }) {
  
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
