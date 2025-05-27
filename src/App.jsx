import { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import WaterButton from './components/WaterButton';
import ReminderSettings from './components/ReminderSettings';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Space Mono', monospace;
    background-color: #f0f8ff;
    color: #333;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

const AppContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  width: 100%;
`;

const Title = styled.h1`
  color: #2196f3;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64b5f6;
  font-size: 1rem;
`;

const ProgressContainer = styled.div`
  width: 250px;
  margin: 2rem 0;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 2rem 0;
`;

const StatBox = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex: 1;
  margin: 0 0.5rem;
`;

const StatTitle = styled.p`
  font-size: 0.8rem;
  color: #64b5f6;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2196f3;
`;

// Animation keyframes for celebration effects
const fadeInOut = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  10% { opacity: 1; transform: scale(1.1); }
  90% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0; transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
  100% { transform: translateY(-40px) rotate(0deg); }
`;

const CelebrationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.9);
  animation: ${fadeInOut} 4s forwards;
  pointer-events: none;
`;

const CelebrationMessage = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2196f3;
  text-align: center;
  margin-bottom: 1rem;
`;

const WaterDropsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const WaterDrop = styled.div`
  position: absolute;
  font-size: ${props => props.size || '2rem'};
  left: ${props => props.left};
  top: ${props => props.top};
  animation: ${float} ${props => props.duration || '2s'} ease-in forwards;
  opacity: 0.8;
`;

const Celebration = () => {
  return (
    <CelebrationContainer>
      <CelebrationMessage>Goal Reached! 🎉</CelebrationMessage>
      <CelebrationMessage>Great job staying hydrated!</CelebrationMessage>
      <WaterDropsContainer>
        {[...Array(15)].map((_, i) => (
          <WaterDrop 
            key={i}
            left={`${Math.random() * 100}%`}
            top={`${Math.random() * 100}%`}
            size={`${1 + Math.random() * 2}rem`}
            duration={`${1 + Math.random() * 3}s`}
          >
            💧
          </WaterDrop>
        ))}
      </WaterDropsContainer>
    </CelebrationContainer>
  );
};

function App() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState(8); // Default goal: 8 glasses
  const [reminderInterval, setReminderInterval] = useState(10); // Changed default to 10 minutes for testing
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTimerId, setReminderTimerId] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === "granted");
      });
    }
  }, []);

  // Set up reminders whenever the interval changes or notifications are enabled
  useEffect(() => {
    // Clear any existing timer
    if (reminderTimerId) {
      clearInterval(reminderTimerId);
    }
    
    // Only set up a new timer if notifications are enabled
    if (notificationsEnabled) {
      const timerId = setInterval(() => {
        new Notification("Water Reminder", {
          body: "Time to drink a glass of water!",
          icon: "/water-icon.png"
        });
      }, reminderInterval * 60 * 1000);
      
      setReminderTimerId(timerId);
      
      // Send an immediate notification to confirm it's working
      new Notification("Water Reminder Activated", {
        body: `You'll be reminded every ${reminderInterval} minutes to drink water.`,
        icon: "/water-icon.png"
      });
    }
    
    // Cleanup function to clear the interval when component unmounts or dependencies change
    return () => {
      if (reminderTimerId) {
        clearInterval(reminderTimerId);
      }
    };
  }, [reminderInterval, notificationsEnabled]);

  // Add water intake
  const addWater = () => {
    const newIntake = waterIntake + 1;
    setWaterIntake(newIntake);
    
    // Check if goal is reached with this addition
    if (newIntake === goal) {
      setShowCelebration(true);
      // Hide celebration after 4 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 4000);
    }
  };

  // Reset water intake (for a new day)
  const resetWater = () => {
    setWaterIntake(0);
  };

  // Request notification permission
  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === "granted");
      });
    }
  };

  // Calculate progress percentage
  const progressPercentage = Math.min((waterIntake / goal) * 100, 100);

  return (
    <>
      <GlobalStyle />
      {showCelebration && <Celebration />}
      <AppContainer>
        <Header>
          <Title>Water Reminder</Title>
          <Subtitle>Stay hydrated throughout the day</Subtitle>
        </Header>
        
                <ProgressContainer>
                  <CircularProgressbar
                    value={progressPercentage}
                    text={`${waterIntake}/${goal}`}
                    styles={buildStyles({
                      textSize: '16px',
                      pathColor: `rgba(33, 150, 243, ${progressPercentage / 100})`,
                      textColor: '#2196f3',
                      trailColor: '#d6eaff',
                      backgroundColor: '#3e98c7',
                    })}
                  />
                </ProgressContainer>
                
                <WaterButton onClick={addWater} />
                
                <StatsContainer>
                  <StatBox>
                    <StatTitle>Glasses</StatTitle>
                    <StatValue>{waterIntake}</StatValue>
                  </StatBox>
                  <StatBox>
                    <StatTitle>Goal</StatTitle>
                    <StatValue>{goal}</StatValue>
                  </StatBox>
                  <StatBox>
                    <StatTitle>Remaining</StatTitle>
                    <StatValue>{Math.max(goal - waterIntake, 0)}</StatValue>
                  </StatBox>
                </StatsContainer>
                
                <ReminderSettings
                  reminderInterval={reminderInterval}
                  setReminderInterval={setReminderInterval}
                  notificationsEnabled={notificationsEnabled}
                  requestNotificationPermission={requestNotificationPermission}
                  goal={goal}
                  setGoal={setGoal}
                  resetWater={resetWater}
                />
              </AppContainer>
            </>
          );
        }
        
        export default App;
