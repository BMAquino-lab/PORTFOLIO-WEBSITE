import assert from 'node:assert/strict';

const store = new Map();
globalThis.localStorage = {
  getItem: key => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, value),
  removeItem: key => store.delete(key),
};
const { demoRequest, resetDemo } = await import('../src/api/demoBackend.ts');
resetDemo();
let rows = (await demoRequest('/drivers/search', { filters: { full_name: 'alex' } })).data;
assert.equal(rows.length, 1);
assert.equal(rows[0].license_number, 'DEMO-D001');
rows = (await demoRequest('/drivers/search', { selected_columns: ['license_number'], filters: {} })).data;
assert.deepEqual(Object.keys(rows[0]), ['license_number']);
await demoRequest('/drivers/add', { data: { license_number: 'DEMO-D999', full_name: 'Test Person', sex: 'F', date_of_birth: '2000-01-01', address: 'Example', license_type: 'Professional' } });
await assert.rejects(() => demoRequest('/drivers/add', { data: { license_number: 'DEMO-D999' } }), /already exists/);
await demoRequest('/drivers/edit', { updates: { address: 'Updated Sample City' }, filters: { license_number: 'DEMO-D999' } });
rows = (await demoRequest('/drivers/search', { filters: { license_number: 'DEMO-D999' } })).data;
assert.equal(rows[0].address, 'Updated Sample City');
await assert.rejects(() => demoRequest('/vehicles/edit', { updates: { color: 'Green' }, filters: {} }), /filter/);
await assert.rejects(() => demoRequest('/registrations/add', { data: { plate_number: 'missing', license_number: 'DEMO-D999' } }), /not found/);
rows = (await demoRequest('/reports/violation-type-totals', { year: 2026 })).data;
assert.equal(rows.reduce((sum, row) => sum + row.violation_count, 0), 2);
rows = (await demoRequest('/reports/vehicles-by-driver', { license_number: 'DEMO-D001' })).data;
assert.equal(rows.length, 2);
resetDemo();
rows = (await demoRequest('/drivers/search', { filters: { license_number: 'DEMO-D999' } })).data;
assert.equal(rows.length, 0);
await assert.rejects(() => demoRequest('/unknown'), /not available/);
console.log('LTO demo: searches, projections, validation, updates, reports, and reset passed.');
