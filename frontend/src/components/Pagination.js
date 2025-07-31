import React from "react";

function Pagination({ page, setPage, hasNext }) {
  return (
    <div className="flex justify-center mt-8 space-x-4 space-x-reverse">
      <button
        className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      <span className="text-white px-4 py-2">Page {page}</span>
      <button
        className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={() => setPage((p) => p + 1)}
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
