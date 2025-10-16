import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "@/components/organisms/ProductCard";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import PriceFilter from "@/components/molecules/PriceFilter";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getProducts, getCategories } from "@/services/api/productService";

const ProductGrid = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Update filters based on URL params
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    setSelectedCategory(category);
    setSearchQuery(search);
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const handleClearFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 100000]);
    navigate("/");
  };

  if (loading) return <Loading type="products" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const hasActiveFilters = selectedCategory || searchQuery || priceRange[0] > 0 || priceRange[1] < 100000;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-4">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border w-full justify-between"
            >
              <span className="flex items-center space-x-2">
                <ApperIcon name="Filter" size={20} />
                <span>Filters</span>
              </span>
              <ApperIcon name={showFilters ? "ChevronUp" : "ChevronDown"} size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
            {hasActiveFilters && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <button
                  onClick={handleClearFilters}
                  className="flex items-center space-x-2 text-primary hover:text-accent transition-colors"
                >
                  <ApperIcon name="X" size={16} />
                  <span className="text-sm font-medium">Clear All Filters</span>
                </button>
              </div>
            )}
            
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            <PriceFilter
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : 
                 selectedCategory ? selectedCategory : "All Products"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <Empty
              title="No products found"
              message={hasActiveFilters ? 
                "Try adjusting your filters to see more results" : 
                "No products are currently available"
              }
              actionText="Clear Filters"
              onAction={hasActiveFilters ? handleClearFilters : undefined}
              icon="Package"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.Id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;