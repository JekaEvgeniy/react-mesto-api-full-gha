class Api {
	constructor({ url, headers }) {
		this._url = url;
		this._headers = headers;

		this._cardsUrl = this._url + '/cards';
		this._cardID = this._url + '/cards/';
		this._cardLikes = this._url + '/cards/cardId/likes';

		this._userUrl = this._url + '/users/me';
		this._userAvatarUrl = this._url + '/users/me/avatar';
	}

	_checkResponse(res) {
		// Проверка статуса ответа сервера

		if (res.ok) return res.json()

		return Promise.reject('Promise reject error');
	}

	/*
	* Работаем с карточками
	*/
	getCards() {
		return fetch(this._cardsUrl, {
      credentials: 'include',// т.к. исп. куки. нужно для cors. см. вебинар "Авторизация через куки, работа с сервером через vscode, cors"
			headers: this._headers
		})
			.then(this._checkResponse)
			// .catch((err) => {
			// 	console.error('Ошибка! Ошибка при выводе карточек');
			// })
	}

	addNewCard(data) {
		return fetch(this._cardsUrl, {
      credentials: 'include',
			method: 'POST',
			headers: this._headers,
			body: JSON.stringify(data),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка добавлении новой карточки');
			})
	}


	removeCard(id) {
		return fetch(`${this._cardsUrl}/${id}`, {
      credentials: 'include',
			method: 'DELETE',
			headers: this._headers,
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка удаления карточки');
			})
	}


	addLike(id) {
		return fetch(`${this._cardID}/likes//${id}`, {
      credentials: 'include',
			headers: this._headers,
			method: 'PUT',
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка лайка карточки');
			})
	}

	removeLike(id) {
		return fetch(`${this._cardID}/likes//${id}`, {
      credentials: 'include',
			headers: this._headers,
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
		return fetch(this._userUrl, {
      credentials: 'include',
			headers: this._headers
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при получении данных о пользователе');
			})
	}

	setUserInfo(data) {

		return fetch(this._userUrl, {
      credentials: 'include',
			method: 'PATCH',
			headers: this._headers,
			body: JSON.stringify(data),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при Добавлении новых данных о пользователе');
			})
	}

	setUserAvatar(data) {

		return fetch(this._userAvatarUrl, {
      credentials: 'include',
			method: 'PATCH',
			headers: this._headers,
			body: JSON.stringify(data),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при Добавлении новых данных о пользователе');
			})
	}
}

// const api = new Api({
// 	url: `https://mesto.nomoreparties.co/v1/cohort-64`,
// 	headers: {
// 		authorization: '3d7a6b3d-0c4e-42b2-9c9f-9a1fd7b681b9',
// 		'Content-Type': 'application/json'
// 	}
// });
const api = new Api({
  url: 'https://api.mmm.nomoredomainsrocks.ru'
});

export default api;