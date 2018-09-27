import { LTI_INITIALIZE_USER } from '../constants/ActionTypes';

const initialState = {
  ltiUser: false,
  isValid: false,
  ltiUserId: '',
  ltiUserEmail: '',
  ltiUserFullName: '',
  ltiContextId: '',
  ltiContextTitle: '',
  ltiContextLabel: '',
  ltiCourseSectionId: ''
};

const ltiUser = (state = initialState, action) => {
  switch(action.type) {
  case(LTI_INITIALIZE_USER):
    return action.ltiState;
  default:
    return state;
  };
};

export default ltiUser;
