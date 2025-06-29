import React, { useState, useRef } from "react";
import { useApi } from "../hooks/useApi";

interface ProductFormProps {
  onSuccess: () => void;
}

const ProductForm = ({ onSuccess }: ProductFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { callApi, loading } = useApi();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    if (!file.type.match("image.*")) {
      setError("Seules les images sont autorisées (JPEG, PNG)");
      return;
    }

    // Prévisualisation de l'image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileInputRef.current?.files?.[0]) {
      setError("Veuillez sélectionner une image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", fileInputRef.current.files[0]);

    const response = await callApi("/products", {
      method: "POST",
      body: formData,
      headers: {}, // Important: Pas de Content-Type pour FormData
    });

    if (response) {
      // Réinitialiser le formulaire après succès
      setTitle("");
      setDescription("");
      setPrice("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSuccess();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Ajouter un nouveau produit</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Image du produit</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          Cliquez pour télécharger
                        </span>{" "}
                        ou glisser-déposer
                      </p>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG (MAX. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Titre du produit</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Nom du produit"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Description détaillée du produit"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Prix (MGA)</label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border rounded-md"
                  placeholder="Prix en Ariary"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="absolute left-3 top-2.5 text-gray-500">
                  MGA
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Enregistrement..." : "Ajouter le produit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
