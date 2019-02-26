import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import DriveAccountPage from './pages/DriveAccountPage';
import HashRouter from 'react-router-dom/es/HashRouter';
import navigationService from './services/NavigationService'
import DriveAccountDetailsPage from './pages/DriveAccountDetailsPage';
import VideoViewPage from './pages/VideoViewPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UserInfoPage from './pages/UserInfoPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';

class AppRoutes extends React.Component {

  render = () => {
    return (
      <HashRouter>
        <Route path={'/'} render={(props) => {
          navigationService.setLocation(props.location);
          navigationService.setHistory(props.history);
          return (
            <Switch>
              <Route path={'/accounts'} component={DriveAccountPage}/>
              <Route path={'/account/:id'} component={DriveAccountDetailsPage}/>
              <Route path={'/view/video'} component={VideoViewPage}/>
              <Route path={'/projects'} component={ProjectsPage}/>
              <Route path={'/project/:id'} component={ProjectPage}/>
              <Route path={'/user/register'} component={RegisterPage}/>
              <Route path={'/user/login'} component={LoginPage}/>
              <Route path={'/user/info'} component={UserInfoPage}/>
              <Redirect exact={true} from={'/'} to={'/accounts'}/>
            </Switch>
          )
        }}/>
      </HashRouter>
    );
  }
}

export default AppRoutes;
