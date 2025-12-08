"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, X, Save } from "lucide-react";
import { addCategory, getCategories } from "../../api/category";

export default function CategoryDetails() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategories();
      console.log("API Response:", response);

      let categoriesArray = [];
      if (response && Array.isArray(response.categories)) {
        categoriesArray = response.categories || [];
      } else if (response && Array.isArray(response.data)) {
        categoriesArray = response.data || [];
      } else if (Array.isArray(response)) {
        categoriesArray = response || [];
      } else {
        console.error("Unexpected response format:", response);
        categoriesArray = [];
      }

      const sortedCategories = categoriesArray.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setCategories(sortedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories
    .filter((category) => {
      if (!category || typeof category !== "object") return false;

      const searchTerm = searchQuery.toLowerCase();
      const categoryName = category?.name?.toLowerCase() || "";
      const categoryDescription = category?.description?.toLowerCase() || "";

      return (
        categoryName.includes(searchTerm) ||
        categoryDescription.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const currentPageCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await addCategory({
        name: formData.name,
        description: formData.description || "",
      });

      console.log("Add category response:", response);

      await fetchCategories();

      setFormData({ name: "", description: "" });
      setIsAddModalOpen(false);
      alert("Category added successfully!");
    } catch (err) {
      console.error("Error adding category:", err);
      alert(`Failed to add category: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({ name: "", description: "" });
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setFormData({ name: "", description: "" });
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A" || dateString === "Invalid Date") {
      return "N/A";
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const validCategories = currentPageCategories.filter(
    (category) =>
      category &&
      typeof category === "object" &&
      category.name &&
      typeof category.name === "string" &&
      category.name.trim() !== ""
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mb-2">
              Category Details
            </h1>
            <p className="text-slate-600">
              Manage event categories and their details
            </p>
          </div>
          <button
            onClick={openAddModal}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary/90 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-3 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search categories..."
                className="text-black w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading && categories.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-slate-500">Loading categories...</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {validCategories.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        No categories found.{" "}
                        {searchQuery && "Try a different search."}
                      </td>
                    </tr>
                  ) : (
                    validCategories.map((category) => (
                      <tr
                        key={category._id || category.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-700 font-medium">
                          {category.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {category.description || "-"}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(category.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredCategories.length > itemsPerPage && (
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
                Add New Category
              </h2>
              <button
                onClick={closeModal}
                disabled={loading}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border text-black border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent disabled:opacity-50"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border text-black border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent disabled:opacity-50"
                    placeholder="Enter category description"
                    rows="3"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={closeModal}
                disabled={loading}
                className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-primary/90 text-white font-semibold rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} />
                    Save Category
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
