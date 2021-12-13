import React from 'react';
import { StyledStopButton } from './styles/StyledStartButton';

const StopButton = ({ callback }) => (
  <StyledStopButton onClick={callback}>Stop Game</StyledStopButton>
)

export default StopButton;