import React, { useContext } from 'react';
import Card from './Card';

import CurrentUserContext from '../contexts/CurrentUserContext';

function Main({ onEditAvatar, onEditProfile, onAddPlace, cards, onCardLike, onCardDelete, onCardClick }) {

	const currentUser = useContext(CurrentUserContext);

	if (!currentUser) {
		// При обновлении данные не успевают загружаться и вываливаются ошибки
		return;
	}

	return (

		<main className="content">

			<section className="profile">
				<div className="profile__figure">
					<img className="profile__avatar" src={currentUser.avatar} alt="Фотография" />
					<button onClick={onEditAvatar} className="profile__button profile__button_type_avatar" type="button" name="button"
						aria-label="Обновить фотографию"></button>
				</div>

				<div className="profile__description">
					<div className="profile__info">
						<h1 className="profile__header">{currentUser.name}</h1>
						<button onClick={onEditProfile} className="profile__button profile__button_type_edit" type="button" name="button" aria-label="Редактировать"></button>
					</div>
					<p className="profile__subtitle">{currentUser.about}</p>
				</div>

				<button onClick={onAddPlace} className="profile__button profile__button_type_add" type="button" name="button" aria-label="Добавить"></button>
			</section>

			<section id="cards" className="cards" aria-label="Посещенные места">
				{
					cards.map((card) => (
						<Card
							key={card._id}
							card={card}
							onCardClick={onCardClick}
							onCardLike={onCardLike}
							onCardDelete={onCardDelete}
						/>
					))
				}
			</section>

		</main>
	)
}

export default Main;