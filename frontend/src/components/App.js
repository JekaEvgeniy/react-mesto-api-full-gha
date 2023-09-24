import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute.js';

import api from '../utils/Api';
import * as auth from '../utils/Auth';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

import CurrentUserContext from '../contexts/CurrentUserContext';
import Register from './Register';
import Login from './Login';

function App() {
	const [loggedIn, setLoggedIn] = useState(false);

	const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
	const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
	const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

	const [isInfoTooltip, setIsInfoTooltip] = useState(null);

	const [selectedCard, setSelectedCard] = useState(null);

	const [currentUser, setCurrentUser] = useState({});

	const [cards, setCards] = useState([]);

	const [email, setEmail] = useState(null);

	const navigate = useNavigate();

 // const history = useHistory();

	// https://reactrouter.com/en/main/hooks/use-navigate
	// ERROR useNavigate() may be used only in the context of a <Router> component.
	// https://bobbyhadz.com/blog/react-usenavigate-may-be-used-only-in-context-of-router

	const handleInfoTooltip = (status) => {
		setIsInfoTooltip(status);
	}

	const handleEditAvatarClick = () => {
		setIsEditAvatarPopupOpen(true);
	}

	const handleEditProfileClick = () => {
		setIsEditProfilePopupOpen(true);
	}

	const handleAddPlaceClick = () => {
		setIsAddPlacePopupOpen(true);
	}

	function closeAllPopups() {
		setIsEditProfilePopupOpen(false);
		setIsEditAvatarPopupOpen(false);
		setIsAddPlacePopupOpen(false);
		setIsInfoTooltip(null);

		setSelectedCard(null);
	}

	function handleCardClick(card) {
		setSelectedCard(card);
	}

	function handleUpdateUser(userData) {
		api.setUserInfo(userData)
			.then((updateUserData) => {
				setCurrentUser(updateUserData);

				closeAllPopups();
			})
			.catch(err => console.error(err));
	}

	function handleUpdateAvatar(data) {
		api.setUserAvatar(data)
			.then((updateData) => {
				setCurrentUser(updateData);

				closeAllPopups();
			})
			.catch(err => console.error(err));
	}

	function handleAddNewCard(data) {
		api.addNewCard(data)
			.then((newCard) => {
				setCards((state) => [newCard, ...state]);
				closeAllPopups();
			})
			.catch((err) => {
				console.error('Warning! Attention! Achtung! Ошибка при добавлении новой карточки!');
			})
	}


	function handleCardLike(card) {
		// Снова проверяем, есть ли уже лайк на этой карточке
		const isLiked = card.likes.some(i => i._id === currentUser._id);

		// Отправляем запрос в API и получаем обновлённые данные карточки
		api.toggleLike(card._id, isLiked)
			.then((newCard) => {
				setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
			})
			.catch(err => console.error(err));
	}

	function handleCardDelete(card) {
		api.removeCard(card._id)
			.then(() => {
				setCards((state) => state.filter((c) => c._id !== card._id));
			})
			.catch(err => console.error(err));
	}

	const handleLogin = () => {
		setLoggedIn(true);
	}

	const handleRegister = ({ email, password }) => {
		auth.register(email, password)
			.then((res) => {
				localStorage.setItem("jwt", res.token);

				setLoggedIn(true);
				navigate('/');
			})
			.catch(err => {
				console.error(err);
			});
	}

	const tockenCheck = () => {
		const jwt = localStorage.getItem('jwt');
    console.log(`jwt =  ${jwt}` );

		if (jwt) {
			auth.checkToken(jwt)
				.then(user => {
          console.log(user);

					setEmail(user.data.email);

					handleLogin(user);

					navigate('/');
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}

  // console.log(`loggedIn = ${loggedIn}; Если false, то будет return;`);
  // if ( loggedIn){

  //   api.getUserInfo()
  //     .then(setCurrentUser)
  //     .catch(err => console.error(err));

  //   api.getCards()
  //     .then(res => {
  //       setCards(res);
  //     })
  //     .catch(err => console.error(err));

  // }

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    console.log(`token =  ${token}`);

    if (token) {
      auth.checkToken(token)
        .then(user => {
          console.log(`user = ${user}`);
          console.log(`user.data.email = ${user.data.email}`);
          // api.setToken(token);

          setLoggedIn(true);
          handleLogin(user);
          // setEmail(user.data.email);

          const token = localStorage.getItem('jwt');
          Promise.all([api.getUserInfo(), api.getCards()])
          .then(([info, cards]) => {

              if (token) {
                setCurrentUser(info.data);
                setCards(cards.data);
              }

              // api.getUserInfo()
              //   .then(setCurrentUser)
              //   .catch(err => console.error(err));

              // api.getCards()
              //   .then(res => {
              //     setCards(res);
              //   })
              //   .catch(err => console.error(err));

            })
            .catch((err) => console.log(`Ошибка promise.all: ${err.status}`));

          navigate('/');

        })
        .catch((err) => {
          console.error('useEffect =>>> Ошибка проверки токена!');
          console.error(err);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    console.log(`loggedIn ===> ${loggedIn};`);

    if (loggedIn){
      api.getUserInfo()
        .then(setCurrentUser)
        .catch(err => console.error(err));

      api.getCards()
        .then(res => {
          setCards(res);
        })
        .catch(err => console.error(err));
    }

  }, [navigate]);


/*
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      console.log(`token = ${token}`);


      auth.checkToken(token)
        .then(user => {
          console.log(user);

          api.setToken(token);

          setEmail(user.data.email);
          setLoggedIn(true);
          handleLogin(user);

          navigate('/');
        })
        .catch((err) => {
          setLoggedIn(false);
          //localStorage.removeItem('jwt'); console.log(`localStorage.removeItem('jwt')`);
          console.error(err);
        });

      api.getUserInfo()
        .then(setCurrentUser)
        .catch(err => console.error(err));

      api.getCards()
        .then(res => {
          setCards(res);
        })
        .catch(err => console.error(err));


    } else {

    }
  }, [navigate, loggedIn]);

*/
	return (
		<CurrentUserContext.Provider value={currentUser}>
			<div className="page">
				<Routes>

					<Route
						path="/signup"
						element={
							<Header isPageSignUp />
						}
					/>

					<Route
						path="/signin"
						element={
							<Header isPageSignIn />
						}
					/>

					<Route
						path="/"
						element={
							<Header isPageIndex email={email} />
						}
					/>

				</Routes>

				<Routes>
					<Route
						path="/signup"
						element={<Register handleRegister={handleRegister} handleInfoTooltip={handleInfoTooltip} />}
					/>
					<Route
						path="/signin"
						element={<Login handleLogin={handleLogin} handleInfoTooltip={handleInfoTooltip} />}
					/>

					<Route
						path="/"
						element={
							<>
								<ProtectedRoute
									loggedIn={loggedIn}
									element={Main}

									onEditProfile={handleEditProfileClick}
									onEditAvatar={handleEditAvatarClick}
									onAddPlace={handleAddPlaceClick}

									cards={cards}
									onCardClick={handleCardClick}
									onCardLike={handleCardLike}
									onCardDelete={handleCardDelete}
								/>

								<Footer />
							</>
						}
					/>

					<Route path="*"
						element={loggedIn ? <Navigate to='/' /> : <Navigate to='/signin' replace />}
					/>

				</Routes>

				<EditProfilePopup
					isOpen={isEditProfilePopupOpen}
					onClose={closeAllPopups}
					onUpdateUser={handleUpdateUser}
				/>

				<EditAvatarPopup
					isOpen={isEditAvatarPopupOpen}
					onClose={closeAllPopups}
					onUpdateAvatar={handleUpdateAvatar}
				/>

				<AddPlacePopup
					isOpen={isAddPlacePopupOpen}
					onClose={closeAllPopups}
					onAddNewCard={handleAddNewCard}
				/>

				<ImagePopup
					title="Попап с картинкой"
					card={selectedCard}
					onClose={closeAllPopups}
				/>

				<InfoTooltip
					title="Попап с информацией"
					onClose={closeAllPopups}
					status={isInfoTooltip}
				/>

			</div>
		</CurrentUserContext.Provider>
	);
}

export default App;