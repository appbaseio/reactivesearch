import styled from 'vue-emotion';

const Container = styled('div')`
	${({ theme }) => theme.component};
`;

export default Container;
