import React from 'react';
import Spreadsheet from 'react-spreadsheet';
import {useDataValue, useSetData} from 'features/data';

const Data = () => {
  /**
   *  Get data value from Redux store. We defined selector
   *  (state => state.data) inside data feature folder,
   *  to make component global state agnostic
   */
  const data = useDataValue();
  console.log('TCL: Data -> data', data);

  /** Create data action, using custom hook from feature */
  const setData = useSetData;

  return <Spreadsheet data={data} onChange={setData} />;
};

export default Data;
