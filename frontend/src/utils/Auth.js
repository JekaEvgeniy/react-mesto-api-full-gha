// import React from "react";
export const BASE_URL = 'https://api.mmm.nomoredomainsrocks.ru';
// export const BASE_URL = 'https://localhoset:3000';

const checkResponse = (res) => {
	// Проверка статуса ответа сервера

	if (res.ok) return res.json()

	return Promise.reject(`Ошибка: ${res.status}`);
}

export const register = ({ email, password }) => {
	return fetch(`${BASE_URL}/signup`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	})
	.then(checkResponse);
};

export const authorize = ({ email, password }) => {
  console.log(`email = ${email}`);
  console.log(`password = ${password}`);
  const token = localStorage.getItem('jwt');

	return fetch(`${BASE_URL}/signin`, {
		method: 'POST',
    // credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
		},

		body: JSON.stringify({ email, password })

	})
	.then(checkResponse);
};

export const getContent = (token) => {
	return fetch(`${BASE_URL}/users/me`, {
		method: 'GET',
    // credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
	}).then(checkResponse);
};
