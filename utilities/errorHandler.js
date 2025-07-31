function handleErrors(err, req, res, next) {
  const url = req?.originalUrl || "[unknown route]";
  console.error("Error at:", url);
  console.error(err.stack);

  const nav = req?.nav || ""; // safe fallback
  res.status(500).render("errors/error", {
    title: "Server Error",
    message: "Something went wrong on our end.",
    nav,
  });
}

module.exports = handleErrors;
