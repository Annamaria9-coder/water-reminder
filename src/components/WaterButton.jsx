import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
`;

const ButtonLabel = styled.div`
  color: #2196f3;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  text-align: center;
`;

const Button = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  font-size: 1rem;
  font-family: 'Space Mono', monospace;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(33, 150, 243, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;
  position: relative;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(33, 150, 243, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const WaterIcon = styled.div`
  font-size: 2rem;
`;

const ClickIndicator = styled.div`
  position: absolute;
  top: -15px;
  right: -15px;
  background-color: #ff5722;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

function WaterButton({ onClick }) {
  return (
    <ButtonContainer>
      <ButtonLabel>Click to add water</ButtonLabel>
      <Button onClick={onClick}>
        <WaterIcon>💧</WaterIcon>
        <ClickIndicator>+1</ClickIndicator>
      </Button>
    </ButtonContainer>
  );
}

export default WaterButton;