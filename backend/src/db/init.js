const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../../data.sqlite");
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function initDb() {
  await run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, token TEXT)");
  await run("CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY, title TEXT, type TEXT, amount REAL, created_at TEXT)");
  await run(`CREATE TABLE IF NOT EXISTS card_accounts (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'inactive',
    issue_fee_usd REAL NOT NULL DEFAULT 5,
    created_at TEXT NOT NULL
  )`);
  await run(`CREATE TABLE IF NOT EXISTS account_wallets (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    network TEXT NOT NULL,
    address TEXT NOT NULL,
    provider TEXT,
    created_at TEXT NOT NULL,
    UNIQUE(network, address),
    FOREIGN KEY(account_id) REFERENCES card_accounts(id)
  )`);
  await run(`CREATE TABLE IF NOT EXISTS wallet_challenges (
    id TEXT PRIMARY KEY,
    network TEXT NOT NULL,
    address TEXT NOT NULL,
    nonce TEXT NOT NULL,
    message TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT
  )`);
  await run(`CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY(account_id) REFERENCES card_accounts(id)
  )`);

  const existing = await all("SELECT id FROM transactions LIMIT 1");
  if (!existing.length) {
    await run("INSERT INTO transactions (title, type, amount, created_at) VALUES (?, ?, ?, ?)", ["Deposit confirmed", "deposit", 150, new Date().toISOString()]);
    await run("INSERT INTO transactions (title, type, amount, created_at) VALUES (?, ?, ?, ?)", ["Card purchase", "withdrawal", -42.5, new Date(Date.now() - 1000 * 60 * 15).toISOString()]);
  }
}

module.exports = { db, initDb, all, get, run };
