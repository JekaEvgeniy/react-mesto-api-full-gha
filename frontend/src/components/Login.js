import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/Api';
import * as auth from '../utils/Auth';

function Login({ handleLogin, handleInfoTooltip }) {
	const navigate = useNavigate();

	const [formValue, setFormValue] = useState({
		email: '',
		password: ''
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormValue({
			...formValue,
			[name]: value
		});
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const { email, password } = formValue;
    auth.authorize({ email, password })
			.then(data => {

				if (data.token) {
					localStorage.setItem('jwt', data.token);
          // api.setToken(data.token);

					handleLogin();

					navigate('/');
				}

			})
			.catch((err) => {
				// console.error(err);
				handleInfoTooltip('error');
			});
	}

	return (
		<section className="login">
			<h2 className="login__header">Вход</h2>
			<form onSubmit={handleSubmit} className="login__form">
				<input onChange={handleChange} value={formValue.email} className="login__input" type="email" name="email" placeholder="Email" required />
				<input onChange={handleChange} value={formValue.password} className="login__input" type="password" name="password" placeholder="Пароль" required />
				<button className="login__button" type="submit">Войти</button>
			</form>
		</section>
	)
}

export default Login;