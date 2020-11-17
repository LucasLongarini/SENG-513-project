import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import './AuthenticationView.css';
import Background from '../../assets/images/Authpage_background.jpg';
import LoginView from './Components/LoginView/LoginView';
import StartView from './Components/StartView/StartView';
import Views from './State/Views';

function AuthenticationView() {
  
  const [views, setView] = useState(Views.Start);


  let renderedView;
  switch (views) {
    case Views.Start:
      renderedView = (<StartView setView={setView}/>);
      break;
    case Views.Login:
      renderedView = (<LoginView setView={setView}/>)
      break;
    case Views.Register:
      //TODO change
      renderedView = (<StartView />);
      break;
  }

  return (
    <div className='authentication-view' style={{ backgroundImage: `url(${Background})` }}>
        <Container className='authentication-container' maxWidth='sm'>
          {renderedView}
        </Container>
    </div>
  );
}

export default AuthenticationView;