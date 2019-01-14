import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {BigPlayButton, Player} from 'video-react';
import accountService from '../services/AccountService';
import queryString from 'query-string';

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
    accountService.getDownloadLink(values.accountId, values.fileId).then(resp => {
      const link = resp.link;
      this.setState({
        playingLink: link,
      })
    })
  };

  render = () => {
    const {classes} = this.props;
    const {playingLink} = this.state;
    return (
      <div>
        {playingLink &&
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
