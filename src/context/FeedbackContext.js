import createDataContext from './createDataContext';

const feedbackReducer = (state, action) => {
  switch (action.type) {
    case 'show_feedback':
      return { ...state, ...action.payload };
    case 'hide_feedback':
      return { ...state, open: false };
    default:
      return state;
  }
};

const initialState = {
  open: false,
  message: '',
  kind: '',
  duration: 1000,
};

const showFeedback = (dispatch) => (feedback) => {
  dispatch({
    type: 'show_feedback',
    payload: { ...feedback, open: true },
  });
};

const hideFeedback = (dispatch) => () => {
  dispatch({
    type: 'hide_feedback',
  });
};

export const { Provider, Context } = createDataContext(
  feedbackReducer,
  { showFeedback, hideFeedback },
  { ...initialState }
);
