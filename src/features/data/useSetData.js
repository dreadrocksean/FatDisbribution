import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import useDataValue from './selectors';
import {SET_DATA} from './actionTypes';

const useSetData = () => {
  const dispatch = useDispatch();
  const data = useDataValue();
  return useCallback(() => {
    dispatch({
      type: SET_DATA,
      value: data,
    });
  }, [data, dispatch]);
};

export default useSetData;
