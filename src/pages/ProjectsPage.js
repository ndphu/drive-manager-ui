import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import projectService from '../services/ProjectService';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import navigationService from '../services/NavigationService';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import CloudIcon from '@material-ui/icons/CloudOutlined';
import Avatar from '@material-ui/core/Avatar/Avatar';


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

class ProjectsPage extends React.Component {

  state = {};

  componentDidMount = () => {
    this.loadProjects();
  };

  loadProjects = () => {
    projectService.getProjects(1, 25).then(resp => {
      this.setState({projects: resp})
    })
  };

  handleAddProjectClick = () => {
    this.setState({openAddProjectDialog: true});
  };

  handleClose = () => {
    this.setState({openAddProjectDialog: false});
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSaveNewProject = () => {
    projectService.createProject({displayName: this.state.displayName, key: btoa(this.state.key)})
      .then(resp => {
        this.setState({openAddProjectDialog: false}, this.loadProjects);
      })
  };

  handleProjectClick = (p) => {
    navigationService.goToProject(p.id);
  };

  render = () => {
    const {classes} = this.props;
    const {projects, openAddProjectDialog} = this.state;

    const dialog =
      <Dialog
        open={openAddProjectDialog}
        fullWidth
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Display Name"
            fullWidth
            value={this.state.displayName}
            onChange={this.handleChange('displayName')}
          />
          <TextField
            margin="dense"
            label="Service Account Key"
            multiline
            fullWidth
            value={this.state.key}
            onChange={this.handleChange('key')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose}>
            Cancel
          </Button>
          <Button onClick={this.handleSaveNewProject}
                  color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>;

    return (
      <Paper className={classes.root}>
        <Typography variant={'h5'}
                    color={'textPrimary'}>
          Projects
        </Typography>
        <List>
          {projects && projects.map(project =>
            <ListItem key={`project-list-item-key-${project.id}`}
                      divider
                      button
                      onClick={() => {
                        this.handleProjectClick(project);
                      }}>
              <ListItemIcon>
                <CloudIcon color={'primary'}/>
              </ListItemIcon>
              <ListItemText primary={project.displayName}
                            secondary={project.projectId}
              />
            </ListItem>
          )}
        </List>
        <Button variant={'outlined'}
                color={'primary'}
                onClick={this.handleAddProjectClick}
        >
          Add Project
        </Button>
        {dialog}
      </Paper>
    );
  }
}

ProjectsPage.PropTypes = {};

export default withStyles(styles)(ProjectsPage);
