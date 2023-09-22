class Api {
	constructor({ url, headers }) {
		this._url = url;
		// this._headers = headers;

		this._cardsUrl = this._url + '/cards';
		this._cardID = this._url + '/cards/';
		this._cardLikes = this._url + '/cards/cardId/likes';

		this._userUrl = this._url + '/users/me';
		this._userAvatarUrl = this._url + '/users/me/avatar';
	}

  _headers() {
    const jwt = localStorage.getItem('jwt');
    console.log(`jwt = ${jwt}`);

    return {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    };
  }

	_checkResponse(res) {
		// Проверка статуса ответа сервера

		if (res.ok) return res.json()

		return Promise.reject('Promise reject error');
	}

	/*
	* Работаем с карточками
	*/
	// getCards() {
	// 	return fetch(this._cardsUrl, {
	// 		headers: this._headers()
	// 	})
	// 		.then(this._checkResponse)
	// 		// .catch((err) => {
	// 		// 	console.error('Ошибка! Ошибка при выводе карточек');
	// 		// })
	// }

	getCards() {
    const jwt = localStorage.getItem('jwt');

		return fetch(this._cardsUrl, {
			headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
		})
			.then(this._checkResponse)
			// .catch((err) => {
			// 	console.error('Ошибка! Ошибка при выводе карточек');
			// })
	}

	addNewCard(data) {
    const jwt = localStorage.getItem('jwt');

		return fetch(this._cardsUrl, {
			method: 'POST',
			// headers: this._headers(),
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
			body: JSON.stringify(data),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка добавлении новой карточки');
			})
	}


	removeCard(id) {
    const jwt = localStorage.getItem('jwt');

		return fetch(`${this._cardsUrl}/${id}`, {
			method: 'DELETE',
			// headers: this._headers(),
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка удаления карточки');
			})
	}


	addLike(id) {
    const jwt = localStorage.getItem('jwt');

		return fetch(`${this._cardID}/likes//${id}`, {
			// headers: this._headers(),
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
			method: 'PUT',
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка лайка карточки');
			})
	}

	removeLike(id) {
    const jwt = localStorage.getItem('jwt');

		return fetch(`${this._cardID}/likes//${id}`, {
			// headers: this._headers(),
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
			method: 'DELETE',
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка дизлайка карточки');
			})
	}

	toggleLike(id, isLiked) {
		if (isLiked) {
			return this.removeLike(id);
		} else {
			return this.addLike(id);
		}
	}


	/*
	* Работаем с инфополем
	*/

	getUserInfo() {
    const jwt = localStorage.getItem('jwt');

		return fetch(this._userUrl, {
			// headers: this._headers()
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при получении данных о пользователе');
			})
	}

	setUserInfo(data) {
    const jwt = localStorage.getItem('jwt');

		return fetch(this._userUrl, {
			method: 'PATCH',
			// headers: this._headers(),
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },

			body: JSON.stringify(data),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при Добавлении новых данных о пользователе');
			})
	}

	setUserAvatar(data) {
    const jwt = localStorage.getItem('jwt');

		return fetch(this._userAvatarUrl, {
			method: 'PATCH',
			// headers: this._headers(),
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
			body: JSON.stringify(data),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при Добавлении новых данных о пользователе');
			})
	}
}

const api = new Api({
  // url: 'https://api.mmm.nomoredomainsrocks.ru'
  url: 'http://localhost:3000'
});

export default api;