import React from 'react';
import Background from '../../assets/images/Authpage_background.jpg';
import ParticipantView  from './Components/ParticipantView/ParticipantView';
import CustomizeView  from './Components/CustomizeView/CustomizeView';
import Container from '@material-ui/core/Container';
import './CreateLobbyView.css'

function CreateLobbyView(props) {
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