import {SET_DATA} from './actionTypes';
import DataReducer from './DataReducer';

describe('features > data > DataReducer', () => {
  /**
   * All test cases are very simple, since Redux
   * reducers are pure functions
   */
  it('returns initial state, if non matched action is dispatched', () => {
    const initialState = {
      value: 0,
    };

    const action = {
      type: 'FOO',
    };

    expect(DataReducer(initialState, action)).toBe(initialState);
  });

  it(`returns state with incremented value, if ${SET_DATA} action is dispatched`, () => {
    const initialState = {
      value: 0,
    };

    /** State we expect after action dispatched */
    const expectedState = {
      value: 1,
    };

    const action = {
      type: SET_DATA,
      value: expectedState.value,
    };
    /**
     * Use `toEqual` matcher instead of `toBe`,
     * since latter assumes object equality
     */
    expect(DataReducer(initialState, action)).toEqual(expectedState);
  });
});
