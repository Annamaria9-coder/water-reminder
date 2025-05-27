import { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
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

function App() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState(8); // Default goal: 8 glasses
  const [reminderInterval, setReminderInterval] = useState(10); // Changed default to 10 minutes for testing
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTimerId, setReminderTimerId] = useState(null);

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
    setWaterIntake(prev => prev + 1);
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
      <AppContainer>
        <Header>
          <Title>Water Reminder</Title>
          <Subtitle>Stay hydrated throughout the day</Subtitle>
        </Header>
        
        // In the return statement, update the WaterButton section:
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
