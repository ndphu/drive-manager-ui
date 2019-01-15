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
import Hidden from "@material-ui/core/Hidden/Hidden";

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
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
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

    render = () => {
        const {classes} = this.props;
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
                <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
                    <MenuIcon/>
                </IconButton>
                <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                    {document.title}
                </Typography>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                    <InputBase
                        onFocus={this.showQuickSearchPanel}
                        onBlur={this.hideQuickSearchPanel}
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                    />
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
                <Hidden mdUp>
                    <Toolbar>
                        {toolbarContent}
                    </Toolbar>
                </Hidden>
                <Hidden smDown>
                    <Toolbar variant={"dense"}>
                        {toolbarContent}
                    </Toolbar>
                </Hidden>
            </React.Fragment>
        );

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    {renderToolbar}
                </AppBar>
                <main className={classes.content}>
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

                {/*<Dialog*/}
                {/*fullScreen={true}*/}
                {/*open={openSearch}*/}
                {/*onClose={this.handleSearchClose}*/}
                {/*aria-labelledby="form-dialog-title"*/}
                {/*>*/}
                {/*<DialogContent>*/}
                {/*<QuickSearch closeSearchCallback={this.handleSearchClose}/>*/}
                {/*</DialogContent>*/}
                {/*<DialogActions>*/}
                {/*<Button onClick={this.handleSearchClose} color="primary">*/}
                {/*Close*/}
                {/*</Button>*/}
                {/*</DialogActions>*/}
                {/*</Dialog>*/}
            </div>
        );
    }

}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));