import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import navigationService from '../services/NavigationService';
import authService from '../services/AuthService';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/Typography/Typography';
import {isValidEmail} from '../utils/StringUtils';
import Hidden from '@material-ui/core/Hidden/Hidden';

const styles = theme => ({
  loginForm: {
    padding: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
  },
  progressBar: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class LoginPage extends React.Component {
  state = {
    email: "user1@mailinator.com",
    password: "123456",
  };

  login = () => {
    const {email, password} = this.state;
    this.setState({loading: true, loginError: null,}, function () {
      authService.loginWithEmail(email, password).then(() => {
        this.setState({loading: false}, function () {
          navigationService.goToUserInfoPage();
        });
      }).catch((err) => {
        this.setState({loginError: err, loading: false});
      });
    });
  };

  register = () => {
    navigationService.goToRegister();
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  invalidInput = () => {
    return !(isValidEmail(this.state.email) && this.state.password && this.state.password.length > 0);
  };

  render = () => {
    const {classes} = this.props;
    const {loading, loginError} = this.state;
    const loginForm = (
      <React.Fragment>
        <TextField
          label="Email"
          className={classes.textField}
          value={this.state.email}
          onChange={this.handleChange('email')}
          margin="dense"
          variant="outlined"
          autoFocus
          required
          fullWidth
        />
        <TextField
          label="Password"
          className={classes.textField}
          value={this.state.password}
          onChange={this.handleChange('password')}
          margin="dense"
          variant="outlined"
          type="password"
          fullWidth
        />
        <Button variant={'contained'}
                color={'primary'}
                onClick={this.login}
                fullWidth
                className={classes.formButton}
                disabled={this.invalidInput()}>
          Login
        </Button>
        <Button variant={'outlined'}
                color={'primary'}
                fullWidth
                className={classes.formButton}
                onClick={this.register}>
          Register
        </Button>
        {loading &&
        <LinearProgress variant={'indeterminate'}
                        className={classes.progressBar}/>
        }
        {loginError &&
        <Typography color={"secondary"}
                    className={classes.progressBar}
        >
          {loginError.message}
        </Typography>
        }
      </React.Fragment>
    );
    return (
      <div>
        <Hidden xsDown >
          <Grid container className={classes.loginForm}>
            <Grid item xs={3}/>
            <Grid item xs={6}>
              {loginForm}
            </Grid>
            <Grid item xs={3}/>
          </Grid>
        </Hidden>
        <Hidden smUp  >
          <Grid container className={classes.loginForm}>
              {loginForm}
          </Grid>
        </Hidden>
      </div>
    );
  }
}

LoginPage.PropTypes = {};

export default withStyles(styles)(LoginPage);
