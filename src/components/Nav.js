import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Nav() {
  return (
    <div>
      <header className="text-gray-600 body-font border-2">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <div className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
            <Link to="/">
              <span className="ml-3 text-3xl bg-blue-600 p-2 focus:outline-none rounded-md">Studio-10</span>
            </Link>
            <FontAwesomeIcon icon={faSearch} className="ml-4 text-gray-500 text-xl cursor-pointer" />
          </div>
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
            <Link to="/login">
              <button className="inline-flex items-center bg-slate-700 hover:bg-slate-500 border-0 py-1 px-3 focus:outline-none rounded text-base text-white">
                Login
              </button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
