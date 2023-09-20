import React from 'react';

function InfoTooltip({ onClose, status  }) {
	return (
		<section className={`popup popup_type_info ${status ? 'popup_opened' : ''}`} >

			<div className="popup__inside popup__inside_contains_info popup__inside_width_sm">
				<div className="popup__container popup__container_type_info">

					<div className={`popup__circle-badge popup__circle-badge_type_${status}`}></div>

					<h2 className="popup__title popup__title_centered popup__title_phone-oversized">
						{status == 'success' ?
							'Вы успешно зарегистрировались!' :
							'Что-то пошло не так! Попробуйте ещё раз.'
						}
					</h2>

				</div>
				<button onClick={onClose} className="popup__close" type="button" aria-label="Закрыть"></button>
			</div>

		</section>
	)
}

export default InfoTooltip;