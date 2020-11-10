import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {BigPlayButton, Player} from 'video-react';
import accountService from '../services/AccountService';
import queryString from 'query-string';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Button from '@material-ui/core/Button/Button';
import ShareIcon from '@material-ui/icons/Share'
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import OpenIcon from '@material-ui/icons/OpenInNew'
import Typography from '@material-ui/core/Typography/Typography';
import {copyTextToClipBoard} from '../utils/StringUtils';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
  },
  button: {
    margin: theme.spacing.unit,
  },

  rightIcon: {
    marginLeft: theme.spacing.unit,
  },

  sharableLink: {
    padding: theme.spacing.unit,
  },

  fileDetails: {
    margin: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing.unit,
    },
  }
});

class VideoViewPage extends React.Component {
  state = {};

  componentDidMount = () => {
    const values = queryString.parse(this.props.location.search);
    this.loadVideo(values.accountId, values.fileId);
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps) {
      const prevValues = queryString.parse(prevProps.location.search);
      const current = queryString.parse(this.props.location.search);
      if (current.accountId !== prevValues.accountId || current.fileId !== prevValues.fileId) {
        this.loadVideo(current.accountId, current.fileId);
      }
    }
  };

  loadVideo = (accountId, fileId) => {
    const _this = this;
    this.setState({loading: true}, function () {
      accountService.getSharableLink(accountId, fileId).then(resp => {
        document.title = resp.file.name;
        _this.setState({
          loading: false,
          file: resp.file,
          playingLink: resp.directLink,
        })
      })
    });
  };

  handleShareClick = () => {
    const current = queryString.parse(this.props.location.search);
    this.setState({loading: true}, function () {
      copyTextToClipBoard(`https://drive.google.com/file/d/${current.fileId}/view`);
      accountService.getSharableLink(current.accountId,current.fileId).then(resp => {
        document.cookie = resp.cookie
        this.setState({
          file: resp.file,
          sharableLink: resp.link,
          loading: false,
          openSnackbar: true,
        })
      })
    });
  };

  handleSnackbarClose = () => {
    this.setState({openSnackbar: false})
  };

  handleOpenLinkNewTab = () => {
    let el = document.createElement('a');
    el.href = this.state.playingLink;
    el.target = "_blank";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  render = () => {
    const {classes} = this.props;
    const {playingLink, loading, sharableLink, file} = this.state;
    return (
      <div>
        {loading && (
          <LinearProgress
            variant={'indeterminate'}
            color={'secondary'}
          />
        )}
        {playingLink &&
        <div>
          <Player
            ref={'player'}
            playsInline={true}
            preload={'auto'}
            src={playingLink}>
            <BigPlayButton position="center"/>
          </Player>
          <div className={classes.fileDetails}>
            <Typography
              className={classes.accountName}
              variant="headline"
              color={"primary"}>
              {file.name}
            </Typography>
            <Button
              variant="raised"
              color="secondary"
              className={classes.button}
              onClick={this.handleShareClick}
              disabled={!playingLink || loading}
            >
              Share
              <ShareIcon className={classes.rightIcon}/>
            </Button>
            <Button
              variant="raised"
              color="secondary"
              className={classes.button}
              onClick={this.handleOpenLinkNewTab}
              disabled={!playingLink}
            >
              Open On New Tab
              <OpenIcon className={classes.rightIcon}/>
            </Button>
          </div>
        </div>}

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.openSnackbar}
          autoHideDuration={2000}
          onClose={this.handleSnackbarClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Link Copied To Clipboard!</span>}
          action={[
            <Button
              variant={'flat'}
              size={'small'}
              key="close"
              aria-label="Close"
              color="secondary"
              className={classes.close}
              onClick={this.handleSnackbarClose}
            >
              Dismiss
            </Button>,
          ]}
        />
      </div>
    );
  }
}

VideoViewPage.PropTypes = {};

export default withStyles(styles)(VideoViewPage);
