import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from "../contexts/CurrentUserContext";

function AddPlacePopup({ isOpen, onClose, onAddNewCard }) {

	const [link, setLink] = useState('');
	const [name, setName] = useState('');


	useEffect(() => {
		// При открытии popup сбрасываем input

		setLink('');
		setName('');

	}, [isOpen]);

	function handleChangeLink(e) {
		setLink(e.target.value);
	}

	function handleChangeName(e) {
		setName(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();

		// Передаём значения управляемых компонентов во внешний обработчик
		onAddNewCard({
			link,
			name
		});
	}

	return (

		<PopupWithForm
			name="newcard"
			title="Новое место"
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
			children={(<>
				<input
					required
					id="newcard-title-input"
					className="popup__input popup__input_type_title"
					type="text"
					name="name"
					placeholder="Название"
					minLength="2"
					maxLength="30"
					autoComplete="off"
					value={name}
					onChange={handleChangeName}
				/>
				<span className="popup__error" id="newcard-title-input-error"></span>

				<input
					required
					id="newcard-url-input"
					className="popup__input popup__input_type_url"
					type="url"
					name="link"
					placeholder="Ссылка на картинку"
					autoComplete="off"
					value={link}
					onChange={handleChangeLink}
				/>
				<span className="popup__error" id="newcard-url-input-error"></span>
			</>)}
		/>
	)
}

export default AddPlacePopup;