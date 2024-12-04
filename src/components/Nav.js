import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTimes } from '@fortawesome/free-solid-svg-icons';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// import FilterModal from './FilterModal';

export default function Nav({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

  // const handleApplyFilters = () => {
  //   // Apply filter logic here
  //   console.log("Filters applied");
  //   setIsModalOpen(false);
  // };

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

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
    const conf = window.confirm("Are you sure you want to Logout?");
    if (conf) {
      signOut(auth)
        .then(() => {
          setUser(null);
          navigate('/login');
        })
        .catch((error) => {
          console.error('Error signing out: ', error);
        });
    }
  };

  return (
    <div>
      <header className="text-gray-600 body-font border-2">
        <div className="container mx-auto p-5 flex flex-col">
          {/* First Row: Logout button and Title */}
          <div className="flex  items-center mb-4 justify-between lg:justify-center lg:gap-10">
            
            <Link to="/">
              <span className="ml-3 text-3xl bg-blue-600 p-2 focus:outline-none rounded-md text-white">Studio-10</span>
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center bg-slate-700 hover:bg-slate-500 border-0 py-1 px-3 focus:outline-none rounded text-base text-white"
              >
                Logout
              </button>
            )}
          </div>

          {/* Second Row: Filter, Add Item, Reordered Buttons */}
          <div className="flex justify-around lg:justify-center lg:gap-7 items-center mb-4">
            {/* <button className="flex items-center bg-slate-400 hover:bg-slate-600 border-0 py-1 px-3 focus:outline-none rounded text-base text-black" onClick={handleOpenModal}>
              Filter
            </button>
            <FilterModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onApply={handleApplyFilters}
            /> */}
            <Link to="/add">
              <button className="flex items-center bg-blue-700 hover:bg-blue-800 border-0 py-1 px-3 focus:outline-none rounded text-base text-white">
                Add Item +
              </button>
            </Link>
            <Link to="/reordered">
              <button className="flex items-center bg-green-700 hover:bg-green-500 border-0 py-1 px-3 focus:outline-none rounded text-base text-white">
                Reordered Items
              </button>
            </Link>
          </div>

          {/* Third Row: Search Input Bar */}
          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-100 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-base px-4 py-2 w-full"
                placeholder="Search items..."
              />
              <FontAwesomeIcon
                icon={faTimes}
                className="absolute right-2 top-2 text-gray-500 text-xl cursor-pointer"
                onClick={handleClearSearch}
              />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
