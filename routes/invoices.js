const express = require("express");
const { NotFoundError } = require("../expressError");

const db = require("../db.js");
const router = new express.Router();

router.get("/", async function (req, res, next) {
    const results = await db.query(
        `SELECT id, comp_code, amt, paid, add_date, paid_date 
        FROM invoices`
    )

    const invoices = results.rows;
    return res.json({ invoices });
})

router.get("/:id", async function (req, res, next) {
    let id = req.params.id;

    const results = await db.query(
        `SELECT 
            id, amt, paid, add_date, paid_date, comp_code
            FROM invoices
            WHERE id = $1`,
        [id]);

    const invoicesResults = results.rows[0];

    // const compResults = await db.query(
    //     `SELECT
    //         code, name, description
    //         FROM companies
    //         WHERE code = $1`,
    //     [code]);

    // const companiesResulyts = compResults.rows[0];

    console.log(results)
    // return 
})

module.exports = router;