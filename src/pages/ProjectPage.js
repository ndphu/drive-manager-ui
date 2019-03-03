import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper/Paper';
import projectService from '../services/ProjectService';
import Typography from '@material-ui/core/Typography/Typography';
import AccountList from '../components/account/AccountList';
import navigationService from '../services/NavigationService';
import Button from '@material-ui/core/Button/Button';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    margin: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing.unit,
    },
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class ProjectPage extends React.Component {
  state = {};

  componentDidMount = () => {
    this.loadProject();
  };

  loadProject = () => {
    this.setState({loading: true}, function () {
      projectService.getProjectById(this.props.match.params.id).then(project => {
        this.setState({
          loading: false,
          project: project,
        });
      });
    });
  };

  handleAccountClick = (acc) => {
    navigationService.goToAccount(acc.id);
  };

  handleAddServiceAccountClick = () => {
    const _this = this;
    projectService.addServiceAccount(this.state.project.id)
      .then(resp => {
        _this.loadProject();
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  render = () => {
    const {classes} = this.props;
    const {project, loading} = this.state;
    return (
      project ?
        <Paper className={classes.root}>
          <Typography variant={'h6'}>
            {project.displayName}
          </Typography>
          <Typography variant={'body1'}
                      color={'textSecondary'}
                      gutterBottom>
            {project.projectId}
          </Typography>
          {project.accounts && project.accounts.length > 0 &&
          <AccountList accounts={project.accounts}
                       onItemClick={this.handleAccountClick}
          />
          }
          <Button variant={'outlined'}
                  color={'primary'}
                  onClick={this.handleAddServiceAccountClick}>
            Add Service Account
          </Button>
        </Paper>
        :
        <React.Fragment>
          {loading && <LinearProgress variant={'indeterminate'} color={'secondary'}/>}
        </React.Fragment>
    );
  }
}

ProjectPage.PropTypes = {};

export default withStyles(styles)(ProjectPage);
