import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {renderHook} from '@testing-library/react-hooks';
import useDataValue from './selectors';

describe('features > data > useDataValue', () => {
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

  it('returns count value', () => {
    /**
     * Render hook, using testing-library utility
     * @see https://react-hooks-testing-library.com/reference/api#renderhook
     */
    const {result} = renderHook(() => useDataValue(), {
      wrapper: ({children}) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toBe(value);
  });
});
