import styled from 'styled-components';

const SettingsContainer = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
`;

const SettingsTitle = styled.h2`
  font-size: 1.2rem;
  color: #2196f3;
  margin-bottom: 1rem;
`;

const SettingsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f5f9ff;
  border-radius: 8px;
  border: 1px solid #e0e9f5;
`;

const SettingsLabel = styled.label`
  font-size: 0.9rem;
  color: #555;
  font-weight: bold;
`;

const Select = styled.select`
  font-family: 'Space Mono', monospace;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 1px solid #2196f3;
  background-color: white;
  min-width: 150px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.3);
  }
`;

const ResetButton = styled.button`
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.75rem 1.5rem;
  font-family: 'Space Mono', monospace;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
  font-weight: bold;
  
  &:hover {
    background-color: #ff1744;
  }
`;

const NotificationRow = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${props => props.enabled ? '#e8f5e9' : '#ffebee'};
  border-radius: 8px;
  border: 1px solid ${props => props.enabled ? '#c8e6c9' : '#ffcdd2'};
`;

const NotificationButton = styled.button`
  background-color: ${props => props.enabled ? '#4caf50' : '#2196f3'};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-family: 'Space Mono', monospace;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 1rem;
  
  &:hover {
    background-color: ${props => props.enabled ? '#388e3c' : '#1976d2'};
  }
`;

const NotificationStatus = styled.div`
  font-size: 0.9rem;
  color: ${props => props.enabled ? '#388e3c' : '#d32f2f'};
  font-weight: bold;
  flex: 1;
`;

const TestButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-family: 'Space Mono', monospace;
  cursor: pointer;
  margin-top: 1rem;
  margin-left: 1rem;
`;

function ReminderSettings({ 
  reminderInterval, 
  setReminderInterval, 
  notificationsEnabled,
  requestNotificationPermission,
  goal,
  setGoal,
  resetWater
}) {
  
  const testNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Water Reminder Test", {
          body: "This is a test notification. Notifications are working!",
          icon: "/vite.svg" // Using a known existing icon
        });
      } catch (error) {
        console.error("Error sending test notification:", error);
        alert("Error sending test notification: " + error.message);
      }
    } else {
      alert("Notifications are not enabled. Please enable them using the button below.");
    }
  };

  return (
    <SettingsContainer>
      <SettingsTitle>Settings</SettingsTitle>
      
      <SettingsRow>
        <SettingsLabel>Daily Goal:</SettingsLabel>
        <Select 
          value={goal} 
          onChange={(e) => setGoal(Number(e.target.value))}
        >
          {[4, 6, 8, 10, 12].map(num => (
            <option key={num} value={num}>{num} glasses</option>
          ))}
        </Select>
      </SettingsRow>
      
      <SettingsRow>
        <SettingsLabel>Reminder Interval:</SettingsLabel>
        <Select 
          value={reminderInterval} 
          onChange={(e) => setReminderInterval(Number(e.target.value))}
        >
          <option value={1}>1 minute (Testing)</option>
          <option value={5}>5 minutes (Testing)</option>
          <option value={10}>10 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </Select>
      </SettingsRow>
      
      <NotificationRow enabled={notificationsEnabled}>
        <NotificationStatus enabled={notificationsEnabled}>
          {notificationsEnabled 
            ? "✅ Notifications enabled" 
            : "❌ Notifications disabled"}
        </NotificationStatus>
        <NotificationButton 
          enabled={notificationsEnabled}
          onClick={notificationsEnabled ? testNotification : requestNotificationPermission}
        >
          {notificationsEnabled ? "Test Notification" : "Enable Notifications"}
        </NotificationButton>
      </NotificationRow>
      
      <div style={{ display: 'flex', marginTop: '1rem' }}>
        <ResetButton onClick={resetWater}>
          Reset Counter
        </ResetButton>
        {notificationsEnabled && (
          <TestButton onClick={testNotification}>
            Test Notification Now
          </TestButton>
        )}
      </div>
    </SettingsContainer>
  );
}

export default ReminderSettings;