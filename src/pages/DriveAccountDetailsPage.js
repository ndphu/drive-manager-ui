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
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import {BigPlayButton, Player} from 'video-react';
import CloseIcon from '@material-ui/icons/Close';
import '../../node_modules/video-react/dist/video-react.css';

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
  }
});

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
    accountService.getDownloadLink(this.state.account._id, file.id).then(resp => {
      const link = resp.link;
      //console.log("link", link)
      this.setState({
        playingLink: link,
        playingTitle: file.name,
        playDialogOpen: true,
      })
    })
  };

  handleDownloadClick = (file) => {
    accountService.getDownloadLink(this.state.account._id, file.id).then(resp => {
      const link = resp.link;
      downloadService.downloadDriveFile(file.name, link);
    });
  };

  load = () => {
    accountService.getAccountById(this.props.match.params.id)
      .then(account => {
        document.title = account.name;
        this.setState({account});
        accountService.getAccountFiles(account._id, this.state.page, this.state.size)
          .then(files => {
            this.setState({files})
          })
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
        </div>
        }
        <Dialog fullScreen={true}
                open={this.state.playDialogOpen}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title">
          <AppBar className={classes.appBar}>
            <Toolbar variant={'dense'}>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon/>
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                {this.state.playingTitle}
              </Typography>
            </Toolbar>
          </AppBar>
          <div style={{height: 48}}/>
          <Player
            ref={'player'}

            playsInline={true}
            preload={'auto'}
            src={this.state.playingLink}>
            <BigPlayButton position="center"/>
          </Player>
        </Dialog>
      </Paper>
    );
  }
}

DriveAccountDetailsPage.PropTypes = {};

export default withStyles(styles)(DriveAccountDetailsPage);
