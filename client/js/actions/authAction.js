import axios from 'axios';
import apiBaseUrl from '../url';

// This action contacts the server to create a user
export const createUser = (userDetails) => {
  return (dispatch) => {
    dispatch({ type: 'FETCH_USER' });
    axios.post(`${apiBaseUrl}/users`, userDetails)
      .then((response) => {
        dispatch({ type: 'FETCH_USER_RESOLVED', payload: response.data });
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_USER_REJECTED', payload: err.response.data });
      });
  };
};

// This action contacts the server to log in a user
export const loginUser = (userDetails) => {
  return (dispatch) => {
    dispatch({ type: 'LOGGING_USER' });
    axios.post(`${apiBaseUrl}/users/login`, userDetails)
      .then((response) => {
        dispatch({ type: 'LOGGING_USER_RESOLVED', payload: response.data });
      })
      .catch((err) => {
        dispatch({ type: 'LOGGING_USER_REJECTED', payload: err.response.data });
      });
  };
}

// This action wipes the user store
export const clearUser = () => {
  return { type: 'CLEAR_USER', }
}

// This action wipes any error that was in the user store
export const clearError = () => {
  return { type: 'CLEAR_ERROR', }
}
