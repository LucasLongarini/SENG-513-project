import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import './AuthenticationView.css';
import Background from '../../assets/images/Authpage_background.jpg';
import LoginView from './Components/LoginView/LoginView';
import StartView from './Components/StartView/StartView';
import RegisterView from './Components/RegisterView/RegisterView';
import Views from './State/Views';

function AuthenticationView(props) {
  
  const [views, setView] = useState(Views.Start);
  const router = useHistory();


  let renderedView;
  switch (views) {
    case Views.Start:
      renderedView = (<StartView setView={setView}/>);
      break;
    case Views.Login:
      renderedView = (<LoginView setView={setView} handleRedirect={handleRedirect}/>)
      break;
    case Views.Register:
      renderedView = (<RegisterView isGuest={false} setView={setView} handleRedirect={handleRedirect}/>);
      break;
    case Views.Guest:
      renderedView = (<RegisterView isGuest={true} setView={setView} handleRedirect={handleRedirect}/>);
      break;
  }

  function handleRedirect() {
    if (props.location) {
      router.push(props.location.state.from.pathname);
    }
    else{
      router.push("/");
    }
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