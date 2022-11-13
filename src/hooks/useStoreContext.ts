import React from 'react';
import { MagneticContext } from '../components/context';

export function useMagneticContext() {
  const contextValue = React.useContext(MagneticContext);

  if (process.env.NODE_ENV !== 'production' && !contextValue) {
    throw new Error(
      'could not find magnetic-state context value; please ensure the component is wrapped in a <Provider>'
    );
  }

  return contextValue;
}
