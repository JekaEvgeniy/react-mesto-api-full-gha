class Api {
	constructor({ url, headers }) {
		this._url = url;
		this._headers = headers;

		this._cardsUrl = this._url + '/cards';
		this._cardID = this._url + '/cards/';
		this._cardLikes = this._url + '/cards/cardId/likes';

		this._userUrl = this._url + '/users/me';
		this._userAvatarUrl = this._url + '/users/me/avatar';

    this._defaultHeaders = { 'Content-Type': 'application/json' };
	}

  _injectAuth(headers = {}){
    return { ...headers, authorization: `Bearer ${localStorage.getItem('jwt')}` };
  }

  setToken(token) {
    this._headers.authorization = `Bearer ${token}`;
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
      // credentials: 'include',// т.к. исп. куки. нужно для cors. см. вебинар "Авторизация через куки, работа с сервером через vscode, cors"
			// headers: this._headers
      // headers: {
      //   authorization: `Bearer ${localStorage.getItem('jwt')}`
      // },
      headers: this._injectAuth(this._defaultHeaders),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при выводе карточек');
			})
	}

	addNewCard(data) {
		return fetch(this._cardsUrl, {
      // credentials: 'include',
			method: 'POST',
			// headers: this._headers,
      // headers: {
      //   'Content-Type': 'application/json',
      //   authorization: `Bearer ${localStorage.getItem('jwt')}`
      // },
      headers: this._injectAuth(this._defaultHeaders),
			body: JSON.stringify(data),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка добавлении новой карточки');
			})
	}


	removeCard(id) {
		return fetch(`${this._cardsUrl}/${id}`, {
      // credentials: 'include',
			method: 'DELETE',
			// headers: this._headers,
      // headers: {
      //   authorization: `Bearer ${localStorage.getItem('jwt')}`
      // },
      headers: this._injectAuth(this._defaultHeaders),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка удаления карточки');
			})
	}


	addLike(id) {
		return fetch(`${this._cardID}/likes//${id}`, {
      // credentials: 'include',
			// headers: this._headers,
      // headers: {
      //   authorization: `Bearer ${localStorage.getItem('jwt')}`
      // },
      headers: this._injectAuth(this._defaultHeaders),
			method: 'PUT',
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка лайка карточки');
			})
	}

	removeLike(id) {
		return fetch(`${this._cardID}/likes//${id}`, {
      // credentials: 'include',
			// headers: this._headers,
      // headers: {
      //   authorization: `Bearer ${localStorage.getItem('jwt')}`
      // },
      headers: this._injectAuth(this._defaultHeaders),
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
      method: "GET",
      // headers: this._headers,
      // credentials: 'include',
			// headers: {
      //   authorization: `Bearer ${localStorage.getItem('jwt')}`
      // },
      headers: this._injectAuth(this._defaultHeaders),
		})
      .then((res)=>{
        console.error('Ошибка! Ошибка при получении данных о пользователе');
        if (res.ok) return res.json();

        return res.json().then((res) => {
          throw new Error(res.message);
        });
      })
			//.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при получении данных о пользователе');
			})
	}

	setUserInfo({name, about}) {

		return fetch(this._userUrl, {
      // credentials: 'include',
			method: 'PATCH',
      // headers: this._headers,
      // headers: {
      //   'Content-Type': 'application/json',
      //   authorization: `Bearer ${localStorage.getItem('jwt')}`
      // },
      headers: this._injectAuth(this._defaultHeaders),
			body: JSON.stringify({ name, about }),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при Добавлении новых данных о пользователе');
			})
	}

	setUserAvatar(link) {

		return fetch(this._userAvatarUrl, {
      // credentials: 'include',
			method: 'PATCH',
			// headers: this._headers,
      // headers: {
      //   'Content-Type': 'application/json',
      //   authorization: `Bearer ${localStorage.getItem('jwt')}`
      // },
      headers: this._injectAuth(this._defaultHeaders),
			body: JSON.stringify({avatar:link}),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при Добавлении новых данных о пользователе');
			})
	}
}

console.log(`http://localhost:3000`);
const api = new Api({
  // url: 'https://api.mmm.nomoredomainsrocks.ru',
  url: 'http://localhost:3000'
});

export default api;