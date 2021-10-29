import React, {useEffect, useCallback} from 'react';
import Spreadsheet from 'react-spreadsheet';
import {useDataValue, useSetData} from 'features/data';
import classes from './Data.module.css';

const leanMass = 110;
const weightIncrement = 5;
const ratios = {
  extremities: {up: 0.2, down: 0.3},
  stomach: {up: 0.3, down: 0.2},
  hips: {up: 0.25, down: 0.25},
  thighs: {up: 0.25, down: 0.25},
};
const colAmount = 10;
const staticColAmount = 2;

const generalFunc = (colsRemaining, nextFunc, acc) => {
  const currResult = acc
    ? [...acc, nextFunc(acc[acc.length - 1])]
    : [nextFunc()];
  return colsRemaining
    ? generalFunc(colsRemaining - 1, nextFunc, currResult)
    : currResult;
};

const Data = () => {
  const storeData = useDataValue();
  const setStoreData = useSetData();

  const nextBodyWeight = val =>
    val ? val + weightIncrement : leanMass + weightIncrement;

  const nextTotalFat = val => (val ? leanMass / val / 100 : 0);

  const nextExtemities = val =>
    val ? val + weightIncrement : leanMass + weightIncrement;

  const nextStomach = val =>
    val ? val + weightIncrement : leanMass + weightIncrement;

  const nextHips = val =>
    val ? val + weightIncrement : leanMass + weightIncrement;

  const nextThighs = val =>
    val ? val + weightIncrement : leanMass + weightIncrement;

  const rowData = [
    {name: '', init: 'Lean Body Weight', func: () => []},
    {name: 'Body Weight', init: leanMass, func: nextBodyWeight},
    {name: 'Total Fat %', init: 0, func: nextTotalFat},
    {name: 'Fat Distribution', init: '', func: () => []},
    {name: 'Extemities', init: 0, func: nextExtemities},
    {name: 'Stomach', init: 0, func: nextStomach},
    {name: 'Hips', init: 0, func: nextHips},
    {name: 'Thighs', init: 0, func: nextThighs},
  ];

  // ['Body Weight', leanMass]
  const rows = useCallback(
    rowData.map(row => [
      ...[row.name, row.init],
      ...generalFunc(colAmount - staticColAmount, row.func),
    ]),
    [colAmount, staticColAmount]
  );

  const getRow = row =>
    [...Array(colAmount)].map((_, i) => {
      // if (i > 2) {
      //   return {value: row.func?.(i)};
      // }
      return {value: row[i]};
    });

  const newData = useCallback(() => rows.map(row => getRow(row)), [rows]);
  useEffect(() => setStoreData(newData()), [setStoreData, newData]);

  const handleClick = () => setStoreData(newData());
  const handleChange = e => console.log(e);

  return (
    <>
      <button className={classes.button} type="button" onClick={handleClick}>
        click
      </button>
      <Spreadsheet data={storeData} onChange={handleChange} />
    </>
  );
};

export default Data;
