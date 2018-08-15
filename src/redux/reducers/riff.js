import {
  RIFF_AUTHENTICATE_SUCCESS,
  RIFF_AUTHENTICATE_FAIL
} from '../constants/ActionTypes';

const initialState = {
  authToken: null,
  authError: null,
};

const riff = (state = initialState, action) => {
  switch(action.type) {
  case(RIFF_AUTHENTICATE_SUCCESS):
    return {...state, authToken: action.token, authError: null};
  case(RIFF_AUTHENTICATE_FAIL):
    return {...state, authToken: null, authError: action.error};
  default:
    return state;
  }
}

export default riff;
