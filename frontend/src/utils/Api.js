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
			// body: JSON.stringify(data),
      body: JSON.stringify({
        name: data.name,
        link: data.link
      }),
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


	addLike(data) {
    return fetch(`${this._url}/cards/${data._id}/likes`, {
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

  removeLike(data) {
    return fetch(`${this._url}/cards/${data._id}/likes`, {
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

	toggleLike(data, isLiked) {
		if (isLiked) {
			return this.removeLike(data);
		} else {
			return this.addLike(data);
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
			.then(this._checkResponse)
			.catch((err) => {
        console.error(`Ошибка! Ошибка при получении данных о пользователе: ${err}`);
			})
	}

  setUserInfo({ name, about }) {

    // console.log(`>>> setUserInfo()`);
    // console.log(data); // {name: 'Жак-Ив Кусто3', about: 'Исследовател3'}
    // console.log(name); // {name: 'Жак-Ив Кусто3', about: 'Исследовател3'}
    // console.log(about); // {name: 'Жак-Ив Кусто3', about: 'Исследовател3'}

    return fetch(`${this._url}/users/me`, {
      // credentials: 'include',
			method: 'PATCH',
      // headers: this._headers,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      // headers: this._injectAuth(this._defaultHeaders),
			// body: JSON.stringify( data ),
			body: JSON.stringify({ name, about }),
      // body: JSON.stringify({
      //   name: data.name,
      //   about: data.about
      // }),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при Добавлении новых данных о пользователе');
				console.error(err);
			})
	}

	setUserAvatar(data) {
    console.log('data', data);
    const url = `${this._url}/users/me/avatar`;

    return fetch(url, {
      // credentials: 'include',
			method: 'PATCH',
			// headers: this._headers,
      // headers: {
      //   'Content-Type': 'application/json',
      //   authorization: `Bearer ${localStorage.getItem('jwt')}`
      // },
      headers: this._injectAuth(this._defaultHeaders),
			body: JSON.stringify({
        avatar: data.avatar
      }),
      // body: JSON.stringify({ avatar }),
		})
			.then(this._checkResponse)
			.catch((err) => {
				console.error('Ошибка! Ошибка при Добавлении новых данных о пользователе', err);
			})
	}
}

const api = new Api({
  // url: 'https://api.mmm.nomoredomainsrocks.ru',
  url: 'http://localhost:3000'
});

export default api;