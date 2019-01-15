import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField/TextField';
import searchService from '../../services/SearchService';
import DriveFileList from '../account/DriveFileList';
import navigationService from '../../services/NavigationService';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

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
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

class QuickSearch extends React.Component {
  state = {};

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  monitorKeyUp = (e) => {
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
    searchService.searchFiles(query).then(resp => {
      this.setState({loading: false, files: resp, query: query})
    })
  };

  handleFileClick = (file) => {
    if (this.props.closeSearchCallback) {
      this.props.closeSearchCallback();
    }
    navigationService.goToVideoView(file.driveAccount, file.driveId);
  };

  render = () => {
    const {classes} = this.props;
    const {loading, files} = this.state;
    return (
      <div>
        <TextField
          variant={'outlined'}
          placeholder={'File name contains...'}
          onChange={this.handleChange('query')}
          onKeyUp={this.monitorKeyUp}
          // disabled={loading}
          fullWidth
          autoFocus
          >
        </TextField>
        {loading ? (
          <div>
            <div style={{height: 10}}/>
            <LinearProgress
              variant={'indeterminate'}
              color={'secondary'}
            />
          </div>

        ) : <div style={{height: 16}}/>}

        {files && <DriveFileList files={files}
                                 onItemClick={this.handleFileClick}
        />}
      </div>
    );
  }
}

QuickSearch.PropTypes = {};

export default withStyles(styles)(QuickSearch);
