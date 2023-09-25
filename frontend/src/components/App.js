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
    // console.log(userData);
		api.setUserInfo(userData)
			.then((updateUserData) => {

				setCurrentUser(updateUserData.data);

				closeAllPopups();
			})
			.catch(err => console.error(err));
	}

	function handleUpdateAvatar(data) {
    /*
    https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60
    https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60
    https://plus.unsplash.com/premium_photo-1682036382992-c39bdcbdbc5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60
    https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60
    https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60
    */

		api.setUserAvatar(data)
			.then((updateData) => {
        // console.log('>>> handleUpdateAvatar', updateData.data.avatar)
        setCurrentUser({ ...updateData.data, avatar: updateData.data.avatar });

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
		const isLiked = card.likes.some(i => i === currentUser._id);

		// Отправляем запрос в API и получаем обновлённые данные карточки
		api.toggleLike(card, isLiked)
			.then((newCard) => {
				setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
			})
			.catch(err => console.error(err));
	}

	function handleCardDelete(card) {
    // console.log('card>>>', card._id);
		api.removeCard(card._id)
			.then(() => {
				setCards((state) => state.filter((c) => c._id !== card._id));
			})
			.catch(err => console.error(err));
	}

	const handleLogin = () => {
		setLoggedIn(true);
	}

  const handleLogout = () => {
    console.log('handleLogout>>>>');
    navigate('/signin');
		setLoggedIn(false);
    localStorage.removeItem('jwt');
	}

	const handleRegister = ({ email, password }) => {

		auth.register(email, password)
			.then((res) => {
				localStorage.setItem("jwt", res.token);
        setCurrentUser(res);
        handleUpdateUser(res);
        handleUpdateAvatar(res);

				setLoggedIn(true);
				navigate('/');
			})
			.catch(err => {
        console.err(`front> >>> APP.js >>> handleRegister()`);
				console.error(err);
			});
	}

  useEffect(() => {
    if (loggedIn){
      const token = localStorage.getItem('jwt');
      Promise.all([api.getUserInfo(), api.getCards()])
        .then(([info, cards]) => {

          if (token) {
            setEmail(info.email);
            // console.log(`setCurrentUser ===> `);
            setCurrentUser(info);
            // handleUpdateUser(info);
            // handleUpdateAvatar(info);
            if (cards.length) {
              setCards(cards);
            }
          }
        })
        .catch((err) => console.log(`Ошибка promise.all: ${err}`));
    }


  }, [loggedIn]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    // console.log(`token =  ${token}`);

    if (token) {
      auth.checkToken(token)
        .then(user => {
          setLoggedIn(true);
          handleLogin(user);

          navigate('/');
        })
        .catch((err) => {
          console.error(`front> >>> APP.js >>> useEffect`);
          console.error(err);
        });
    }
  }, [navigate]);

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
              <Header isPageIndex email={email} onLogout={handleLogout} />
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