import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {withStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import withRoot from './withRoot';
import AppRoutes from './AppRoutes';
import Badge from '@material-ui/core/Badge/Badge';
import DownloadIcon from '@material-ui/icons/CloudDownload'
import downloadService from './services/DownloadService';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import DownloadPage from './pages/DownloadPage';

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },

  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing.unit,
    },
  },

});

class App extends React.Component {
  state = {
    downloadingCount: 0,
    open: false,
  };

  componentDidMount = () => {
    this.interval = setInterval(this.refreshDownload, 200);
  };

  componentWillUnmount = () => {
    if (this.interval) {
      clearInterval(this.interval)
    }
  };

  refreshDownload = () => {
    //
    let downloads = downloadService.getDownloadIds().map(id => {
      return downloadService.getDownload(id);
    }).filter(d => !d.completed);
    this.setState({
      downloadingCount: downloads.length
    })
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };


  render = () => {
    const {classes} = this.props;
    const {downloadingCount} = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar variant={'dense'}>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
              <MenuIcon/>
            </IconButton>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              {document.title}
            </Typography>
            <div className={classes.grow}/>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon/>
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            <IconButton color="inherit" onClick={this.handleClickOpen}>
              {downloadingCount > 0 ? <Badge badgeContent={downloadingCount} color="secondary">
                  <DownloadIcon/>
                </Badge> :
                <DownloadIcon/>
              }
            </IconButton>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <AppRoutes/>
          <Dialog
            fullScreen={true}
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Download</DialogTitle>
            <DialogContent>
              <DownloadPage/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </main>
      </div>
    );
  }

}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));