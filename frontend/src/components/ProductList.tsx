import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../store/productSlice";

interface ProductListProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectProduct: (product: Product) => void;
  adminMode?: boolean;
  onDelete?: (id: number) => void;
}

const ProductList = ({
  products,
  currentPage,
  totalPages,
  onPageChange,
  onSelectProduct,
  adminMode = false,
  onDelete,
}: ProductListProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg card-shadow transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className="cursor-pointer"
              onClick={() => onSelectProduct(product)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-indigo-600">
                    {product.price.toLocaleString()} MGA
                  </span>
                  {product.averageRating && (
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="font-medium">
                        {product.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {adminMode && onDelete && (
              <div className="px-6 pb-4">
                <button
                  onClick={() => onDelete(product.id)}
                  className="w-full py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductList; // Export par défaut ajouté ici
