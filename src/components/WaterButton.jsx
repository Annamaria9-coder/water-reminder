import styled from 'styled-components';

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

function WaterButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      <WaterIcon>💧</WaterIcon>
    </Button>
  );
}

export default WaterButton;