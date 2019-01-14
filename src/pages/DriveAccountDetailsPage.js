import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper/Paper';
import accountService from '../services/AccountService';
import Typography from '@material-ui/core/Typography/Typography';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import DriveFileTable from '../components/account/DriveFileTable';
import {humanFileSize} from "../utils/StringUtils";
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton/IconButton';
import downloadService from '../services/DownloadService';
import '../../node_modules/video-react/dist/video-react.css';
import Slide from '@material-ui/core/Slide/Slide';
import Hidden from '@material-ui/core/Hidden/Hidden';
import DriveFileList from '../components/account/DriveFileList';
import Divider from '@material-ui/core/Divider/Divider';
import navigationService from '../services/NavigationService';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  spacer: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  quotaContainer: {
    display: "flex",
    alignItems: "center",
    height: 56,
  },
  refreshQuotaButton: {
    margin: theme.spacing.unit,
  },
  progress: {
    margin: theme.spacing.unit,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


class DriveAccountDetailsPage extends React.Component {

  state = {
    files: [],
    page: 1,
    size: 50,
    playDialogOpen: false,
    playingLink: '',
    playingTitle: '',
  };

  componentDidMount = () => {
    document.title = 'Loading...';
    this.load();
  };

  handleFileClick = (file) => {
    console.log("click file", file);
    if (file.mimeType === 'video/mp4') {
      this.showVideo(file);
    }
  };

  showVideo = (file) => {
    navigationService.goToVideoView(this.state.account._id, file.id);
  };

  handleDownloadClick = (file) => {
    accountService.getDownloadLink(this.state.account._id, file.id).then(resp => {
      const link = resp.link;
      downloadService.downloadDriveFile(file.name, link);
    });
  };

  load = () => {
    const _this = this;
    accountService.getAccountById(this.props.match.params.id)
      .then(account => {
        document.title = account.name;
        this.setState({account}, function () {
          accountService.getAccountFiles(account._id, _this.state.page, _this.state.size)
            .then(files => {
              this.setState({files}, _this.refreshQuota)
            })
        });
      })
  };

  refreshQuota = () => {
    this.setState({refreshingQuota: true});
    accountService.refreshQuota(this.props.match.params.id)
      .then(account => {
        this.setState({account, refreshingQuota: false});
      }).catch(() => {
      this.setState({refreshingQuota: false});
    });
  };

  handleClose = () => {
    this.setState({playDialogOpen: false});
  };

  render = () => {
    const {classes} = this.props;
    const {account, files, refreshingQuota} = this.state;
    return (
      <Paper className={classes.root} elevation={1} square={true}>
        {account &&
        <div>
          <Hidden smDown>
            <div className={classes.quotaContainer}>
              {!refreshingQuota ? <Typography variant="subtitle1" color={'textPrimary'}>
                Usage: {humanFileSize(account.usage)} / {humanFileSize(account.limit)}
              </Typography> : <Typography variant="subtitle1" color={'textPrimary'}>
                Refreshing...
              </Typography>
              }

              {!refreshingQuota &&
              <IconButton color={'secondary'}
                          onClick={this.refreshQuota}
              >
                <RefreshIcon/>
              </IconButton>
              }
            </div>
            <div className={classes.spacer}/>
            <LinearProgress color={'secondary'}
                            variant={'determinate'}
                            value={parseFloat(account.usage * 100 / account.limit)}
            />
            <div className={classes.spacing}/>
            <DriveFileTable files={files}
                            onRowClick={this.handleFileClick}
                            onDownloadClick={this.handleDownloadClick}
            />
          </Hidden>

          <Hidden mdUp>
            {account && (
              <div>
                {!refreshingQuota ? <Typography variant="body2" color={'textPrimary'}>
                  Usage: {humanFileSize(account.usage)} / {humanFileSize(account.limit)}
                </Typography> : <Typography variant="body2" color={'textPrimary'}>
                  Refreshing...
                </Typography>
                }
                <div className={classes.spacer}/>
                <Divider/>
              </div>
            )}

            <DriveFileList files={files}
                           onItemClick={this.handleFileClick}/>
          </Hidden>
        </div>
        }
      </Paper>
    );
  }
}

DriveAccountDetailsPage.PropTypes = {};

export default withStyles(styles)(DriveAccountDetailsPage);
