import { useState } from "react";
import Search from "../assets/images/search.png";

interface TableSearchProps {
  onSearch: (value: string) => void;
  isLoading?: boolean;
}

const TableSearch: React.FC<TableSearchProps> = ({ onSearch, isLoading }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
    >
      <img src={Search} alt="search" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-3 py-1 bg-lamaYellow rounded-full text-xs font-medium hover:bg-yellow-400 disabled:opacity-50"
      >
        {isLoading ? "..." : "Go"}
      </button>
    </form>
  );
};

export default TableSearch;
