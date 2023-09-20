import React, { useState, useEffect, useRef } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {

	const ref = useRef();

	useEffect(() => {
		// При открытии popup сбрасываем input

		ref.current.value = ''
	}, [isOpen]);

	function handleSubmit(e) {
		e.preventDefault();

		onUpdateAvatar({
			avatar: ref.current.value,
		});
	}

	return (
		<PopupWithForm
			name="avatar"
			title="Обновить аватар"
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
			children={(<>
				<input
					required
					id="avatar-url-input"
					className="popup__input popup__input_type_url"
					type="url"
					name="avatar"
					placeholder="Ссылка на картинку"
					autoComplete="off"
					ref={ref}
				/>
				<span className="popup__error" id="avatar-url-input-error"></span>
			</>)}
		/>
	)
}

export default EditAvatarPopup;