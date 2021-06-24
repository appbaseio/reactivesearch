import styled from '@appbaseio/vue-emotion';

const InputAddon = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 400;
  padding: 2px 11px;
  position: relative;
  transition: all 0.3s;
  box-sizing: border-box;
  overflow: hidden;

  &:first-of-type {
    border-right: none;
  }
  &:last-of-type {
    border-left: none;
  }
`;

InputAddon.defaultProps = { className: 'input-addon' };

export default InputAddon;
