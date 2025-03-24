import { useState } from "react";
import { Search } from "lucide-react"

function SearchBar({ setProducts, setSearchTerm }) {
    const [searchQuery, setSearchQuery] = useState("")

    const searchParams = {q: searchQuery};
      
    const queryString = new URLSearchParams(searchParams).toString();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/search?${queryString}` );
        const jsonResponse = await response.json();
        setProducts(jsonResponse.data);
        setSearchQuery("");
        setSearchTerm(jsonResponse.searchTerm);
    };
    
    const handleKeyDown = (event) => {
        if(searchQuery.trim().length > 0 && event.key === 'Enter'){
            handleSubmit(event);
        }
    };

    const handleForm = (e) => {
        e.preventDefault();
        handleKeyDown();
    }

    return (
        <div className="relative">
            <form onSubmit={handleForm}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search products title or SKU"
                    className="pl-10 mr-4 py-2 border rounded-lg w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown} 
                />
            </form>
        </div>
    );
}

export default SearchBar;