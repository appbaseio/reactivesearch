// Use children as fallback if the passed item is null
export const FallbackRender = ({ item, children }) => (item || children);

export default FallbackRender;
