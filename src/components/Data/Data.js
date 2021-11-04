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
const colAmount = 43;

const bodyWeightCalc = (thoseColumns, thisColumn) => {
  if (thisColumn.bodyWeight) return {res: thisColumn.bodyWeight};
  const gain = thisColumn.header === '+';
  const prevCol = thoseColumns[thoseColumns.length - 1];
  const prevWeight = prevCol.bodyWeight;
  const decrement = () => {
    const totalFat =
      prevCol.extremities + prevCol.stomach + prevCol.hips + prevCol.thighs;
    return Math.min(weightIncrement, totalFat);
  };
  return typeof prevWeight === 'undefined'
    ? {res: leanMass + weightIncrement}
    : {res: prevWeight + (gain ? weightIncrement : -decrement())};
};

const totalFatCalc = (thoseColumns, thisColumn) => {
  if (thisColumn.totalFat) return {res: thisColumn.totalFat};
  if (typeof thisColumn.bodyWeight === 'undefined')
    return {insufficientData: true};
  const result =
    ((thisColumn.bodyWeight - leanMass) * 100) / thisColumn.bodyWeight;
  return {res: `${result.toFixed(1)}%`};
};

const generalBodyPart = (thoseColumns, thisColumn, part, ratio) => {
  if (thisColumn[part]) return thisColumn[part];
  if (typeof thisColumn.bodyWeight === 'undefined')
    return {insufficientData: true};
  const prevCol = thoseColumns[thoseColumns.length - 1];
  const prevFat = prevCol[part];
  const prevBodyWeight = thoseColumns[thoseColumns.length - 1].bodyWeight;
  const gain = thisColumn.bodyWeight - prevBodyWeight;
  return gain * ratio + prevFat;
};

const fatGroupCalc = parts => (thoseColumns, thisColumn) => {
  let deficit = 0;
  const partValues = {};
  const remainingRatios = {};

  // remove fat
  parts.forEach(part => {
    const ratio = ratios[part][thisColumn.header === '+' ? 'up' : 'down'];
    const val = generalBodyPart(thoseColumns, thisColumn, part, ratio);
    // cant remove fat from 0, so store/add to deficit
    if (val < 0) {
      deficit += val * -1;
      partValues[part] = 0;
    } else {
      remainingRatios[part] = ratio;
      partValues[part] = val;
    }
  });
  if (deficit > 0) {
    // redistribute remaining fat (deficit)
    const ratioSum = Object.keys(remainingRatios).reduce(
      (acc, k) => acc + remainingRatios[k],
      0
    );
    // const prevCol = thoseColumns[thoseColumns - 1];
    parts
      .filter(v => partValues[v] > 0)
      .forEach(part => {
        const adjustedRatio = remainingRatios[part] / ratioSum;
        partValues[part] -= deficit * adjustedRatio;
      });
  }
  return {res: partValues};
};

const headerCalc = (storeData, col) => {
  const val = storeData[0]?.[col]?.value;
  return {res: val ?? '+'};
};

const extremitiesCalc = (thoseColumns, thisColumn) => {
  if (thisColumn.extremities) return {res: thisColumn.extremities};
  if (typeof thisColumn.fatDistribution === 'undefined') {
    return {insufficientData: true};
  }
  return {res: thisColumn.fatDistribution.extremities};
};

const stomachCalc = (thoseColumns, thisColumn) => {
  if (thisColumn.stomach) return {res: thisColumn.stomach};
  if (typeof thisColumn.fatDistribution === 'undefined') {
    return {insufficientData: true};
  }
  return {res: thisColumn.fatDistribution.stomach};
};

const hipsCalc = (thoseColumns, thisColumn) => {
  if (thisColumn.hips) return {res: thisColumn.hips};
  if (typeof thisColumn.fatDistribution === 'undefined') {
    return {insufficientData: true};
  }
  return {res: thisColumn.fatDistribution.hips};
};

const thighsCalc = (thoseColumns, thisColumn) => {
  if (thisColumn.thighs) return {res: thisColumn.thighs};
  if (typeof thisColumn.fatDistribution === 'undefined') {
    return {insufficientData: true};
  }
  return {res: thisColumn.fatDistribution.thighs};
};

const colData = [
  {
    order: 0,
    key: 'header',
    name: '',
    init: 'Lean Body Weight',
    func: headerCalc,
  },
  {order: 2, key: 'totalFat', name: 'Total Fat %', init: 0, func: totalFatCalc},
  {
    order: 1,
    key: 'bodyWeight',
    name: 'Body Weight lbs',
    init: leanMass,
    func: bodyWeightCalc,
  },
  {
    order: 3,
    key: 'fatDistribution',
    name: 'Fat Distribution',
    init: '',
    // func: () => {},
    func: fatGroupCalc(['extremities', 'stomach', 'hips', 'thighs']),
    hide: true,
  },
  {
    order: 4,
    key: 'extremities',
    name: 'Extremities',
    init: 0,
    func: extremitiesCalc,
  },
  {order: 5, key: 'stomach', name: 'Stomach', init: 0, func: stomachCalc},
  {order: 6, key: 'hips', name: 'Hips', init: 0, func: hipsCalc},
  {order: 7, key: 'thighs', name: 'Thighs', init: 0, func: thighsCalc},
];

const Data = () => {
  const storeData = useDataValue();
  const setStoreData = useSetData();

  const recursiveFunc = useCallback(
    (outerAcc, col, prevAcc) => {
      let insufficientFlags = [];
      const data = colData.reduce((acc, row) => {
        switch (col) {
          case 0:
            return {...acc, [row.key]: row.name};
          case 1:
            return {...acc, [row.key]: row.init};
          default: {
            const result =
              row.key === 'header'
                ? row.func?.(storeData, col)
                : row.func?.(outerAcc, acc);
            if (result?.insufficientData) {
              insufficientFlags = [...insufficientFlags, row.key];
              return acc;
            }
            insufficientFlags = insufficientFlags.filter(v => v !== row.key);
            return {...acc, [row.key]: result?.res};
          }
        }
      }, prevAcc ?? {});
      return insufficientFlags.length
        ? recursiveFunc(outerAcc, col, data)
        : data;
    },
    [storeData]
  );

  const cols = useCallback(
    () =>
      [...Array(colAmount)].reduce((outerAcc, _, i) => {
        const col = recursiveFunc(outerAcc, i);
        const processedCol = Object.keys(col).reduce((acc, k) => {
          if (i > 0 && colData.find(v => v.key === k)?.hide) {
            col[k] = '';
          }
          acc[k] = col[k];
          return acc;
        }, {});
        return [...outerAcc, processedCol];
      }, []),
    [recursiveFunc]
  );

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

  useEffect(() => {
    const data = colsToRows(cols()).map((row, i) => {
      if (i > 3) {
        return row.map((v, col) => {
          return col > 1 ? {value: v.value.toFixed(1)} : v;
        });
      }
      return row;
    });
    setStoreData(data);
  }, []);

  const handleChange = e => {
    const arr = e.map((a, row) =>
      a.map((v, col) => {
        if (
          row === 0 &&
          col > 1 &&
          storeData[row][col].value !== e[row][col].value
        ) {
          return v.value.indexOf('+') > -1 ? {value: '-'} : {value: '+'};
        }
        return {value: v.value};
      })
    );
    setStoreData(arr);
  };

  // return <div>Hi</div>;
  return <Spreadsheet data={storeData} onChange={handleChange} />;
};

export default Data;
