// import React from "react";
// export const BASE_URL = 'https://api.mmm.nomoredomainsrocks.ru/';
export const BASE_URL = 'http://localhost:3000';

const checkResponse = (res) => {
	// Проверка статуса ответа сервера
  console.log(`checkResponse() ===> `);

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
	return fetch(`${BASE_URL}/signin`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},

		body: JSON.stringify({ email, password })

	})
	.then(checkResponse)
  .then((data) => {
    const token = data.token;
    console.log(`token = ${token}`);
    if (token) {
      localStorage.setItem('jwt', data.token);
    }


    return data;
  });
};

export const checkToken = (token) => {
  console.log(`BASE_URL = ${BASE_URL}`);
  if (! token ){
    token = localStorage.getItem('jwt');
  }

  console.log(`Auth.js checkToken() >>>> token = ${token}`);

	return fetch(`${BASE_URL}/users/me`, {
		method: 'GET',
    //credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
  }).then(checkResponse);
};
