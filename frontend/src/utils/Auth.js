// import React from "react";
// export const BASE_URL = 'https://api.mmm.nomoredomainsrocks.ru';
export const BASE_URL = 'http://localhost:3000';
console.log(`BASE_URL = ${BASE_URL}`);

const checkResponse = (res) => {
	// Проверка статуса ответа сервера

	if (res.ok) return res.json()

	return Promise.reject(`Ошибка: ${res.status}`);
}

export const register = (email, password) => {
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

export const authorize = ({email, password}) => {
  console.log(`email = ${email}`);
  console.log(`password = ${password}`);

	return fetch(`${BASE_URL}/signin`, {
		method: 'POST',
    // credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},

		body: JSON.stringify({ email, password })

	})
	.then(checkResponse)
  .then((data) => {
    localStorage.setItem('jwt', data.token);
    return data;
  });
};

export const getContent = () => {
  const token = localStorage.getItem('jwt');

	return fetch(`${BASE_URL}/users/me`, {
		method: 'GET',
    // credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
	}).then(checkResponse);
};
