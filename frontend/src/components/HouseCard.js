import React from "react";

function HouseCard({ house, onDetails, solded }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow p-6 flex flex-col md:flex-row items-center overflow-hidden">
      <div className="w-56 h-36 flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
        {house.images && house.images.length > 0 ? (
          <img
            src={`http://localhost:8000/${house.images[house.images.length-1]}`}
            alt="House"
            className="object-cover w-full h-full rounded-lg"
            style={{maxWidth: '100%', maxHeight: '100%'}}
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>
      <div className="flex-1 min-w-0">

        <div className="text-lg font-bold mb-2 text-white truncate">{house.address}</div>
        <div className="mb-2 text-gray-300 truncate">Type: {house.type === "Rent & Lease" ? "Rent & Lease" : (house.type === "Sale" ? "Sale" : house.type)}</div>
        <div className="mb-2 text-gray-300 truncate">Rooms: {house.rooms} | Area: {house.area} m² | Floor: {house.floor ? house.floor : "-"}</div>
        <div className="mb-2 text-blue-400 font-bold truncate">
          {house.type === "Rent & Lease"
            ? `Deposit: ${house.deposit} | Rent: ${house.rental}`
            : `Total Price: ${house.whole_price} | Price per meter: ${house.price_per_meter}`}
        </div>
        <div className="mb-2 text-gray-400 truncate">Amenities: {house.amenities}</div>
        { (solded !== undefined && solded !== null && solded !== false) && (
          <div className="text-green-500 font-bold mb-2">Sold</div>
        )  }
        <button className="bg-blue-700 text-white rounded px-4 py-2 mt-2 font-bold" onClick={() => onDetails(house)}>
          Details
        </button>
          
      
      </div>
    </div>
  );
}

export default HouseCard;
