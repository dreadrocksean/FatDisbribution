import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {renderHook} from '@testing-library/react-hooks';
import {SET_DATA} from './actionTypes';
import useSetData from './useSetData';

describe('features > counter > useSetData', () => {
  /** Create mock store with the count value */
  const mockStore = configureStore([]);
  const value = [
    [{value: 'Vanilla'}, {value: 'Chocolate'}],
    [{value: 'Strawberry'}, {value: 'Cookies'}],
  ];
  const store = mockStore({
    data: {
      value,
    },
  });

  /**
   * Add spy to watch for store.dispatch method.
   * @see https://jestjs.io/docs/en/jest-object#jestspyonobject-methodname
   */
  jest.spyOn(store, 'dispatch');

  /**
   * Jest hook which runs before each test,
   * @see https://jestjs.io/docs/en/api#beforeeachfn-timeout
   */
  beforeEach(() => {
    /**
     * Clear any saved mock data from previous tests,
     * because jest saves calls data for spies and mocks.
     * @see https://jestjs.io/docs/en/mock-function-api#mockfnmockclear
     */
    store.dispatch.mockClear();
  });

  it('returns function', () => {
    /**
     * Render hook, using testing-library utility
     * @see https://react-hooks-testing-library.com/reference/api#renderhook
     */
    const {result} = renderHook(() => useSetData(), {
      wrapper: ({children}) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toBeInstanceOf(Function);
  });

  describe('incrementCounter', () => {
    it('increments counter value by 1', () => {
      const {result} = renderHook(() => useSetData(), {
        wrapper: ({children}) => <Provider store={store}>{children}</Provider>,
      });

      result.current();

      /** store.dispatch should be run once */
      expect(store.dispatch).toHaveBeenCalledTimes(1);

      /** store.dispatch should be run with proper action */
      expect(store.dispatch).toHaveBeenCalledWith({
        type: SET_DATA,
        value,
      });
    });
  });
});
