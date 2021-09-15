/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, DependencyList } from 'react';
import { isEqual as _isEqual, cloneDeep as _cloneDeep } from 'lodash';

export default function useDeepMemo<T>(
  factory: () => T,
  deps: DependencyList
): T {
  const depsRef = useRef<DependencyList>([]);
  const valueRef = useRef<T>();

  const isSame =
    depsRef.current.length &&
    depsRef.current.every((obj, index) => {
      //if dependency element is array
      if (Array.isArray(obj) && obj.length > 0) {
        return obj.every((temp, i) => _isEqual(temp, deps[index][i]));
      }

      return _isEqual(obj, deps[index]);
    });

  if (!isSame || !valueRef.current) {
    //need to do deep cloning because spread creates shallow copy
    depsRef.current = _cloneDeep(deps);
    valueRef.current = factory();
  }

  return valueRef.current;
}
