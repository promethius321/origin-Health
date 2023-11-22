import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";
const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [qry, setQry] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const toke_n = localStorage.getItem("token");
  useEffect(() => {
    console.log(toke_n);
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${toke_n}`,
            // Other headers if needed
          },
        };
        const response = await axios.get(
          `http://127.0.0.1:8000/view-image?page=${currentPage}`,
          config
        );
        console.log(response.data);
        setData(response.data);
        setTotalPages(4);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/search-view?search=${qry}`
      ); // Replace '/api/search' with your search endpoint
      console.log(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (qry.length > 0) {
      handleSearch(); // Perform search when form is submitted
    } else {
      setSearchResults(data);
      console.log(searchResults, "searchresults"); // If search term is empty, show all data
    }
    // Perform search when form is submitted
  };
  const handleLogOut = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${toke_n}`,
          // Other headers if needed
        },
      };
      const response = await axios.post(
        `http://127.0.0.1:8000/logout-view`,
        null,
        config
      );
      if (response.status === 200) {
        navigate("/");
        // Handle successful logout, such as redirecting to the login page
        console.log("Logged out successfully");
        // Redirect the user to the login page or perform any other action
      } else {
        // Handle unsuccessful logout
        console.error("Logout failed");
      }
    } catch (error) {
      console.log(error);
    }
    // localStorage.removeItem(toke_n);
    // console.log(toke_n);
  };
  return (
    <div className="">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="#" className="text-white text-2xl font-bold">
            Origin Health
          </a>

          <ul className="flex space-x-4">
            <button
              onClick={handleLogOut}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </ul>
        </div>
      </nav>

      <div className="p-6 w-8/12 justify-center ml-28 md:ml-64">
        <form
          onSubmit={handleSubmit}
          className="flex items-center border border-gray-300 rounded-lg shadow-md"
        >
          <input
            type="text"
            placeholder="Search..."
            value={qry}
            onChange={(e) => setQry(e.target.value)}
            className="py-2 px-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 flex-grow"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-r-lg transition duration-300"
          >
            Search
          </button>
        </form>
      </div>

      <div className=" flex flex-wrap gap-10 justify-center md:ml-16 mb-10 mt-10">
        {searchResults.length > 0 ? (
          <>
            {searchResults.map((item) => (
              <div
                key={item.id}
                className=" sm:w-6/12 md:w-3/12 h-60  border-3 bg-slate-400 rounded-md shadow-lg cursor-pointer"
              >
                <h2 className=" text-center font-medium text-white">
                  {item.label}
                </h2>
                <LazyLoadImage
                  src={item.image}
                  alt={item.label}
                  effect="blur"
                  className=" object-cover h-60 w-96 rounded-sm "
                />
              </div>
            ))}
          </>
        ) : (
          <>
            {data.map((item) => (
              <div
                key={item.id}
                className=" sm:w-6/12 md:w-3/12 h-60  border-3 bg-slate-400 rounded-md shadow-lg cursor-pointer"
              >
                <h2 className=" text-center font-medium text-white">
                  {item.label}
                </h2>
                <LazyLoadImage
                  src={`http://127.0.0.1:8000${item.image}`}
                  alt={item.label}
                  effect="blur"
                  className=" object-cover h-60 w-96 rounded-sm"
                />
              </div>
            ))}
          </>
        )}
      </div>
      <div className="flex ml-[500px] w-3/12 justify-around  items-center mt-8 mb-10">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`py-2 px-4 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold`}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`py-2 px-4 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
