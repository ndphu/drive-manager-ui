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

class ProjectsPage extends React.Component {

    state = {};

    componentDidMount = () => {
        this.loadProjects();
    };

    loadProjects = () => {
        this.setState({loading: true}, function () {
            projectService.getProjects(1, 25).then(resp => {
                this.setState({projects: resp, loading: false})
            })
        });
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
        // this.setState({loading: true});
        projectService.createProject({displayName: this.state.displayName, keyFile: this.state.selectedFile})
            .then((resp) => {
                this.setState({openAddProjectDialog: false, loading: false}, this.loadProjects);
            })
    };

    handleProjectClick = (p) => {
        navigationService.goToProject(p.id);
    };

    onFileSelected = event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        });
    };

    isFormValid = () => {
        return this.state.selectedFile && this.state.displayName;
    };

    render = () => {
        const {classes} = this.props;
        const {projects, openAddProjectDialog, loading, selectedFile} = this.state;

        const dialog =
            <Dialog
                open={openAddProjectDialog}
                fullWidth
                // onClose={this.handleClose}
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
                        label="Admin Key"
                        multiline
                        fullWidth
                        value={selectedFile ? selectedFile.name : ""}
                        disabled
                    />
                    <Button
                        style={{marginTop: 4}}
                        color={'secondary'}
                        variant={"outlined"}
                        component={'label'}>
                        Select Key File
                        <input type='file'
                               accept="application/json"
                               style={{display: 'none'}}
                               onChange={this.onFileSelected}/>
                    </Button>
                    {loading && <LinearProgress variant={"indeterminate"} color={"secondary"}/>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={this.handleSaveNewProject}
                            color="primary"
                            disabled={!this.isFormValid()}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>;

        return (
            loading ?
                <React.Fragment>
                    {loading && <LinearProgress variant={'indeterminate'} color={'secondary'}/>}
                </React.Fragment>
                :
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
