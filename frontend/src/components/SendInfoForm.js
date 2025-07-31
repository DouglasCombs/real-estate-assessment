import React, { useState } from "react";
import axios from "axios";

const DEFAULT_MESSAGE = `This message is sent to you from Khooneh Bagh Real Estate.
Please call 09153403199.
Mr. Mir`;
function SendInfoForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: DEFAULT_MESSAGE,
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSent(false);
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/send_sms/", {
        receptor: form.phone,
        message: form.message || undefined,
      });
      if (res.data && res.data.ok) {
        setSent(true);
        setForm({ name: "", phone: "", message: "" });
      } else {
        setError("Failed to send message: " + (res.data && res.data.error ? res.data.error : ""));
      }
    } catch (err) {
      setError("Failed to send message");
    }
  };

  return (
    <form className="bg-gray-800 rounded-xl shadow p-8 max-w-xl mx-auto text-left" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-white">Send Information</h2>
      <div className="mb-4">
        <label className="block mb-1 text-gray-300">Name:</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" required />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-300">Phone Number:</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" required />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-300">Message (you can edit the default message):</label>
        <textarea name="message" value={form.message} onChange={handleChange} className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2" rows={4} required />
      </div>
      <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white rounded px-6 py-2 mt-2 font-bold">
        Send
      </button>
      {sent && <div className="text-green-500 mt-4">Information sent successfully!</div>}
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </form>
  );
}

export default SendInfoForm;
