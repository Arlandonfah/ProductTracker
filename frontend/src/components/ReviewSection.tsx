import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";

interface ReviewSectionProps {
  productId: number;
  averageRating: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

const ReviewSection = ({ productId, averageRating }: ReviewSectionProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: reviews, callApi: fetchReviews } = useApi<Review[]>();
  const { callApi: addReview, loading } = useApi();

  useEffect(() => {
    fetchReviews(
      `/products/${productId}/reviews?sort=${sortBy}&search=${searchTerm}`
    );
  }, [productId, sortBy, searchTerm, fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      await addReview(`/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, rating, comment }),
      });

      setRating(0);
      setComment("");
      fetchReviews(
        `/products/${productId}/reviews?sort=${sortBy}&search=${searchTerm}`
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-bold mr-4">Avis</h2>
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-2">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">
                {i < Math.floor(averageRating) ? "★" : "☆"}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-bold mb-2">Ajouter un avis</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
                aria-label={`Noter ${star} étoile${star > 1 ? "s" : ""}`}
              >
                {star <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Votre commentaire..."
            className="w-full p-2 border rounded mb-2"
            rows={3}
            required
          />

          <button
            type="submit"
            disabled={rating === 0 || loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? "Envoi..." : "Soumettre"}
          </button>
        </form>
      </div>

      <div className="flex justify-between mb-4">
        <div>
          <label className="mr-2">Trier par:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="newest">Plus récent</option>
            <option value="highest">Note haute</option>
            <option value="lowest">Note basse</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher dans les avis..."
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      {reviews?.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Aucun avis disponible pour ce produit
        </p>
      ) : (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex mb-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }
                  >
                    {i < review.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <p className="text-gray-500 text-sm">
                {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;