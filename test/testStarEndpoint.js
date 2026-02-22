'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const starRouter = require('../service/star');

chai.use(chaiHttp);
chai.should();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.tenantId = 'test';
  req.logger = { info: () => {}, error: () => {} };
  next();
});
app.use('/star', starRouter);

describe('GET /star validation', function () {
  describe('invalid combinations', function () {
    it('rejects O type with class IV', function () {
      return chai.request(app)
        .get('/star?stellarType=O&subtype=5&stellarClass=IV')
        .then(res => {
          res.should.have.status(400);
          res.body.error.should.include('O type');
        });
    });

    it('rejects A type with class VI', function () {
      return chai.request(app)
        .get('/star?stellarType=A&subtype=0&stellarClass=VI')
        .then(res => {
          res.should.have.status(400);
          res.body.error.should.include('A and F type');
        });
    });

    it('rejects F type with class VI', function () {
      return chai.request(app)
        .get('/star?stellarType=F&subtype=5&stellarClass=VI')
        .then(res => {
          res.should.have.status(400);
          res.body.error.should.include('A and F type');
        });
    });

    it('rejects M type with class IV', function () {
      return chai.request(app)
        .get('/star?stellarType=M&subtype=0&stellarClass=IV')
        .then(res => {
          res.should.have.status(400);
          res.body.error.should.include('M type');
        });
    });

    it('rejects K5 with class IV', function () {
      return chai.request(app)
        .get('/star?stellarType=K&subtype=5&stellarClass=IV')
        .then(res => {
          res.should.have.status(400);
          res.body.error.should.include('K5+');
        });
    });

    it('rejects K9 with class IV', function () {
      return chai.request(app)
        .get('/star?stellarType=K&subtype=9&stellarClass=IV')
        .then(res => {
          res.should.have.status(400);
          res.body.error.should.include('K5+');
        });
    });
  });

  describe('valid combinations near the boundaries', function () {
    it('accepts K4 with class IV', function () {
      return chai.request(app)
        .get('/star?stellarType=K&subtype=4&stellarClass=IV')
        .then(res => {
          res.should.have.status(200);
        });
    });

    it('accepts K5 with class V', function () {
      return chai.request(app)
        .get('/star?stellarType=K&subtype=5&stellarClass=V')
        .then(res => {
          res.should.have.status(200);
        });
    });

    it('accepts O type with class V', function () {
      return chai.request(app)
        .get('/star?stellarType=O&subtype=5&stellarClass=V')
        .then(res => {
          res.should.have.status(200);
        });
    });

    it('accepts G2 V and returns expected fields', function () {
      return chai.request(app)
        .get('/star?stellarType=G&subtype=2&stellarClass=V')
        .then(res => {
          res.should.have.status(200);
          res.body.should.have.property('stellarType', 'G');
          res.body.should.have.property('subtype', 2);
          res.body.should.have.property('stellarClass', 'V');
          res.body.should.have.property('mass');
          res.body.should.have.property('diameter');
          res.body.should.have.property('temperature');
          res.body.should.have.property('luminosity');
          res.body.should.have.property('hzco');
          res.body.should.have.property('minimumAllowableOrbit');
          res.body.should.have.property('jumpShadow');
          res.body.should.have.property('colour');
          res.body.should.have.property('age');
        });
    });
  });

  describe('input validation', function () {
    it('rejects missing stellarType', function () {
      return chai.request(app)
        .get('/star?subtype=2&stellarClass=V')
        .then(res => {
          res.should.have.status(400);
        });
    });

    it('rejects unknown stellarType', function () {
      return chai.request(app)
        .get('/star?stellarType=Z&subtype=2&stellarClass=V')
        .then(res => {
          res.should.have.status(400);
        });
    });

    it('rejects non-integer subtype', function () {
      return chai.request(app)
        .get('/star?stellarType=G&subtype=abc&stellarClass=V')
        .then(res => {
          res.should.have.status(400);
        });
    });

    it('rejects subtype out of range', function () {
      return chai.request(app)
        .get('/star?stellarType=G&subtype=10&stellarClass=V')
        .then(res => {
          res.should.have.status(400);
        });
    });

    it('rejects invalid stellarClass', function () {
      return chai.request(app)
        .get('/star?stellarType=G&subtype=2&stellarClass=VII')
        .then(res => {
          res.should.have.status(400);
        });
    });
  });
});
