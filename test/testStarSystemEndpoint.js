'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const starSystemRouter = require('../service/starSystem');

chai.use(chaiHttp);
chai.should();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.tenantId = 'test';
  req.logger = { info: () => {}, error: () => {} };
  next();
});
app.use('/star_system', starSystemRouter);

const post = (body) => chai.request(app).post('/star_system').send(body);

describe('POST /star_system', function () {
  this.timeout(10000);

  it('returns 400 when governmentTypes on the definition is an empty array', function () {
    return post({ uwp: 'B874409-A', governmentTypes: [] }).then((res) => {
      res.should.have.status(400);
      res.body.should.have.property('error');
    });
  });

  it('returns 400 when governmentTypes on the subsector is an empty array', function () {
    return post({ uwp: 'B874409-A', subsector: { governmentTypes: [] } }).then((res) => {
      res.should.have.status(400);
      res.body.should.have.property('error');
    });
  });
});