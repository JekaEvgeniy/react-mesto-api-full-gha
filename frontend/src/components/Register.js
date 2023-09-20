import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../utils/Auth';

function Register({ handleInfoTooltip }){
	const navigate = useNavigate();

	const [formValue, setFormValue] = useState({
		email: '',
		password: '',
	})

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

		auth.register({ email, password })
			.then((data) => {
				navigate('/signin');

				handleInfoTooltip('success');
			})
			.catch((err) => {
				console.error(err);

				handleInfoTooltip('error');
			});
	}


	return (
		<section className="login">
			<h2 className="login__header">Регистрация</h2>
			<form onSubmit={handleSubmit} className="login__form">
				<input onChange={handleChange} value={formValue.email} className="login__input" type="email" name="email" placeholder="Email" required />
				<input onChange={handleChange} value={formValue.password} className="login__input" type="password" name="password" placeholder="Пароль" required />
				<button className="login__button" type="submit">Зарегистрироваться</button>
			</form>

			<p className="login__caption">Уже зарегистрированы? <Link className="login__link" to="/signin">Войти</Link></p>
		</section>
	)
}

export default Register;