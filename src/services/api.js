export const apiService = {
  login: async (username, password) => {
    const res = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 60 })
    });
    if (!res.ok) throw new Error('Usuario o contraseña incorrectos');
    return res.json();
  },
  
  getBloodData: async (page = 1, limit = 10, search = '') => {
    const query = search ? `&search=${search}` : '';
    const res = await fetch(`https://api.data.gov.my/data-catalogue?id=blood_donations&limit=${limit}&page=${page}${query}`);
    if (!res.ok) throw new Error('Error al obtener datos');
    return res.json();
  },

  addRecord: async (data) => {
    const res = await fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data) 
    });
    return res.json();
  },

  updateRecord: async (id, data) => {
    const res = await fetch('https://dummyjson.com/products/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Simulated-Id': String(id) },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteRecord: async (id) => {
    const res = await fetch('https://dummyjson.com/products/1', { 
      method: 'DELETE',
      headers: { 'X-Simulated-Id': String(id) }
    });
    return res.json();
  }
};