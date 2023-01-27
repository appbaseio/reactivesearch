import { styled } from '@appbaseio/vue-emotion';

const InputGroup = styled('div')`
  display: flex;
  align-items: stretch;
  width: 100%;
`;

InputGroup.defaultProps = { className: 'input-group' };

export default InputGroup;
