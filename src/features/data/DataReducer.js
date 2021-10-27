import {SET_DATA, ADD_DATA} from './actionTypes';

const initialState = [
  [{value: 'Vanilla'}, {value: 'Chocolate'}],
  [{value: 'Strawberry'}, {value: 'Cookies'}],
];

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return action.value;

    case ADD_DATA:
      return [...state, action.value];

    default:
      return state;
  }
};

export default reducer;
