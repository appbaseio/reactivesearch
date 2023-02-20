import styled from '@emotion/styled';

const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 23px;
	width: max-content;
	cursor: pointer;
	height: 100%;
	min-width: 20px;
	svg,
	svg g#el_D93PK3GbmJ {
		fill: ${({ theme }) => theme.colors.primaryColor};
	}
	svg.search-icon {
		transform: scale(1.25);
	}

	svg.cancel-icon {
		fill: ${({ theme }) => theme.colors.borderColor || '#000'};
	}
	svg.--listen-svg {
		fill: ${({ theme }) => (theme.colors ? theme.colors.primaryColor : '#707070')};
		filter: hue-rotate(-10deg);
		#el_-Vm65Ltfy7,
		#el_9bggsfQOtU,
		#el_zclQ34fvf7,
		#el_aa9sjx4H0vA,
		#el_z5u6RAFhx7d,
		#el__ZcqlS20zcw,
		#el_FYYKCI_u24e,
		#el_RMT1KUfbdF8,
		#el_uzZNtK32Zi,
		g#el_QJeJ_2CDw5 > path:first-child {
			fill: ${({ theme }) =>
	(theme.colors ? theme.colors.primaryColor : '#707070')} !important;
			filter: hue-rotate(-10deg) !important;
		}
	}
`;

export const ButtonIconWrapper = styled(IconWrapper)`
	border-radius: 4px;
	vertical-align: middle;
	height: 25px;
	font-size: 12px;
	border: 1px solid ${({ theme }) => (theme.colors ? theme.colors.primaryColor : '#000')};
	color: ${({ theme }) => (theme.colors ? theme.colors.primaryColor : '#000')};
	max-width: unset;
	padding: 5px;
`;

export default IconWrapper;
