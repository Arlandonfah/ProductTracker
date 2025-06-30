module.exports = {
  devServer: {
    historyApiFallback: {
      // Redirige toutes les routes vers index.html
      rewrites: [
        { from: /^\/admin/, to: "/index.html" },
        { from: /./, to: "/index.html" },
      ],
    },
    // Configuration supplémentaire pour éviter les problèmes de CORS
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
};
