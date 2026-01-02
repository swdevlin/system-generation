const express = require('express');
const winston = require('winston');
const morgan = require('morgan');
const gasGiantRouter = require('./service/gasGiant');
const planetoidBeltRouter = require('./service/planetoidBelt');

const app = express();
const port = 3025;

// Logger Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/access.log' }),
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
  ],
});

// Middleware
app.use((req, res, next) => {
  req.tenantId = req.headers['x-tenant-id'] || 'unknown-tenant';
  req.logger = logger;
  next();
});

morgan.token('tenant', (req) => req.tenantId);
app.use(morgan(':method :url :status - :response-time ms - tenant: :tenant', {
  skip: (req) => req.path === '/favicon.ico',
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Favicon silent handler
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Routes
app.use('/gas_giant', gasGiantRouter);
app.use('/planetoid_belt', planetoidBeltRouter);

app.listen(port, '0.0.0.0', () => {
  logger.info(`Generator Service listening on all interfaces at port ${port}`);
});