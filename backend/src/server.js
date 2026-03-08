require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3334;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
