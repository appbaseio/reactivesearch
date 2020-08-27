
// eslint-disable-next-line
export const hasGoogleMap = () =>
	typeof window.google === 'object' && typeof window.google.maps === 'object';
