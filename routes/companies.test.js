const request = require("supertest");

const app = require("../app");
const db = require("../db");

let orange = {
    code: "orange",
    name: "orange",
    description: "blahh"
}

beforeEach(async function () {
    await db.query(
        `INSERT INTO companies (code, name, description)
               VALUES ('orange', 'orange', 'blahh')`
    )
});

afterEach(async function () {
    await db.query(
        `DELETE FROM companies`
    )
})

describe("GET /companies", function () {
    it("Gets a list of companies", async function () {
        const response = await request(app).get(`/companies`);

        expect(response.body).toEqual({ companies: [{ ...orange }] })
    })
})

describe("POST /companies", function () {
    it("Creates a new company", async function () {
        const resp = await request(app)
            .post(`/companies`)
            .send({
                "code": "lemon",
                "name": "lemon",
                "description": "blahh boo"
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({ company: { code: "lemon",
        name: "lemon",
        description: "blahh boo" } });
    });
});