interface SearchbarProps {
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export const SearchbarTemplate = ({ placeholder, value, onChange }: SearchbarProps) => {
    return (
      <div className="w-full flex flex-col sm:flex-col md:flex-row gap-4 items-center justify-between px-4 md:px-12 py-4 bg-gray-50 dark:bg-[#151515]">
  
        {/* Search + Button */}
        <div className="w-full md:w-1/2 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full sm:w-2/3 py-2 px-3 rounded-sm bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm"
          />
          <button className="w-full sm:w-auto px-4 py-2 bg-black text-white text-sm font-semibold rounded-sm dark:bg-white dark:text-black transition">
            Search
          </button>
        </div>
  
        {/* Sort */}
        <div className="w-full md:w-auto flex items-center justify-end gap-3 text-sm">
          <label htmlFor="sort" className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            name="sort"
            className="w-1/4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition text-black"
            defaultValue="latest"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>
    );
  };
  