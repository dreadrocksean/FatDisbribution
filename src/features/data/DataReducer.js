import {SET_DATA, ADD_DATA} from './actionTypes';

const initialState = [
  [{value: 'Jan'}, {value: 'Feb'}],
  [
    {value: Math.floor(Math.random() * 10)},
    {value: Math.floor(Math.random() * 10)},
  ],
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
