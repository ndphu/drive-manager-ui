import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {withStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import withRoot from './withRoot';
import AppRoutes from './AppRoutes';
import downloadService from './services/DownloadService';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import DownloadPage from './pages/DownloadPage';
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
//import  from "@material-ui/icons";
import MoreIcon from "@material-ui/icons/MoreVert";
import QuickSearchField from './components/search/QuickSearchField';
import Hidden from '@material-ui/core/Hidden/Hidden';
import Drawer from '@material-ui/core/Drawer/Drawer';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import navigationService from './services/NavigationService';

const drawerWidth = 240;


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
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
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
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: {
    height: 48,
    [theme.breakpoints.down('xs')]: {
      height: 56,
    }
  },
  toolbarDense: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },

  toolbarNormal: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  appBar: {
    // marginLeft: drawerWidth,
    // [theme.breakpoints.up('sm')]: {
    //   width: `calc(100% - ${drawerWidth}px)`,
    // },
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
  },

});

class App extends React.Component {
  state = {
    downloadingCount: 0,
    open: false,
    mobileOpen: false,
    openSearch: false,
    anchorEl: null,
    mobileMoreAnchorEl: null,
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
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSearchOpen = () => {
    this.setState({openSearch: true})
  };

  handleSearchClose = () => {
    this.setState({openSearch: false});
  };

  handleMenuClose = () => {
    this.setState({anchorEl: null});
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({mobileMoreAnchorEl: event.currentTarget});
  };

  handleMobileMenuClose = () => {
    this.setState({mobileMoreAnchorEl: null});
  };

  showQuickSearchPanel = () => {
    this.setState({showQuickSearch: true})
  };

  hideQuickSearchPanel = () => {
    this.setState({showQuickSearch: false})
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render = () => {
    const {classes, theme} = this.props;
    const {downloadingCount, openSearch, anchorEl, mobileMoreAnchorEl, showQuickSearch} = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
      </Menu>
    );
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
      </Menu>
    );

    const toolbarContent = (
      <React.Fragment>
        <IconButton className={classes.menuButton}
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleDrawerToggle}
        >
          <MenuIcon/>
        </IconButton>
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          Drive Manager
        </Typography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon/>
          </div>
          <QuickSearchField/>
        </div>
        <div className={classes.grow}/>
        <div className={classes.sectionDesktop}>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
            <MoreIcon/>
          </IconButton>
        </div>
      </React.Fragment>
    );

    const renderToolbar = (
      <React.Fragment>
        <Toolbar className={classes.toolbarNormal}>
          {toolbarContent}
        </Toolbar>
        <Toolbar variant={"dense"}
                 className={classes.toolbarDense}>
          {toolbarContent}
        </Toolbar>
      </React.Fragment>
    );
    const drawer = (
      <div>
        <CssBaseline />
        <List>
            <ListItem button onClick={() => {
              this.setState({
                mobileOpen: false,
              }, function () {
                navigationService.goToAccounts();
              })
            }}>
              <ListItemText primary={'Accounts'} />
            </ListItem>
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          {renderToolbar}
        </AppBar>
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={this.props.container}
              variant="temporary"
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {!showQuickSearch && <AppRoutes/>}
        </main>
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
      </div>
    );
  }

}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));