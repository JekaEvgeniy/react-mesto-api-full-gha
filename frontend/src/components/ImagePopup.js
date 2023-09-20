function ImagePopup(props) {
	return (
		<section className={`popup popup_type_image popup_dark_overlay ${props.card !== null ? 'popup_opened' : ''}`} >

			<div className="popup__inside popup__inside_contains_image">
				<figure className="popup-figure">
					<img className="popup-figure__img image-contain" src={props.card !== null ? props.card.link : '#'} alt="Изображение" />
					<figcaption className="popup-figure__figcaption">{props.card !== null ? props.card.name : '#'}</figcaption>
				</figure>
				<button onClick={props.onClose} className="popup__close" type="button" aria-label="Закрыть"></button>

			</div>

		</section>
	)
}

export default ImagePopup;