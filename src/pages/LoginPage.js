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
import Paper from '@material-ui/core/Paper/Paper';

const styles = theme => ({
  registerForm: {
    padding: theme.spacing.unit * 2,
  },
  formContainer: {
    padding: theme.spacing.unit * 2,
  },
  buttonContainer: {
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
      <Paper className={classes.formContainer}>
        <Typography variant={'h4'} gutterBottom>
          Login
        </Typography>
        <TextField
          label="Email"
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
          value={this.state.password}
          onChange={this.handleChange('password')}
          margin="dense"
          variant="outlined"
          type="password"
          fullWidth
        />
        <Grid container spacing={8} className={classes.buttonContainer}>
          <Grid item xs={6}>
            <Button variant={'contained'}
                    color={'primary'}
                    onClick={this.login}
                    className={classes.formButton}
                    fullWidth
                    disabled={this.invalidInput()}>
              Login
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant={'outlined'}
                    color={'primary'}
                    fullWidth
                    className={classes.formButton}
                    onClick={this.register}>
              Register
            </Button>
          </Grid>
        </Grid>


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
      </Paper>
    );
    return (
      <div>
        <Hidden smDown>
          <Grid container className={classes.registerForm}>
            <Grid item xs={3}/>
            <Grid item xs={4}>
              {loginForm}
            </Grid>
            <Grid item xs={3}/>
          </Grid>
        </Hidden>
        <Hidden xsDown mdUp>
          <Grid container className={classes.registerForm}>
            <Grid item xs={2}/>
            <Grid item xs={8}>
              {loginForm}
            </Grid>
            <Grid item xs={2}/>
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Grid container className={classes.registerForm}>
            {loginForm}
          </Grid>
        </Hidden>
      </div>
    );
  }
}

LoginPage.propTypes = {};

export default withStyles(styles)(LoginPage);
