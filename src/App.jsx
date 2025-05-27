import { useState, useEffect, useRef } from 'react';
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

// Add these new styled components for the popup reminder
const popIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  85% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const ReminderPopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: ${popIn} 0.5s forwards, ${shake} 0.5s 0.5s;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  width: 350px;
`;

const ReminderIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ReminderTitle = styled.h2`
  color: #2196f3;
  margin-bottom: 1rem;
  text-align: center;
`;

const ReminderText = styled.p`
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.1rem;
`;

const ReminderButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.75rem 1.5rem;
  font-family: 'Space Mono', monospace;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #1976d2;
  }
`;


function App() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState(8);
  const [reminderInterval, setReminderInterval] = useState(10);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Default to true for our new system
  const [reminderTimerId, setReminderTimerId] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const audioRef = useRef(null);
  
  // Set up audio element
  useEffect(() => {
    // Create audio element
    const audio = new Audio('/audio/water-drop.mp3');
    audio.volume = 0.7;
    audioRef.current = audio;
    
    return () => {
      // Clean up
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Set up reminders whenever the interval changes or notifications are enabled
  useEffect(() => {
    console.log("Setting up reminder effect. Enabled:", notificationsEnabled);
    
    // Clear any existing timer
    if (reminderTimerId) {
      console.log("Clearing existing timer");
      clearInterval(reminderTimerId);
      setReminderTimerId(null);
    }
    
    // Only set up a new timer if notifications are enabled
    if (notificationsEnabled) {
      try {
        // Convert minutes to milliseconds for the interval
        const intervalMs = reminderInterval * 60 * 1000;
        console.log(`Setting up reminder timer for ${reminderInterval} minutes (${intervalMs}ms)`);
        
        const timerId = setInterval(() => {
          console.log("Timer triggered - showing reminder");
          try {
            // Play sound
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(e => console.error("Error playing audio:", e));
            }
            
            // Show popup
            setShowReminder(true);
            
            // Vibrate if supported
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
          } catch (error) {
            console.error("Error showing reminder:", error);
          }
        }, intervalMs);
        
        setReminderTimerId(timerId);
        
        // Send an immediate test notification
        console.log("Setting up first reminder");
      } catch (error) {
        console.error("Error setting up reminder timer:", error);
      }
    }
    
    // Cleanup function to clear the interval when component unmounts or dependencies change
    return () => {
      if (reminderTimerId) {
        console.log("Cleanup: clearing timer");
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

  // Toggle notifications
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled) {
      // If enabling, show a test reminder after 3 seconds
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
        setShowReminder(true);
      }, 3000);
    }
  };

  // Dismiss reminder
  const dismissReminder = () => {
    setShowReminder(false);
  };

  // Calculate progress percentage
  const progressPercentage = Math.min((waterIntake / goal) * 100, 100);

  return (
    <>
      <GlobalStyle />
      {showCelebration && <Celebration />}
      {showReminder && (
        <ReminderPopup>
          <ReminderIcon>💧</ReminderIcon>
          <ReminderTitle>Time to Hydrate!</ReminderTitle>
          <ReminderText>It's time to drink a glass of water. Stay hydrated for better health!</ReminderText>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <ReminderButton onClick={() => { addWater(); dismissReminder(); }}>
              I Drank Water
            </ReminderButton>
            <ReminderButton onClick={dismissReminder} style={{ backgroundColor: '#9e9e9e' }}>
              Remind Later
            </ReminderButton>
          </div>
        </ReminderPopup>
      )}
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
          requestNotificationPermission={toggleNotifications}
          goal={goal}
          setGoal={setGoal}
          resetWater={resetWater}
        />
      </AppContainer>
    </>
  );
}

export default App;
