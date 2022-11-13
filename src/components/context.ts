import { Store } from '../typeHelper';
import React from 'react';

export const MagneticContext = React.createContext<Store<any>>(null as any);

if (process.env.NODE_ENV !== 'production') {
  MagneticContext.displayName = 'MagnetState';
}
