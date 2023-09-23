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

  setToken(token) {
    console.warn(`api.setToken >>> token = ${token}`);
    // if (token) {
    //   console.log('1');
    //   this._headers.Authorization = `Bearer ${token}`;
    // }
  }

	_checkResponse(res) {
		// Проверка статуса ответа сервера

		if (res.ok) return res.json();

		return Promise.reject('Promise reject error');
	}

	/*
	* Работаем с карточками
	*/

	getCards() {
		return fetch(this._cardsUrl, {
			headers: this._headers,
      credentials: 'include',
		})
			.then(this._checkResponse)
			// .catch((err) => {
			// 	console.error('Ошибка! Ошибка при выводе карточек');
			// })
	}

	addNewCard(data) {
		return fetch(this._cardsUrl, {
			method: 'POST',
      credentials: 'include',
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
			method: 'DELETE',
      credentials: 'include',
			headers: this._headers,
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка удаления карточки');
			})
	}


	addLike(id) {
		return fetch(`${this._cardID}/likes//${id}`, {
			headers: this._headers,
			method: 'PUT',
      credentials: 'include',
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка лайка карточки');
			})
	}

	removeLike(id) {
		return fetch(`${this._cardID}/likes//${id}`, {
			headers: this._headers,
			method: 'DELETE',
      credentials: 'include',
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
		return fetch(this._userUrl,{
      method: "GET",
			headers: this._headers,
      // credentials: 'include'
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error(`Ошибка! Ошибка при получении данных о пользователе:}`);
        console.error(err);
			})
	}

	setUserInfo(data) {

		return fetch(this._userUrl, {
			method: 'PATCH',
			headers: this._headers,
      credentials: 'include',
			body: JSON.stringify(data),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при Добавлении новых данных о пользователе');
			})
	}

	setUserAvatar(data) {

		return fetch(this._userAvatarUrl, {
			method: 'PATCH',
			headers: this._headers,
      credentials: 'include',
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
  url: 'http://localhost:3000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': "application/json",
  },
});

export default api;