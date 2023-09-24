import React, { useState, useEffect, useContext } from 'react';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
	const currentUser = useContext(CurrentUserContext);

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		// хук isOpen реализует сброс значении input's при открытии popup

		if (currentUser.name) {
			// Без проверки можно получить: Cannot read properties of undefined (reading 'name')
			setName(currentUser.name);
		}

		if (currentUser.about) {
			setDescription(currentUser.about);
		}

	}, [currentUser, isOpen]);

	function handleChangeName(e) {
		setName(e.target.value);
	}

	function handleChangeDesc(e) {
		setDescription(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();

		// Передаём значения управляемых компонентов во внешний обработчик
		onUpdateUser({
			name,
			about: description,
		});
	}


	return (
		<PopupWithForm
			name="profile"
			title="Редактировать профиль"
			onSubmit={handleSubmit}
			isOpen={isOpen}
			onClose={onClose}
			children={(<>
				<input
					required
					id="profile-name-input"
					className="popup__input popup__input_type_name"
					onChange={handleChangeName}
					value={name ?? ''}
					type="text"
					name="name"
					placeholder="ФИО"
					minLength="2"
					maxLength="40"
					autoComplete="off"
				/>
				<span className="popup__error" id="profile-name-input-error"></span>

				<input
					required
					id="profile-about-input"
					className="popup__input popup__input_type_status"
					onChange={handleChangeDesc}
					value={description ?? ''}
					type="text"
					name="about"
					placeholder="Вид деятельности"
					minLength="2"
					maxLength="200"
					autoComplete="off"
				/>
				<span className="popup__error" id="profile-about-input-error"></span>
			</>)}
		/>
	)
}

export default EditProfilePopup;