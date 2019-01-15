import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {BigPlayButton, Player} from 'video-react';
import accountService from '../services/AccountService';
import queryString from 'query-string';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
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
      accountService.getDownloadLink(accountId, fileId).then(resp => {
        const link = resp.link;
        _this.setState({
          loading: false,
          playingLink: link,
        })
      })
    });
  };

  render = () => {
    const {classes} = this.props;
    const {playingLink, loading} = this.state;
    return (
      <div>
        {loading && (
          <LinearProgress
            variant={'indeterminate'}
            color={'secondary'}
          />
        )}
        {!loading && playingLink &&
        <Player
          ref={'player'}
          playsInline={true}
          preload={'auto'}
          src={playingLink}>
          <BigPlayButton position="center"/>
        </Player>}

      </div>
    );
  }
}

VideoViewPage.PropTypes = {};

export default withStyles(styles)(VideoViewPage);
