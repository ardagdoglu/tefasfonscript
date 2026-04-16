const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/tefas/:fon", async (req, res) => {
  const fon = req.params.fon;

  try {
    const response = await fetch("https://www.tefas.gov.tr/api/DB/BindHistoryInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Origin": "https://www.tefas.gov.tr",
        "Referer": "https://www.tefas.gov.tr/"
      },
      body: JSON.stringify({
        fontip: "YAT",
        fonkod: fon,
        bastarih: "01.01.2000",
        bittarih: new Date().toLocaleDateString("tr-TR")
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (e) {
    res.status(500).json({ error: "çekilemedi" });
  }
});

app.listen(3000, () => console.log("server çalışıyor"));
