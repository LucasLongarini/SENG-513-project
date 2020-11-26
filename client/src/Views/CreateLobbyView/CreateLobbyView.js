import { React, useEffect } from 'react';
import Background from '../../assets/images/Authpage_background.jpg';
import ParticipantView  from './Components/ParticipantView/ParticipantView';
import CustomizeView  from './Components/CustomizeView/CustomizeView';
import './CreateLobbyView.css'

// Should get a prop 'isHost' from the lobby view, if not then the user is a guest
function CreateLobbyView(props) {

  useEffect(() => {
    
  }, []);

  return (
    <div className='CreateLobbyView' style={{ backgroundImage: `url(${Background})` }}>     
        <div className='CreateLobbyView-container'>
            <ParticipantView />
            <CustomizeView />
        </div>
    </div>
  );
}

export default CreateLobbyView;