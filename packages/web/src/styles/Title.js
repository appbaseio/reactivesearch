import styled from '@emotion/styled';
import { lighten } from 'polished';

const Title = styled('h2')`
	margin: 0 0 8px;
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.titleColor};
`;

// Renders the number of items available in a list, alongside its title.
// Mirrors the muted treatment given to the per-item counts in FormControlList.
export const TitleCount = styled('span')`
	margin-left: 5px;
	font-weight: normal;
	color: ${({ theme }) => lighten(0.35, theme.colors.textColor)};
`;

export default Title;
