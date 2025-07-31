import React, { useState } from "react";

function formatPrice(val) {
  if (!val) return "-";
  let num = parseInt(val.replace(/[^\d]/g, ""));
  if (isNaN(num)) return val + " Toman";
  if (num >= 1000000) return (num / 1000000).toLocaleString() + " million Toman";
  return num.toLocaleString() + " Toman";
}

function DetailsModal({ house, onClose, onMarkSolded, onHouseDeleted }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  if (!house) return null;
  const images = house.images || [];
  const showPrev = imgIdx > 0;
  const showNext = imgIdx < images.length - 1;
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:8000/houses/${house.id}`, { method: "DELETE" });
      if (typeof onHouseDeleted === "function") onHouseDeleted();
      if (typeof onClose === "function") onClose();
    } 
    catch (e) {
      // alert("Error deleting property");
    }
    setDeleting(false);
  };
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-16 max-w-5xl w-full relative">
        <button className="absolute left-4 top-4 text-blue-700 text-3xl font-bold" onClick={onClose}>✕</button>
        <h2 className="text-3xl font-bold mb-8 text-blue-700">Property Details</h2>
        {images.length > 0 && (
          <div className="flex justify-center items-center mb-8 relative">
            {showPrev && (
              <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow" onClick={() => setImgIdx(imgIdx - 1)}>&lt;</button>
            )}
            <img src={`http://localhost:8000/${images[imgIdx]}`} alt="House" className="w-[520px] h-[320px] object-cover rounded-xl shadow" />
            {showNext && (
              <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow" onClick={() => setImgIdx(imgIdx + 1)}>&gt;</button>
            )}
          </div>
        )}
        <div className="mb-2 text-lg text-gray-800"><b>Address:</b> {house.address}</div>
        <div className="mb-2 text-lg text-gray-800"><b>Type:</b> {house.type === "رهن و اجاره" ? "Rent & Lease" : house.type}</div>
        <div className="mb-2 text-lg text-gray-800"><b>Rooms:</b> {house.rooms}</div>
        <div className="mb-2 text-lg text-gray-800"><b>Area:</b> {house.area} m²</div>
        <div className="mb-2 text-lg text-gray-800"><b>Floor:</b> {house.floor ? house.floor : "-"}</div>
        <div className="mb-2 text-lg text-gray-800"><b>Amenities:</b> {house.amenities}</div>
        <div className="mb-2 text-lg text-blue-700 font-bold">
          {house.type === "رهن و اجاره"
            ? <span><b>Deposit:</b> {formatPrice(house.deposit)} | <b>Rent:</b> {formatPrice(house.rental)}</span>
            : <span><b>Total Price:</b> {formatPrice(house.whole_price)} | <b>Price per meter:</b> {formatPrice(house.price_per_meter)}</span>}
        </div>
        <div className="flex gap-4 mt-8">
          {!house.solded && (
            <button className="bg-green-600 text-white rounded px-6 py-2 font-bold" onClick={() => onMarkSolded(house.id)}>
              Mark as Sold/Rented
            </button>
          )}
          <button className="bg-red-600 text-white rounded px-6 py-2 font-bold" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Property"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;
