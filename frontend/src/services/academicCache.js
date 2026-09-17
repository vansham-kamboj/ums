import api from './api';

const cache = {
  departments: null,
  programs: null,
  programTypes: null,
  courses: null,
  divisions: null,
  batches: null,
  subjects: null,
  subjectTypes: null,
  sessions: null,
  employees: null,
  enrollmentSeats: null,
};

const listeners = new Set();

export const subscribeAcademicCache = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notify = () => {
  listeners.forEach(fn => fn());
};

export const getCachedData = (key) => cache[key];

export const setCachedData = (key, data) => {
  cache[key] = data;
  notify();
};

export const invalidateAcademicCache = (key) => {
  if (key) {
    cache[key] = null;
  } else {
    Object.keys(cache).forEach(k => { cache[k] = null; });
  }
  notify();
};

export const fetchResource = async (key, endpoint) => {
  try {
    const res = await api.get(endpoint);
    const data = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
    cache[key] = data;
    return data;
  } catch (err) {
    console.error(`Error fetching ${key}:`, err);
    return cache[key] || [];
  }
};

export const fetchEmployees = async () => {
  if (cache.employees && cache.employees.length > 0) return cache.employees;
  try {
    const res = await api.get('/employees');
    const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
    const formatted = list.map(e => ({
      id: e.id,
      name: `${e.firstName || ''} ${e.lastName || ''}`.trim() || e.email || 'Employee'
    }));
    cache.employees = formatted;
    return formatted;
  } catch (err) {
    try {
      const res2 = await api.get('/students/directory');
      return Array.isArray(res2.data?.data) ? res2.data.data : [];
    } catch {
      return cache.employees || [];
    }
  }
};

export const loadAcademicResources = async (resourceKeys = [], forceRefresh = false) => {
  // If all requested keys are already in cache and not forcing refresh, return immediately
  const missingKeys = resourceKeys.filter(k => forceRefresh || cache[k] === null);

  const fetchPromises = missingKeys.map(key => {
    switch (key) {
      case 'departments': return fetchResource('departments', '/academic/departments');
      case 'programs': return fetchResource('programs', '/academic/programs');
      case 'programTypes': return fetchResource('programTypes', '/academic/program-types');
      case 'courses': return fetchResource('courses', '/academic/courses');
      case 'divisions': return fetchResource('divisions', '/academic/divisions');
      case 'batches': return fetchResource('batches', '/academic/batches');
      case 'subjects': return fetchResource('subjects', '/academic/subjects');
      case 'subjectTypes': return fetchResource('subjectTypes', '/academic/subject-types');
      case 'sessions': return fetchResource('sessions', '/academic/sessions');
      case 'enrollmentSeats': return fetchResource('enrollmentSeats', '/academic/enrollment-seats');
      case 'employees': return fetchEmployees();
      default: return Promise.resolve([]);
    }
  });

  if (fetchPromises.length > 0) {
    await Promise.all(fetchPromises);
    notify();
  }

  return resourceKeys.reduce((acc, k) => {
    acc[k] = cache[k] || [];
    return acc;
  }, {});
};
