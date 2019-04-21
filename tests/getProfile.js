const server = require("../server");
const request = require("supertest");
const chai = require("chai");
const should = require("chai").should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

it("should respond with redirect on post", function(done) {
    request(server)
        .post("/api/users/login")
        .send({ username: "test", email: "test@gmail.com", password: "12345" })
        .expect(200)
        .expect("Content-Type", /json/)
        .end(function(err, res) {
            if (err) done(err);
            expect(res.body).to.not.equal("undefined");
        });
    done();
});