import styled from 'styled-components'
import { Box } from '../../components/Box'
import { lightColors } from '../../theme/colors'

const ProgressWrapper = styled(Box)<{ isPresale?: boolean }>`
  & :first-child {
    height: ${({ isPresale }) => (isPresale ? '10px' : '6px')};
    background: ${lightColors.inputColor};
    box-shadow: none;
    & :first-child {
      background: ${lightColors.linkColor};
      height: ${({ isPresale }) => (isPresale ? '10px' : '6px')};
    }
    & :nth-child(2) {
      background: ${lightColors.primaryDark};
      height: ${({ isPresale }) => (isPresale ? '10px' : '6px')};
    }
  }
`
export default ProgressWrapper
