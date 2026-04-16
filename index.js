const express = require("express");
const fetch = require("node-fetch");

const app = express();

// health check
app.get("/", (req, res) => {
  res.send("ok");
});

// TEFAS CSV proxy
app.get("/tefas/:fon", async (req, res) => {
  const fon = req.params.fon;

  try {
    const response = await fetch(
      `https://www.tefas.gov.tr/ExportHistory.aspx?type=csv&code=${fon}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const text = await response.text();

    // block kontrol
    if (text.includes("<html")) {
      return res.status(500).json({ error: "TEFAS blockladı" });
    }

    // CSV parse
    const rows = text.trim().split("\n");

    // son satır (en güncel veri)
    const lastRow = rows[rows.length - 1].split(";");

    const tarih = lastRow[0];
    const fiyat = lastRow[1];

    res.json({
      fon: fon,
      tarih: tarih,
      fiyat: fiyat
    });

  } catch (e) {
    res.status(500).json({ error: "çekilemedi" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server çalışıyor"));
