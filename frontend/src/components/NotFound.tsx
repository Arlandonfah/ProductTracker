import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">
          404
        </h1>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-lg"></div>
          <div className="relative bg-white px-4 py-10 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Page non trouvée
            </h2>
            {/* Correction ici : n'existe → n&apos;existe */}
            <p className="text-gray-600 mb-8">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été
              déplacée.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md shadow hover:from-indigo-700 hover:to-purple-700 transition duration-300"
            >
              {/* Correction ici : l'accueil → l&apos;accueil */}
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
