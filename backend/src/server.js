const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");
const { initDb } = require("./db/init");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());
app.use("/api", routes);

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("DB init failed", err);
    process.exit(1);
  });
