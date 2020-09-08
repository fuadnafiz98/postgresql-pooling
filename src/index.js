require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { Pool, Client } = require("pg");

async function long() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  await client.connect();
  // const results = await client.query(
  //   "select * from pg_catalog.pg_tables where schemaname != 'pg_catalog' and schemaname != 'information_schema'"
  // );
  const results = await client.query("select * from pg_catalog.pg_tables");
  // console.log(results.rows);
  client.end();
}

async function pooling() {
  console.log("pool");
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 40,
  });
  const client = await pool.connect();
  const results = await client.query("select * from pg_catalog.pg_tables");
  client.release(true);
}

const app = express();
app.use(cors());

let longs = 1;
let longtime = 0;
app.get("/long", async (req, res) => {
  longs++;
  const start = new Date();
  await long();
  const end = new Date();
  longtime += end - start;
  res.json({
    avg: end - start,
    calc: longtime / longs,
  });
});

let pools = 1;
let pooltime = 0;
app.get("/pool", async (req, res) => {
  pools++;
  const start = new Date();
  await pooling();
  const end = new Date();
  pooltime += end - start;
  res.json({
    avg: end - start,
    calc: pooltime / pools,
  });
});

app.listen(process.env.PORT, () =>
  console.log(`server running on ${process.env.DB_HOST}://${process.env.PORT}`)
);
