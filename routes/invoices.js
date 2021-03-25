const express = require("express");
const { NotFoundError } = require("../expressError");

const db = require("../db.js");
const router = new express.Router();

router.get("/", async function (req, res, next) {
  const results = await db.query(
    `SELECT id, comp_code, amt, paid, add_date, paid_date 
        FROM invoices`
  );

  const invoices = results.rows;
  return res.json({ invoices });
});

router.get("/:id", async function (req, res, next) {
  let id = req.params.id;

  const results = await db.query(
    `SELECT 
            id, amt, paid, add_date, paid_date, comp_code
            FROM invoices
            WHERE id = $1`,
    [id]
  );

  const invoicesResults = results.rows[0];

  if (!invoicesResults) {
    throw new NotFoundError();
  }

  let code = invoicesResults.comp_code;

  const compResults = await db.query(
    `SELECT code, name, description
            FROM companies
            WHERE code = $1`,
    [code]
  );

  const companiesResults = compResults.rows[0];

  invoicesResults.company = companiesResults;
  return res.json({ invoice: invoicesResults });
});

router.post("/", async function (req, res, next) {
  const { comp_code, amt } = req.body;

  const result = await db.query(
    `INSERT INTO invoices (comp_code, amt)
        VALUES ($1, $2)
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
    [comp_code, amt]
  );

  const invoice = result.rows[0];

  return res.status(201).json({ invoice });
});

router.put("/:id", async function (req, res, next) {
  const { amt } = req.body;
  const id = req.params.id;

  const result = await db.query(
    `UPDATE invoices
            SET amt=$1
            WHERE id=$2
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
    [amt, id]
  );

  const invoice = result.rows[0];

  if (!invoice) {
    throw new NotFoundError();
  }
  return res.json({ invoice });
});

router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;

  const results = await db.query(
    `DELETE
            FROM invoices
            WHERE id = $1`,
    [id]
  );

  if (!results.rowCount) {
    throw new NotFoundError();
  }
  return res.json({ status: "deleted" });
});

module.exports = router;
