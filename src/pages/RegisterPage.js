import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import authService from '../services/AuthService';
import Grid from '@material-ui/core/Grid/Grid';
import Hidden from '@material-ui/core/Hidden/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/Typography/Typography';
import {isValidEmail} from '../utils/StringUtils';
import navigationService from '../services/NavigationService';

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

class RegisterPage extends React.Component {
  state = {
    email: "",
    password: "",
    displayName: "",
  };

  register = () => {
    const {email, password, displayName} = this.state;
    this.setState({loading: true, error: null}, function () {
      authService.registerUserWithEmail(email, password, displayName).then(resp => {
        this.setState({loading: false}, function () {
          navigationService.goToLoginPage();
        })
      }).catch((err) => {
        this.setState({loading: false, error: err});
      });
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  invalidInput = () => {
    return !(isValidEmail(this.state.email) && this.state.password && this.state.password.length > 0
      && this.state.displayName && this.state.displayName.length > 0);
  };

  render = () => {
    const {classes} = this.props;
    const {loading, error} = this.state;
    console.log(loading);

    const registerForm = (
      <div>
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
          required
          fullWidth
        />
        <TextField
          label="Display Name"
          value={this.state.displayName}
          onChange={this.handleChange('displayName')}
          margin="dense"
          variant="outlined"
          required
          fullWidth
        />
        <Button color={'primary'}
                variant={'contained'}
                className={classes.formButton}
                fullWidth
                onClick={this.register}
                disabled={this.invalidInput()}>
          Register
        </Button>
        {loading &&
        <LinearProgress variant={'indeterminate'}
                        className={classes.progressBar}/>
        }
        {error &&
        <Typography color={"secondary"}
                    className={classes.progressBar}
        >
          {error.err}
        </Typography>
        }
      </div>
    );

    return (
      <div>
        <Hidden xsDown>
          <Grid container className={classes.loginForm}>
            <Grid item xs={3}/>
            <Grid item xs={6}>
              {registerForm}
            </Grid>
            <Grid item xs={3}/>
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Grid container className={classes.loginForm}>
            {registerForm}
          </Grid>
        </Hidden>
      </div>
    );
  }
}

RegisterPage.PropTypes = {};

export default withStyles(styles)(RegisterPage);
