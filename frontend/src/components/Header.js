import React from 'react';
import { Link, useNavigate } from "react-router-dom";

import headerLogo from '../images/header/header-logo.svg';

function Header({ ...props }) {
	const navigate = useNavigate();

	function signOut() {
		localStorage.removeItem('jwt');
		navigate('/signin');
	}


	return (
		<header className="header">
			<img className="header__logo" src={headerLogo} alt="Логотип" loading="lazy" />

			{
				props.isPageSignUp && (
					<div className='header__actions'>
						<Link to="/signin" className='header__link'>Войти</Link>
					</div>
				)
			}

			{
				props.isPageSignIn && (
					<div className='header__actions'>
						<Link to="/signup" className='header__link'>Регистрация</Link>
					</div>
				)
			}

			{
				props.isPageIndex && (
					<div className='header__actions'>
						<p className="header__email">{props.email}</p>
						<button onClick={signOut} className="header__button" type="button">Выйти</button>
					</div>
				)
			}
		</header>
	)
}

export default Header;