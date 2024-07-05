import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the faTimes icon
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Import Firebase auth methods

export default function Nav({ onSearch }) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null); // State to track the user

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up a Firebase auth state observer and get user data
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [auth]);

  const handleSearchIconClick = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleLogout = () => {
    const conf = window.confirm("Are you sure you want to Logout");
    if (conf) {
      signOut(auth)
        .then(() => {
          // Sign-out successful
          setUser(null);
          navigate('/login');
        })
        .catch((error) => {
          // An error happened
          console.error('Error signing out: ', error);
        });
    }
  };

  return (
    <div>
      <header className="text-gray-600 body-font border-2">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <div className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
            <Link to="/">
              <span className="ml-3 text-3xl bg-blue-600 p-2 focus:outline-none rounded-md">Studio-10</span>
            </Link>
            <FontAwesomeIcon
              icon={faSearch}
              className="ml-4 text-gray-500 text-xl cursor-pointer"
              onClick={handleSearchIconClick}
            />
          </div>
          {searchVisible && (
            <div className="w-full md:w-auto md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center mb-4 md:mb-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-gray-100 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-base px-4 py-2"
                  placeholder="Search items..."
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className="absolute right-2 top-2 text-gray-500 text-xl cursor-pointer"
                  onClick={handleClearSearch}
                />
              </div>
            </div>
          )}
          <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
            {/* Add any additional navigation items here if needed */}
          </nav>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
            <button className="inline-flex items-center bg-slate-200 hover:bg-slate-400 border-0 py-1 px-3 focus:outline-none rounded text-base text-black">
              Filter
            </button>
            <Link to="/add">
              <button className="inline-flex items-center bg-blue-700 hover:bg-blue-800 border-0 py-1 px-3 focus:outline-none rounded text-base text-white">
                Add Item +
              </button>
            </Link>
            <Link to="/reordered">
              <button className="inline-flex items-center bg-green-700 hover:bg-green-500 border-0 py-1 px-3 focus:outline-none rounded text-base text-white">
                Reordered Items
              </button>
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center bg-slate-700 hover:bg-slate-500 border-0 py-1 px-3 focus:outline-none rounded text-base text-white text-center w-[80px]"
              >
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="inline-flex items-center bg-slate-700 hover:bg-slate-500 border-0 py-1 px-3 focus:outline-none rounded text-base text-white w-[80px]">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
