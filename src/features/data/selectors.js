import {useSelector} from 'react-redux';

/**
 * Custom React Hook to get data value from state.
 * @see https://reactjs.org/docs/hooks-custom.html
 */
const useDataValue = () => useSelector(state => state.data);

export default useDataValue;
