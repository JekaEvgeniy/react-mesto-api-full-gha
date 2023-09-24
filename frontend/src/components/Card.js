
import React, { useContext } from 'react';
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
	const currentUser = useContext(CurrentUserContext);
	const isOwn = card.owner._id === currentUser._id;
	const isLiked = card.likes.some(i => i === currentUser._id);

	function handleCardClick() {
		onCardClick(card);
	}

	function handleCardLike() {
		onCardLike(card);
	}

	function handleCardDelete() {
		onCardDelete(card);
	}

	return (

		<article className="card">
			<figure className="card__figure">
				<img onClick={handleCardClick} className="card__image image-cover" src={card.link} loading="lazy" alt={card.name} />
			</figure>
			<div className="card__info">
				<h2 className="card__title">{card.name}</h2>

				<div className="card__action">
					<button
						className={'card__button' + (isLiked ? ' card__button_active' : '')}
						onClick={handleCardLike}
						type="button"
						name="button"
						aria-label="Добавить в избранное"
					></button>
					<div className="card__counter">{card.likes.length}</div>
				</div>

			</div>
			{isOwn && (
				<button
					className="card__button-remove"
					onClick={handleCardDelete}
					type="button"
					name="button"
					aria-label="Удалить карточку"
				></button>
			)}


		</article>

	)
}

export default Card;