import React, { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import AuthModal from "../components/AuthModal";
import { useApi, useAdminAuth } from "../hooks/useApi";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

const AdminPage = () => {
  
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data: products, callApi: fetchProducts } = useApi<{
    data: Product[];
    meta: { total: number; last_page: number };
  }>();

  const { callApi: deleteProduct } = useApi();
  const { login, loading: authLoading, error: authError } = useAdminAuth();

  // Vérifier l'authentification au montage
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
      setShowAuthModal(false);
      loadProducts(1);
    }
  }, []);

  const loadProducts = async (page: number) => {
    const response = await fetchProducts(`/api/products?page=${page}`);
    if (response) {
      setCurrentPage(page);
      setTotalPages(response.meta.last_page);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password);
    if (result?.token) {
      setIsAuthenticated(true);
      setShowAuthModal(false);
      loadProducts(1);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
      const result = await deleteProduct(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (result !== null) {
        loadProducts(currentPage); // Rafraîchir la liste
      }
    }
  };

  const handlePageChange = (page: number) => {
    loadProducts(page);
  };

  const handleSelectProduct = (product: Product) => {
    // Implémentez cette fonction si nécessaire
    console.log("Produit sélectionné:", product);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setShowAuthModal(true);
  };

  if (!isAuthenticated) {
    return (
      <AuthModal
        show={showAuthModal}
        onLogin={handleLogin}
        loading={authLoading}
        error={authError}
        onClose={() => setShowAuthModal(false)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Administration des Produits</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? "Annuler" : "Ajouter un Produit"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-12">
          <ProductForm
            onSuccess={() => {
              setShowForm(false);
              loadProducts(currentPage);
            }}
          />
        </div>
      )}

      {products && (
        <ProductList
          products={products.data || []}
          adminMode={true}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSelectProduct={handleSelectProduct}
        />
      )}
    </div>
  );
};

export default AdminPage;
