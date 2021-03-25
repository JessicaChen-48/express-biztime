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

  const results = await db.query(
    `SELECT code, name, description
    FROM companies
    WHERE code=$1`,
    [code]
  );

  const company = results.rows[0];
  console.log(!company);

  if (!company) {
    throw new NotFoundError();
  } else {
    return res.json({ company });
  }
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
  return res.json({ company });
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
  const company = result.rows[0]
  return res.json({company})
});

module.exports = router;
