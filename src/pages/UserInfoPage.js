import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button/Button';
import authService from '../services/AuthService';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/Typography/Typography';
import TextField from '@material-ui/core/TextField/TextField';
import Divider from '@material-ui/core/Divider/Divider';
import {copyTextToClipBoard} from '../utils/StringUtils';
import Paper from '@material-ui/core/Paper/Paper';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import CardContent from '@material-ui/core/CardContent/CardContent';
import CardActions from '@material-ui/core/CardActions/CardActions';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  commandContainer: {
    backgroundColor: "#e9ebed",
    padding: theme.spacing.unit,
    overflowX: "scroll",
  },
  paddingContainer: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  }
});

class SectionLabel extends React.Component {
  render = () => {
    return (
      <Typography variant={'body1'}
                  color={'primary'}>
        {this.props.label}
      </Typography>
    )
  }
}

class UserInfoPage extends React.Component {
  state = {
    importDialogOpen: false,
    showCLISection: true,
  };
  componentDidMount = () => {
    this.loadUserInfo();
  };

  loadUserInfo = () => {
    authService.getUserInfo().then(resp => {
      this.setState({
        userInfo: resp,
        serviceToken: (resp.serviceTokens && resp.serviceTokens.length) > 0 ? resp.serviceTokens[0] : null,
      })
    })
  };

  toggleImportKeyDialog = () => {
    this.setState({
      importDialogOpen: this.state.importDialogOpen,
    })
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  saveServiceAccountAdminKey = () => {
    authService.saveServiceAccountAdminKey(this.state.serviceAccountAdminKey).then(resp => {
      this.loadUserInfo();
    });
  };

  increaseStorageClick = () => {
    authService.increaseStorage().then(resp => {
      this.loadUserInfo();
    })
  };

  toggleCLISection = () => {
    this.setState({showCLISection: !this.state.showCLISection})
  };

  handleCLISetup = () => {
    const serviceTokens = this.state.userInfo.serviceTokens;
    if (serviceTokens && serviceTokens.length > 0) {
      this.setState({showCLISetup: true, serviceToken: serviceTokens[0]})
    } else {
      authService.createServiceToken().then(resp => {
        this.setState({serviceToken: resp})
      })
    }
  };

  createServiceToken = () => {
    authService.createServiceToken().then(resp => {
      this.setState({serviceToken: resp})
    });
  };

  getCLICommand = () => {
    return `drive-manager-cli login --token ${this.state.serviceToken.token}`
  };

  handleCopyCLISetup = () => {
    copyTextToClipBoard(this.getCLICommand())
  };

  render = () => {
    const {classes} = this.props;
    const {userInfo, serviceAccountAdminKey, showAdminAccountSection, showCLISection, serviceToken} = this.state;

    const userInfoCard = userInfo ?
      (
        <Card>
          <CardHeader title={userInfo.displayName}
                      subheader={userInfo.email}/>
          <CardContent>
            <Typography>
              {`${userInfo.noOfAccounts} service accounts`}
            </Typography>
            <Typography>
              {`${userInfo.noOfAccounts * 15} GB`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant={'outlined'}
                    color={'secondary'}>
              Change Password
            </Button>
          </CardActions>
        </Card>
      ) : (<div/>);
    const cliSetupSection =
      <Card>
        <CardHeader title={'CLI Tool Setup'}/>
        <CardContent>
          {serviceToken ?
            <div className={classes.commandContainer}>
              <Typography variant={'caption'} >
                {this.getCLICommand()}
              </Typography>
            </div>
            :
            <Typography variant={'body1'} color={'secondary'}>
              You should create Service Token to start using CLI
            </Typography>
          }
        </CardContent>
        <CardActions>
          {serviceToken ?
            <Button variant={'outlined'}
                    color={'secondary'}
                    onClick={this.handleCopyCLISetup}
                    className={classes.button}>
              Copy
            </Button> :
            <Button variant={'contained'}
                    color={'primary'}
                    onClick={this.createServiceToken}
                    className={classes.button}>
              Create Service Token
            </Button>
          }
        </CardActions>
      </Card>;

    const adminSection =
      <Card>
        <CardHeader>
          Project
        </CardHeader>
        <CardContent>
          <TextField
            variant={'outlined'}
            fullWidth
            autoFocus
            margin={'dense'}
            placeholder={'Admin service account json key'}
            value={serviceAccountAdminKey}
            onChange={this.handleChange('serviceAccountAdminKey')}
            multiline/>
          <Button variant={'contained'}
                  color={'primary'}
                  onClick={this.saveServiceAccountAdminKey}
                  className={classes.button}>
            Save
          </Button>
          <Button variant={'flat'}
                  color={'primary'}
                  onClick={() => {
                    this.setState({showAdminAccountSection: false})
                  }}
                  className={classes.button}>
            Cancel
          </Button>
        </CardContent>

      </Card>;

    return (
      <div className={classes.root}>
        {userInfo ?
          <div>
            {userInfoCard}
            <div className={classes.paddingContainer}/>
            {cliSetupSection}
            <div className={classes.paddingContainer}/>
          </div>
          : <LinearProgress variant={'indeterminate'}/>
        }
      </div>
    );
  }
}

UserInfoPage.PropTypes = {};

export default withStyles(styles)(UserInfoPage);
