import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <div>
      <header className="text-gray-600 body-font border-2">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <div className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
            <Link to="/"><span className="ml-3 text-3xl bg-blue-600 p-2 focus:outline-none rounded-md">Studio-10</span></Link>
          </div>
          <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
            <div className="relative">
              <input type="text" className="bg-gray-100 rounded border border-gray-300 focus:outline-none focus:border-indigo-500 text-base px-4 py-2 mx-3" placeholder="Search..." />
            </div>
            
          </nav>
          <div className="flex flex-wrap md:flex-nowrap items-center mt-4 md:mt-0 space-x-2 md:space-x-4">
            <button className="inline-flex items-center bg-slate-200 hover:bg-slate-400 border-0 py-1 px-3 focus:outline-none rounded text-base text-black">
              Filter
            </button>
            <Link to="/add"><button className="inline-flex items-center bg-blue-700 hover:bg-blue-800 border-0 py-1 px-3 focus:outline-none rounded text-base text-white">
              Add Item +
            </button></Link>
          </div>
        </div>
      </header>
    </div>
  );
}
