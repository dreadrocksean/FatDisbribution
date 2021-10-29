import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {SET_DATA} from './actionTypes';

const useSetData = () => {
  const dispatch = useDispatch();
  return useCallback(
    data => {
      dispatch({
        type: SET_DATA,
        value: data,
      });
    },
    [dispatch]
  );
};

export default useSetData;
