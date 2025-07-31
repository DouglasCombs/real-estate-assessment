import React, { useState } from "react";
import axios from "axios";

function AddHouseForm({ onSuccess }) {
  const [form, setForm] = useState({
    address: "",
    type: "Rent & Lease",
    rooms: "",
    area: "",
    amenities: "",
    deposit: "",
    rental: "",
    whole_price: "",
    price_per_meter: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    setForm((prev) => ({ ...prev, type: e.target.value }));
  };

  const [imgError, setImgError] = useState("");
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setImgError("Maximum 5 images allowed.");
      setForm((prev) => ({ ...prev, images: files.slice(0, 5) }));
    } else {
      setImgError("");
      setForm((prev) => ({ ...prev, images: files }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => data.append("images", file));
      } else {
        data.append(key, value);
      }
    });
    try {
      await axios.post("http://localhost:8000/houses/", data);
      setForm({
        address: "",
        type: "Rent & Lease",
        rooms: "",
        area: "",
        amenities: "",
        deposit: "",
        rental: "",
        whole_price: "",
        price_per_meter: "",
        images: [],
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Error submitting information");
    }
    setLoading(false);
  };

  return (
    <form className="bg-gray-800 rounded-xl shadow p-8 max-w-3xl mx-auto text-left" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Add New Property</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-gray-300">Address:</label>
          <input name="address" value={form.address} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Type:</label>
          <select name="type" value={form.type} onChange={handleTypeChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2">
            <option value="Rent & Lease">Rent & Lease</option>
            <option value="Sale">Sale</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Rooms:</label>
          <input name="rooms" value={form.rooms} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Area (m²):</label>
          <input name="area" value={form.area} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Floor:</label>
          <input name="floor" value={form.floor || ""} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" placeholder="Floor number" />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Amenities (comma separated):</label>
          <input name="amenities" value={form.amenities} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" />
        </div>
        {form.type === "Rent & Lease" ? (
          <>
            <div>
              <label className="block mb-1 text-gray-300">Deposit:</label>
              <input name="deposit" value={form.deposit} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Rent:</label>
              <input name="rental" value={form.rental} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block mb-1 text-gray-300">Total Price:</label>
              <input name="whole_price" value={form.whole_price} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Price per meter:</label>
              <input name="price_per_meter" value={form.price_per_meter} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" />
            </div>
          </>
        )}
        <div className="md:col-span-2">
          <label className="block mb-1 text-gray-300">Images (max 5):</label>
          <input type="file" multiple onChange={handleImageChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" accept="image/*" />
          {imgError && <div className="text-red-500 mt-2">{imgError}</div>}
        </div>
      </div>
      <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white rounded px-6 py-2 mt-6 font-bold w-full" disabled={loading}>
        {loading ? "Submitting..." : "Add Property"}
      </button>
    </form>
  );
}

export default AddHouseForm;
