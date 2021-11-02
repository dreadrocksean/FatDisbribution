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

// const generalFunc = (colsRemaining, func, acc) => {
//   const currResult = acc
//     ? [...acc, func(acc[acc.length - 1])]
//     : [func()];
//   return colsRemaining
//     ? generalFunc(colsRemaining - 1, func, currResult)
//     : currResult;
// };

const bodyWeightCalc = (thoseColumns, thisColumn) => {
  if (thisColumn.bodyWeight) return {res: thisColumn.bodyWeight};
  const prevVal = thoseColumns[thoseColumns.length - 1].bodyWeight;
  return typeof prevVal === 'undefined'
    ? {res: leanMass + weightIncrement}
    : {res: prevVal + weightIncrement};
};

const totalFatCalc = (thoseColumns, thisColumn) => {
  if (thisColumn.totalFat) return {res: thisColumn.totalFat};
  if (typeof thisColumn.bodyWeight === 'undefined')
    return {insufficientData: true};
  const result =
    ((thisColumn.bodyWeight - leanMass) * 100) / thisColumn.bodyWeight;
  return {res: `${result.toFixed(1)}%`};
};

const extemitiesCalc = val => ({res: 0});
// val ? val + weightIncrement : leanMass + weightIncrement;

const stomachCalc = val => ({res: 0});
// val ? val + weightIncrement : leanMass + weightIncrement;

const hipsCalc = val => ({res: 0});
// val ? val + weightIncrement : leanMass + weightIncrement;

const thighsCalc = val => ({res: 0});
// val ? val + weightIncrement : leanMass + weightIncrement;

const colData = [
  {order: 0, key: 'header', name: '', init: 'Lean Body Weight', func: () => {}},
  {order: 2, key: 'totalFat', name: 'Total Fat %', init: 0, func: totalFatCalc},
  {
    order: 1,
    key: 'bodyWeight',
    name: 'Body Weight',
    init: leanMass,
    func: bodyWeightCalc,
  },
  {
    order: 3,
    key: 'fatDistribution',
    name: 'Fat Distribution',
    init: '',
    func: () => [],
  },
  {
    order: 4,
    key: 'extemities',
    name: 'Extemities',
    init: 0,
    func: extemitiesCalc,
  },
  {order: 5, key: 'stomach', name: 'Stomach', init: 0, func: stomachCalc},
  {order: 6, key: 'hips', name: 'Hips', init: 0, func: hipsCalc},
  {order: 7, key: 'thighs', name: 'Thighs', init: 0, func: thighsCalc},
];

const Data = () => {
  const storeData = useDataValue();
  const setStoreData = useSetData();

  const cols = useCallback(
    () =>
      [...Array(10)].reduce((outerAcc, _, i) => {
        const col = recursiveFunc(outerAcc, i);
        return [...outerAcc, col];
      }, []),
    []
  );

  const recursiveFunc = (outerAcc, col, prevAcc) => {
    let insufficientFlags = [];
    const data = colData.reduce((acc, row) => {
      switch (col) {
        case 0:
          return {...acc, [row.key]: row.name};
        case 1:
          return {...acc, [row.key]: row.init};
        default: {
          const result = row.func?.(outerAcc, acc);
          if (result?.insufficientData) {
            insufficientFlags = [...insufficientFlags, row.key];
            return acc;
          }
          insufficientFlags = insufficientFlags.filter(v => v !== row.key);
          return {...acc, [row.key]: result?.res};
        }
      }
    }, prevAcc ?? {});
    return insufficientFlags.length ? recursiveFunc(outerAcc, col, data) : data;
  };

  const colsToRows = useCallback(
    columns =>
      [...(Array(Object.values(columns?.[0])?.length) ?? [])].map((_, i) =>
        columns.reduce((acc, col) => {
          const sortedKeys = [...colData]
            .slice(0)
            .sort((a, b) => a.order - b.order)
            .map(v => v.key);
          return [...acc, {value: col[sortedKeys[i]]}];
        }, [])
      ),
    []
  );

  const newData = useCallback(() => colsToRows(cols()), [cols, colsToRows]);
  useEffect(() => {
    setStoreData(newData());
  }, [setStoreData, newData]);

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
