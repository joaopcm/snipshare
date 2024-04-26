module.exports = function expressMiddleware(router) {
  router.use((req, res, next) => {
    res.set("Cross-Origin-Embedder-Policy", "require-corp");
    res.set("Cross-Origin-Opener-Policy", "same-origin");
    next();
  });
};
