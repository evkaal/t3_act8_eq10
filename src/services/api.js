// src/services/api.js

const DUMMY_BASE_URL = 'https://dummyjson.com';

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${DUMMY_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Usuario o contraseña incorrectos');
    }

    return data;
  } catch (error) {
    throw error;
  }
};