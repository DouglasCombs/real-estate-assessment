
import React, { useEffect, useState } from "react";
// ...existing code...
import axios from "axios";
import HouseCard from "./components/HouseCard";
import Pagination from "./components/Pagination";
import AddHouseForm from "./components/AddHouseForm";
import SendInfoForm from "./components/SendInfoForm";
import DetailsModal from "./components/DetailsModal";

function App() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("All");
  const [houses, setHouses] = useState([]);
  const [solded, setSolded] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [activePage, setActivePage] = useState("list");
  const [search, setSearch] = useState("");
  const pageSize = 6;

  const fetchHouses = () => {
    axios
      .get(`http://localhost:8000/houses/?skip=${(page - 1) * pageSize}&limit=${pageSize}&type=${type}`)
      .then((res) => setHouses(res.data));
  };

  const fetchSolded = () => {
    axios.get("http://localhost:8000/houses/solded/").then(res => setSolded(res.data));
  };

  useEffect(() => {
    if (activePage === "list") fetchHouses();
    if (activePage === "solded") fetchSolded();
  }, [page, type, activePage]);

  const handleDetails = (house) => {
    setSelectedHouse(house);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedHouse(null);
  };

  const handleMarkSolded = (houseId) => {
    axios.post(`http://localhost:8000/houses/${houseId}/solded`).then(() => {
      fetchHouses();
      fetchSolded();
      setShowModal(false);
    });
  };

  // Filter homes client-side based on search and hide solded
  const filteredHouses = houses.filter(house => {
    if (house.solded) return false;
    const s = search.trim();
    if (!s) return true;
    const addr = house.address || "";
    const price = (house.whole_price || "") + " " + (house.deposit || "") + " " + (house.rental || "");
    const amenities = house.amenities || "";
    const area = String(house.area || "");
    return (
      addr.includes(s) ||
      price.includes(s) ||
      amenities.includes(s) ||
      area.includes(s)
    );
  });

  // Callback to refetch lists after delete
  const handleHouseDeleted = () => {
    fetchHouses();
    fetchSolded();
    setShowModal(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-left font-sans" dir="ltr">
      <div className="flex">
        {/* Right-side menu */}
        <aside className="w-56 bg-gray-800 text-white p-6 min-h-screen">
          <h2 className="text-xl font-bold mb-6">Real Estate assessment</h2>
          <ul className="space-y-4">
            <li className={`cursor-pointer ${activePage === "add" ? "font-bold text-green-400" : ""}`} onClick={() => setActivePage("add")}>Add New Property</li>
            <li className={`cursor-pointer ${activePage === "list" ? "font-bold text-blue-400" : ""}`} onClick={() => setActivePage("list")}>Property List</li>
            <li className={`cursor-pointer ${activePage === "solded" ? "font-bold text-blue-400" : ""}`} onClick={() => setActivePage("solded")}>Sold/Rented Properties</li>
            <li className={`cursor-pointer ${activePage === "send" ? "font-bold text-blue-400" : ""}`} onClick={() => setActivePage("send")}>Send Information</li>
          </ul>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-8">
          {activePage === "add" && (
            <AddHouseForm onSuccess={fetchHouses} />
          )}
          {activePage === "send" && (
            <SendInfoForm />
          )}
          {activePage === "list" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Property List</h1>
                <select
                  className="bg-gray-700 text-white rounded px-3 py-2"
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                >
                  <option value="All">All</option>
                  <option value="Rent & Lease">Rent & Lease</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Search by address, price, or amenities..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredHouses.map((house) => (
                  <HouseCard key={house.id} house={house} onDetails={handleDetails} onMarkSolded={handleMarkSolded} />
                ))}
              </div>
              <Pagination page={page} setPage={setPage} hasNext={filteredHouses.length === pageSize} />
              <DetailsModal house={showModal ? selectedHouse : null} onClose={handleModalClose} onMarkSolded={handleMarkSolded} onHouseDeleted={handleHouseDeleted} />
            </>
          )}
          {activePage === "solded" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Sold/Rented Properties</h1>
              </div>
              <SoldedList solded={solded} pageSize={pageSize} onHouseDeleted={handleHouseDeleted} />
            </>
          )}
        </main>
      </div>
    </div>
  );
// SoldedList component for paginated solded houses
function SoldedList({ solded, pageSize, onHouseDeleted }) {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const paged = solded.slice((page - 1) * pageSize, page * pageSize);
  const handleDetails = (house) => {
    setSelectedHouse(house);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedHouse(null);
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paged.map((house) => (
          <HouseCard key={house.id} house={house} onDetails={handleDetails} solded />
        ))}
      </div>
      <Pagination page={page} setPage={setPage} hasNext={solded.length > page * pageSize} />
      <DetailsModal house={showModal ? selectedHouse : null} onClose={handleModalClose} onMarkSolded={() => {}} onHouseDeleted={onHouseDeleted} />
    </>
  );
}
}

export default App;
