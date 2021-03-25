const express = require("express");
const { NotFoundError } = require("../expressError");

const db = require("../db.js");
const router = new express.Router();

router.get("/", async function (req, res, next) {
  const results = await db.query(
    `SELECT code, name description 
    FROM companies`
  );
  const companies = results.rows;
  return res.json({ companies });
});

router.get("/:code", async function (req, res, next) {
  const code = req.params.code;

  const compResults = await db.query(
    `SELECT code, name, description
    FROM companies
    WHERE code=$1`,
    [code]
  );

  const company = compResults.rows[0];

  if (!company) {
    throw new NotFoundError();
  }

  const invResults = await db.query(
    `SELECT id, comp_code, amt, paid, add_date, paid_date
    FROM invoices
    WHERE comp_code =$1`,
    [code]
  );
  const invoices = invResults.rows;

  company.invoices = invoices;

  return res.json({ company });
});

router.post("/", async function (req, res, next) {
  const { code, name, description } = req.body;

  const result = await db.query(
    `INSERT INTO companies (code, name, description)
      VALUES ($1, $2, $3)
      RETURNING code, name, description`,
    [code, name, description]
  );

  const company = result.rows[0];
  return res.status(201).json({ company });
});

router.put("/:code", async function (req, res, next) {
  const { name, description } = req.body;

  const result = await db.query(
    `UPDATE companies
      SET name=$1,
          description=$2
      WHERE code =$3
      RETURNING code, name, description`,
    [name, description, req.params.code]
  );
  const company = result.rows[0];

  if (!company) {
    throw new NotFoundError();
  }
  return res.json({ company });
});

router.delete("/:code", async function (req, res, next) {
  const code = req.params.code;

  const results = await db.query(
    `DELETE
          FROM companies
          WHERE code = $1
          RETURNING code`,
    [code]
  );

  if (!results.rowCount) {
    throw new NotFoundError();
  }
  return res.json({ status: "deleted" });
});

module.exports = router;
