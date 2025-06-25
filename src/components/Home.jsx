import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
      <div className="text-center p-10">
        <h1 className="text-4xl font-bold mt-6 text-gray-800 dark:text-gray-200">Knowledge Packs</h1>
        <p className="text-xl mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Welcome to the Knowledge Packs portal. Here you can find curated information and resources on various topics. Use the assistant to ask questions or browse the available packs.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/repository" className="bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-600 transition-colors">
            Repository
          </Link>
          <Link to="/assistant" className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Use Assistant
          </Link>
        </div>
      </div>
    );
} 