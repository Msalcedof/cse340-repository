function handleErrors(err, req, res, next) {
  console.error("Error at:", req.originalUrl);
  console.error(err.stack);

  const nav = req.nav || ""; // fallback if nav isn't available
  res.status(500).render("errors/error", {
    title: "Server Error",
    message: "Something went wrong on our end.",
    nav,
  });
}

module.exports = handleErrors;
