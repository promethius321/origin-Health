import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [qry, setQry] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [image, setImage] = useState(null);
  const [label, setLabel] = useState("");
  const toke_n = localStorage.getItem("token");
  const [modalIsOpen, setIsOpen] = useState(false);

  const handleImageChange = (e) => {
    // Handle image selection
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleLabelChange = (e) => {
    // Handle label input
    setLabel(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      // Send formData to the backend using Axios or your preferred HTTP library
      const response = await axios.post(
        "http://127.0.0.1:8000/upload-image",
        {
          image: image,
          label: label,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${toke_n}`,
          },
        }
      );
      setImage(null);
      setLabel("");

      console.log("Image uploaded:", response.data);
      // Handle success or reset form fields
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error
    }
  };
  useEffect(() => {
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
  const handleLogOut = () => {
    localStorage.removeItem(toke_n);
    console.log(toke_n);
    navigate("/");
  };
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
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
            <button
              onClick={openModal}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
            >
              Upload
            </button>
          </ul>
        </div>
      </nav>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal}>close</button>

        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl mb-4 font-semibold">Upload Image</h2>
          <form onSubmit={handleUpload} encType="multipart/form-data">
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="image"
              >
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded-md py-2 px-3 w-full"
                id="image"
                name="image"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="label"
              >
                Label
              </label>
              <input
                type="text"
                onChange={handleLabelChange}
                className="border rounded-md py-2 px-3 w-full"
                id="label"
                name="label"
                value={label}
                placeholder="Enter label"
                required
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="p-6 w-8/12 justify-center ml-28 md:ml-64 sticky top-0">
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

export default Dashboard;
