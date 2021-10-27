## Counter

Stores value in the Redux state and increments by 1.

## Selectors

### `useDataValue`

Returns data value from the store.

```javascript
import {useDataValue} from 'features/data';

// Needs to be run from inside React component or other hook.
const dat = useDataValue();
```

## Action creators

### `useSetData`

Replaces stored data value.

```javascript
import {useSetData} from 'features/data';

// Needs to be run from inside React component or other hook.
const setData = useSetData();
const handleClick = () => {
  useSetData();
};
```
