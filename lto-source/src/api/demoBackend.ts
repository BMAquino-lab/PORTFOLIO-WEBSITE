/** Browser-only sample data for the portfolio demo. No real LTO records or server are used. */
type Value = string | number | null;
type Row = Record<string, Value>;
type Store = { drivers: Row[]; vehicles: Row[]; registrations: Row[]; violations: Row[] };

const STORAGE_KEY = 'brian-lto-demo-v1';
const sampleData: Store = {
  drivers: [
    { license_number: 'DEMO-D001', full_name: 'Alex Sample', sex: 'F', date_of_birth: '1997-04-12', address: 'Sample City', license_type: 'Non-Professional', date_issued: '2022-01-12', date_expired: '2032-01-12', license_status: 'Valid' },
    { license_number: 'DEMO-D002', full_name: 'Jordan Example', sex: 'M', date_of_birth: '1988-09-20', address: 'Example City', license_type: 'Professional', date_issued: '2015-03-09', date_expired: '2025-03-09', license_status: 'Expired' },
    { license_number: 'DEMO-D003', full_name: 'Casey Demo', sex: 'F', date_of_birth: '2001-06-04', address: 'Sample City', license_type: 'Student Permit', date_issued: '2024-06-06', date_expired: '2034-06-06', license_status: 'Valid' },
  ],
  vehicles: [
    { plate_number: 'DEMO-001', engine_number: 'ENGINE-001', chassis_number: 'CHASSIS-001', vehicle_type: 'Car', make: 'Example Motors', model: 'City', color: 'Blue', year_manufactured: 2020, owner: 'DEMO-D001' },
    { plate_number: 'DEMO-002', engine_number: 'ENGINE-002', chassis_number: 'CHASSIS-002', vehicle_type: 'Motorcycle', make: 'Sample Motors', model: 'Road', color: 'White', year_manufactured: 2018, owner: 'DEMO-D002' },
    { plate_number: 'DEMO-003', engine_number: 'ENGINE-003', chassis_number: 'CHASSIS-003', vehicle_type: 'Car', make: 'Example Motors', model: 'Cross', color: 'Silver', year_manufactured: 2022, owner: 'DEMO-D001' },
  ],
  registrations: [
    { registration_number: 1001, registration_date: '2023-01-01', expiration_date: '2028-01-01', registration_status: 'Active', history: 'Sample registration', plate_number: 'DEMO-001', license_number: 'DEMO-D001' },
    { registration_number: 1002, registration_date: '2019-05-10', expiration_date: '2024-05-10', registration_status: 'Expired', history: 'Sample registration', plate_number: 'DEMO-002', license_number: 'DEMO-D002' },
    { registration_number: 1003, registration_date: '2024-02-10', expiration_date: '2029-02-10', registration_status: 'Active', history: 'Sample registration', plate_number: 'DEMO-003', license_number: 'DEMO-D001' },
  ],
  violations: [
    { violation_ticket_num: 2001, violation_date: '2026-02-12', violation_type: 'Parking violation', location: 'Sample City', violation_status: 'Unpaid', apprehending_officer: 'Officer Example', fine_amount: 500, license_number: 'DEMO-D001', plate_number: 'DEMO-001' },
    { violation_ticket_num: 2002, violation_date: '2026-05-18', violation_type: 'Speeding', location: 'Example City', violation_status: 'Paid', apprehending_officer: 'Officer Sample', fine_amount: 1200, license_number: 'DEMO-D002', plate_number: 'DEMO-002' },
  ],
};

const copy = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
let memoryStore = copy(sampleData);
function readStore(): Store {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Store;
      if (['drivers', 'vehicles', 'registrations', 'violations'].every(key => Array.isArray(parsed[key as keyof Store]))) return parsed;
    }
  } catch { /* Storage may be unavailable; keep data in this tab. */ }
  return copy(memoryStore);
}
function writeStore(store: Store) {
  memoryStore = copy(store);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch { /* in-memory fallback */ }
}
export function resetDemo() {
  memoryStore = copy(sampleData);
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* in-memory fallback */ }
}
function same(a: Value | undefined, b: unknown) { return String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase(); }
function matches(row: Row, filters: Record<string, unknown>) {
  return Object.entries(filters).every(([key, value]) => {
    if (value === undefined || value === null || value === '') return true;
    if (['full_name', 'address', 'location'].includes(key)) return String(row[key] ?? '').toLowerCase().includes(String(value).toLowerCase());
    return same(row[key], value);
  });
}
function project(rows: Row[], columns: unknown): Row[] {
  if (!Array.isArray(columns) || columns.length === 0) return rows;
  return rows.map(row => Object.fromEntries(columns.map(column => [String(column), row[String(column)] ?? null])));
}
function age(birthDate: Value): number {
  const birthday = new Date(String(birthDate) + 'T00:00:00');
  const now = new Date();
  return now.getFullYear() - birthday.getFullYear() - (now.getMonth() < birthday.getMonth() || (now.getMonth() === birthday.getMonth() && now.getDate() < birthday.getDate()) ? 1 : 0);
}
function today() { return new Date().toISOString().slice(0, 10); }
function dateAfterYears(date: string, years: number) { const d = new Date(date + 'T12:00:00Z'); d.setUTCFullYear(d.getUTCFullYear() + years); return d.toISOString().slice(0, 10); }
function asRow(value: unknown): Row { return value && typeof value === 'object' && !Array.isArray(value) ? value as Row : {}; }
function requireRow(rows: Row[], key: string, value: unknown, label: string): Row {
  const found = rows.find(row => same(row[key], value));
  if (!found) throw new Error(`${label} was not found in the sample data.`);
  return found;
}
function add(rows: Row[], key: string, row: Row) {
  if (!row[key]) throw new Error(`${key.replaceAll('_', ' ')} is required.`);
  if (rows.some(existing => same(existing[key], row[key]))) throw new Error('That sample record already exists.');
  rows.push(row);
}
function update(rows: Row[], updates: Row, filters: Record<string, unknown>) {
  if (!Object.keys(updates).length || !Object.values(filters).some(value => value !== '' && value != null)) throw new Error('Select update fields and a filter.');
  const selected = rows.filter(row => matches(row, filters));
  if (!selected.length) throw new Error('No matching sample record was found.');
  selected.forEach(row => Object.assign(row, updates));
  return selected.length;
}

export async function demoRequest(path: string, input: object = {}): Promise<{ success: true; data: unknown }> {
  const store = readStore();
  const body = input as Record<string, unknown>;
  const filters = asRow(body.filters);
  const data = asRow(body.data);
  let result: unknown;
  let changed = false;
  const searchTables: Record<string, keyof Store> = {
    '/drivers/search': 'drivers', '/vehicles/search': 'vehicles',
    '/registrations/search': 'registrations', '/violations/search': 'violations',
  };
  const table = searchTables[path];
  if (table) result = project(store[table].filter(row => matches(row, filters)), body.selected_columns);
  else switch (path) {
    case '/drivers/add': {
      const issued = today();
      add(store.drivers, 'license_number', { ...data, date_issued: issued, date_expired: dateAfterYears(issued, 10), license_status: 'Valid' });
      result = 1; changed = true; break;
    }
    case '/vehicles/add': add(store.vehicles, 'plate_number', { ...data, owner: null }); result = 1; changed = true; break;
    case '/registrations/add': {
      requireRow(store.drivers, 'license_number', data.license_number, 'Driver');
      const vehicle = requireRow(store.vehicles, 'plate_number', data.plate_number, 'Vehicle');
      const issued = today();
      store.registrations.push({ ...data, registration_number: Math.max(1000, ...store.registrations.map(row => Number(row.registration_number))) + 1, registration_date: issued, expiration_date: dateAfterYears(issued, 5), registration_status: 'Active', history: 'Created in demo' });
      vehicle.owner = data.license_number; result = 1; changed = true; break;
    }
    case '/violations/file-ticket': {
      requireRow(store.drivers, 'license_number', data.license_number, 'Driver');
      requireRow(store.vehicles, 'plate_number', data.plate_number, 'Vehicle');
      store.violations.push({ ...data, violation_ticket_num: Math.max(2000, ...store.violations.map(row => Number(row.violation_ticket_num))) + 1, violation_date: today(), violation_status: 'Unpaid' });
      result = 1; changed = true; break;
    }
    case '/drivers/edit': result = update(store.drivers, asRow(body.updates), filters); changed = true; break;
    case '/vehicles/edit': result = update(store.vehicles, asRow(body.updates), filters); changed = true; break;
    case '/registrations/renew': Object.assign(requireRow(store.registrations, 'registration_number', body.registration_number, 'Registration'), data); result = 1; changed = true; break;
    case '/registrations/change-owner': {
      requireRow(store.drivers, 'license_number', body.new_license_number, 'Driver');
      const vehicle = requireRow(store.vehicles, 'plate_number', body.plate_number, 'Vehicle');
      vehicle.owner = String(body.new_license_number); result = 1; changed = true; break;
    }
    case '/violations/update-status': requireRow(store.violations, 'violation_ticket_num', body.violation_ticket_num, 'Violation').violation_status = String(body.new_status); result = 1; changed = true; break;
    case '/drivers/check-expired-licenses': store.drivers.forEach(row => { if (String(row.date_expired) < today() && row.license_status === 'Valid') row.license_status = 'Expired'; }); result = 1; changed = true; break;
    case '/registrations/check-expiration': store.registrations.forEach(row => { if (String(row.expiration_date) < today() && row.registration_status === 'Active') row.registration_status = 'Expired'; }); result = 1; changed = true; break;
    case '/drivers/owned-vehicles': case '/reports/vehicles-by-driver': result = store.vehicles.filter(row => same(row.owner, body.license_number)); break;
    case '/drivers/non-owners': result = store.drivers.filter(row => !store.vehicles.some(vehicle => same(vehicle.owner, row.license_number))); break;
    case '/registrations/owner-lookup': {
      const vehicle = requireRow(store.vehicles, 'plate_number', body.plate_number, 'Vehicle');
      const driver = requireRow(store.drivers, 'license_number', vehicle.owner, 'Owner');
      result = { full_name: driver.full_name, license_number: driver.license_number, plate_number: vehicle.plate_number }; break;
    }
    case '/violations/report-by-driver': result = store.violations.filter(row => same(row.license_number, body.license_number)); break;
    case '/violations/report-by-vehicle': result = store.violations.filter(row => same(row.plate_number, body.plate_number)); break;
    case '/reports/registered-drivers': {
      const { min_age, max_age, ...otherFilters } = filters;
      result = store.drivers.filter(row => matches(row, otherFilters) && (min_age == null || age(row.date_of_birth) >= Number(min_age)) && (max_age == null || age(row.date_of_birth) <= Number(max_age))); break;
    }
    case '/reports/expired-registrations': result = store.registrations.filter(row => String(row.expiration_date) < String(body.as_of_date || today())); break;
    case '/reports/problem-licenses': result = store.drivers.filter(row => ['Expired', 'Suspended'].includes(String(row.license_status)) || String(row.date_expired) < today()); break;
    case '/reports/violations-by-driver-range': result = store.violations.filter(row => same(row.license_number, body.license_number) && String(row.violation_date) >= String(body.start_date || '') && String(row.violation_date) <= String(body.end_date || '9999-12-31')); break;
    case '/reports/violation-type-totals': {
      const groups = new Map<string, Row>();
      store.violations.filter(row => String(row.violation_date).slice(0, 4) === String(body.year)).forEach(row => {
        const key = String(row.violation_type); const group = groups.get(key) ?? { violation_type: key, violation_count: 0, total_fines: 0 };
        group.violation_count = Number(group.violation_count) + 1; group.total_fines = Number(group.total_fines) + Number(row.fine_amount); groups.set(key, group);
      }); result = Array.from(groups.values()); break;
    }
    case '/reports/vehicles-in-violations-by-area': result = store.violations.filter(row => String(row.location).toLowerCase().includes(String(body.area ?? '').toLowerCase())).map(row => ({ ...store.vehicles.find(vehicle => same(vehicle.plate_number, row.plate_number)), ...row })); break;
    default: throw new Error('This operation is not available in the demo.');
  }
  if (changed) writeStore(store);
  return { success: true, data: copy(result ?? null) };
}
