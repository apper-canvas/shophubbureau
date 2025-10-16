import React from "react";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
      <div className="space-y-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="category"
            checked={selectedCategory === ""}
            onChange={() => onCategoryChange("")}
            className="text-primary focus:ring-primary"
          />
          <span className="ml-2 text-sm">All Categories</span>
        </label>
        {categories.map((category) => (
          <label key={category.Id} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === category.name}
              onChange={() => onCategoryChange(category.name)}
              className="text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm">{category.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;