import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps): React.ReactElement {
  return (
    <div className="relative mb-6 w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search posts by title or content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ border: '1px rgba(119, 119, 119, 1) solid' }}
      />
    </div>
  );
}