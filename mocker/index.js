const organizations = require('./organizations');
const groups = require('./groups');
const rooftops = require('./rooftops');

const proxy = {
  'GET /admin/organizations.json': organizations,
  'GET /admin/groups.json': groups,
  'GET /admin/rooftops.json': rooftops,
};

module.exports = proxy;
