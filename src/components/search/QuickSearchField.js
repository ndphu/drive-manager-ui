import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase/InputBase';
import searchService from '../../services/SearchService';
import navigationService from '../../services/NavigationService';
import Fade from '@material-ui/core/Fade/Fade';
import Popper from '@material-ui/core/Popper/Popper';
import Paper from '@material-ui/core/Paper/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader';

const styles = theme => ({
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
  typography: {
    margin: theme.spacing.unit * 2,
  },

  popper: {
    marginTop: 2,
  },
  searchContainer: {
    maxHeight: 600,
    overflowY: 'auto',
    [theme.breakpoints.down('md')]: {
      maxHeight: 420,
    },
  },
});

class QuickSearchField extends React.Component {
  state = {
    anchorEl: null,
  };

  constructor(props) {
    super(props);
  }

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleAccountClick = account => {
    this.handleClose()
    navigationService.goToAccount(account._id)
  };

  monitorKeyUp = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
    });
    if (this.keyUpTimer) {
      clearInterval(this.keyUpTimer)
    }
    if (e.key === 'Enter') {
      this.performSearch();
    } else {
      this.keyUpTimer = setTimeout(this.performSearch, 1000);
    }
  };

  performSearch = () => {
    const query = this.state.query;
    const _this = this;
    this.setState({loading: true}, function () {
      _this.search(query);
    })
  };

  search = (query) => {
    if (query) {
      searchService.quickSearch(query).then(resp => {
        this.setState({loading: false, files: resp.files, accounts: resp.accounts,
          noResults: resp.files.length === 0 && resp.accounts.length === 0})
      })
    }
  };

  handleClickAway = () => {
    this.handleClose();
  };

  handleFileClick = (file) => {
    this.handleClose();
    navigationService.goToVideoView(file.driveAccount, file.driveId);
  };

  render() {
    const {classes} = this.props;
    const {anchorEl, files, loading, noResults, accounts} = this.state;
    const open = anchorEl && !loading;
    const id = open ? 'simple-popper' : null;

    return (
      <div>
        <InputBase
          onClick={this.handleClick}
          onChange={this.handleChange('query')}
          onKeyUp={this.monitorKeyUp}
          aria-owns={open ? 'simple-popper' : undefined}
          aria-haspopup="true"
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
        />
        <Popper id={id} open={open}
                anchorEl={anchorEl}
                transition
                className={classes.popper}>
          {({TransitionProps}) => (
            <Fade {...TransitionProps} timeout={50}>
              <ClickAwayListener onClickAway={this.handleClickAway}>
                <Paper className={classes.searchContainer}>
                  <List dense>
                    {accounts && accounts.length > 0 &&
                    <ListSubheader color={'secondary'} disableSticky>
                      Account
                    </ListSubheader>
                    }
                    {accounts && accounts.map(account => {
                      return (
                        <ListItem key={`search-result-account-id-${account._id}`}
                                  button
                                  dense
                                  onClick={()=>{this.handleAccountClick(account);}}>
                          <ListItemText primary={account.name}/>
                        </ListItem>
                      )
                    })}
                  </List>
                  <List dense>
                    {files && files.length > 0 &&
                    <ListSubheader color={'secondary'} disableSticky>
                      File
                    </ListSubheader>
                    }
                    {files && files.map(file => {
                      return (
                        <ListItem key={`search-result-file-id-${file.id}`}
                                  button
                                  dense
                                  onClick={()=>{this.handleFileClick(file);}}>
                          <ListItemText primary={file.name}/>
                        </ListItem>
                      )
                    })}
                  </List>
                  {
                    noResults && (
                      <ListItem dense>
                        <ListItemText primary={'no matching results'}
                        />
                      </ListItem>
                    )
                  }
                </Paper>
              </ClickAwayListener>
            </Fade>
          )}
        </Popper>

      </div>
    );
  }
}

QuickSearchField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QuickSearchField);