import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import DriveAccountPage from './pages/DriveAccountPage';
import HashRouter from 'react-router-dom/es/HashRouter';
import navigationService from './services/NavigationService'
import DriveAccountDetailsPage from './pages/DriveAccountDetailsPage';
import DownloadPage from './pages/DownloadPage';

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
              <Route path={'/downloads'} component={DownloadPage}/>
              <Redirect exact={true} from={'/'} to={'/accounts'}/>
            </Switch>
          )
        }}/>
      </HashRouter>
    );
  }
}

export default AppRoutes;
