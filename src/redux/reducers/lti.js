import { LTI_LOGIN_USER,
         LTI_LOGOUT_USER,
       } from '../constants/ActionTypes';

const initialState =
  {
    loggedIn: false,
    user:
    {
      id: '',
      email: '',
      fullName: '',
      group: '',
    },
    context:
    {
      id: '',
      title: '',
      label: '',
      courseSectionId: '',
    },
  };

const lti = (state = initialState, action) =>
{
  switch (action.type)
  {
    case LTI_LOGIN_USER:
      let newState = { loggedIn: true,
                       user: { ...action.ltiState.user },
                       context: { ...action.ltiState.context },
                     };
      return newState;

    case LTI_LOGOUT_USER:
      return initialState;

    default:
      return state;
  };
};

export default lti;
