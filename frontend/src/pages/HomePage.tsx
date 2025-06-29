import React, { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import ReviewSection from "../components/ReviewSection";
import RatingChart from "../components/RatingChart";
import { useApi } from "../hooks/useApi";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  averageRating?: number;
}

interface ProductListResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

const HomePage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Hook pour récupérer les produits
  const { data: productsResponse, callApi: fetchProducts } =
    useApi<ProductListResponse>();

  // Hook pour récupérer la distribution des notes
  const { data: ratingDistribution, callApi: fetchRatingDistribution } =
    useApi<{ rating: number; count: number }[]>();

  // Charger les produits au montage et lors du changement de page
  useEffect(() => {
    fetchProducts(`/products?page=${currentPage}`);
  }, [currentPage]);

  // Mettre à jour le nombre total de pages
  useEffect(() => {
    if (productsResponse) {
      setTotalPages(productsResponse.meta.last_page);
    }
  }, [productsResponse]);

  // Charger la distribution des notes quand un produit est sélectionné
  useEffect(() => {
    if (selectedProduct) {
      fetchRatingDistribution(
        `/products/${selectedProduct.id}/ratings/distribution`
      );
    }
  }, [selectedProduct]);

  // Fonction pour changer de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Nouvelle Hero Section - Design Kickstart */}
        <div className="relative overflow-hidden rounded-[40px] p-10 md:p-16 mb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl">
          {/* Effet de particules */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 100 + 20}px`,
                  height: `${Math.random() * 100 + 20}px`,
                  background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                }}
              ></div>
            ))}
          </div>

          {/* Grille décorative */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>

          {/* Contenu principal */}
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 shadow-lg">
              Nouvelle collection
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                L&apos;expérience ultime
              </span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                de nos produits
              </span>
              <span className="block mt-4 text-xl md:text-2xl font-medium text-gray-300">
                avec notre sélection exclusive de produits innovants
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Découvrez des produits soigneusement conçus pour transformer votre
              expérience numérique
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-xl transform hover:-translate-y-1">
                Explorer la collection
              </button>
              <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 font-bold px-8 py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all border-2 border-gray-700 backdrop-blur-sm">
                Voir les nouveautés
              </button>
            </div>
          </div>

          {/* Éléments décoratifs */}
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-3xl animate-pulse-medium"></div>

          {/* Icônes décoratives */}
          <div className="absolute top-1/4 right-20 w-16 h-16 opacity-20">
            <div className="grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-7 h-7 bg-blue-400 rounded-md"></div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-1/3 left-24 w-12 h-12 opacity-20">
            <div className="grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-purple-400 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Nos Produits</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mt-2"></div>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-lg">
              <span className="text-blue-700 font-medium">
                Page {currentPage} sur {totalPages}
              </span>
            </div>
          </div>

          <ProductList
            products={productsResponse?.data || []}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSelectProduct={setSelectedProduct}
          />
        </div>

        {/* Product Spotlight */}
        {selectedProduct && (
          <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Product Showcase */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-gray-200">
                        <img
                          src={selectedProduct.imageUrl}
                          alt={selectedProduct.title}
                          className="w-48 h-48 object-contain mx-auto"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                            Produit vedette
                          </span>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedProduct.title}
                          </h2>
                        </div>
                        <div className="text-right">
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xl px-4 py-2 rounded-lg">
                            {selectedProduct.price.toLocaleString()} MGA
                          </div>
                          <div className="mt-2 flex justify-end">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-amber-400 text-xl">
                                {i <
                                Math.floor(selectedProduct.averageRating || 0)
                                  ? "★"
                                  : "☆"}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mt-4 mb-6">
                        {selectedProduct.description}
                      </p>

                      <div className="flex gap-3">
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                          Ajouter au panier
                        </button>
                        <button className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:from-gray-200 hover:to-gray-300 transition-all">
                          Favori ♡
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews & Ratings */}
              <div className="space-y-8">
                {/* Reviews Section */}
                <div className="bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Avis des clients
                    </h3>
                    <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold px-4 py-1 rounded-full">
                      {selectedProduct.averageRating?.toFixed(1) || "5.0"}
                    </div>
                  </div>
                  <ReviewSection
                    productId={selectedProduct.id}
                    averageRating={selectedProduct.averageRating || 0}
                  />
                </div>

                {/* Ratings Distribution */}
                <div className="bg-white rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Distribution des notes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      {ratingDistribution ? (
                        <RatingChart data={ratingDistribution} />
                      ) : (
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold mb-4 text-gray-700">
                        Détails des notes
                      </h4>
                      <div className="space-y-3">
                        {ratingDistribution?.map((item) => (
                          <div key={item.rating} className="flex items-center">
                            <span className="w-16 font-medium text-gray-700">
                              {item.rating} ★
                            </span>
                            <div className="flex-1 mx-3">
                              <div className="h-3 rounded-full overflow-hidden bg-gray-200">
                                <div
                                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
                                  style={{
                                    width: `${
                                      (item.count /
                                        (ratingDistribution.reduce(
                                          (sum, r) => sum + r.count,
                                          0
                                        ) || 1)) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <span className="w-10 text-right font-bold text-blue-600">
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">
                            Total des avis:
                          </span>
                          <span className="font-bold text-blue-600">
                            {ratingDistribution?.reduce(
                              (sum, r) => sum + r.count,
                              0
                            ) || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-10 text-center mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://assets.codepen.io/939494/dot-pattern.svg')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Prêt à vivre une expérience exceptionnelle ?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Rejoignez des milliers de clients satisfaits dès aujourd&apos;hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-1">
                Découvrir la collection
              </button>
              <button className="bg-blue-700/50 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 border-2 border-white/30 backdrop-blur-sm">
                Contactez-nous
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
