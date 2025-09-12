// Заглушка для react-native-maps на веб-платформе
import React from 'react';

export const MapView = () => React.createElement('div', { style: { height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, 'Карта недоступна на веб-платформе');

export const Marker = () => React.createElement('div');

export const PROVIDER_GOOGLE = 'google';

export default MapView;



