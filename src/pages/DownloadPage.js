import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import Card from '@material-ui/core/Card/Card';
import CardContent from '@material-ui/core/CardContent/CardContent';
import downloadService from '../services/DownloadService';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import {humanFileSize} from '../utils/StringUtils';

const styles = theme => ({
  root: {
  },
  linkText: {
    width: 600,
  },
  cardItem: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

class DownloadPage extends React.Component {

  state = {
    downloadList: [],
  };

  componentDidMount = () => {
    this.interval = setInterval(this.refreshDownload, 200);
  };

  refreshDownload = () => {
    this.setState({
      downloads: downloadService.getDownloadIds().map(id => {
        return downloadService.getDownload(id);
      })
    });
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render = () => {
    const {classes} = this.props;
    const {downloads} = this.state;

    return (
      <div className={classes.root}>
        {(!downloads || downloads.length === 0) &&
        <Typography variant={'subheading'} color={'textSecondary'}>No download found</Typography>
        }
        {downloads && downloads.map(download => {
          return (
            <Card key={download.id} className={classes.cardItem}>
              <CardContent>
                <Typography gutterBottom
                            color={'primary'}
                            variant="subtitle1">
                  {download.fileName}
                </Typography>
                <Typography variant={'caption'}
                            gutterBottom
                            color={'textSecondary'}
                            noWrap
                            className={classes.linkText}>
                  {download.url}
                </Typography>
                {download.completed ?
                  <Typography variant={'caption'}
                              gutterBottom
                              color={'textSecondary'}
                              noWrap
                              className={classes.linkText}>
                    Completed
                  </Typography>
                  :
                  <div>
                    <Typography variant={'caption'}
                                gutterBottom
                                color={'textSecondary'}
                                noWrap
                                className={classes.linkText}>
                      {humanFileSize(download.current)} / {humanFileSize(download.total)}
                    </Typography>
                    <LinearProgress variant={download.total > 0 ? 'determinate' : 'indeterminate'}
                                    value={download.completed ? 100 : (download.current * 100 / download.total)}
                                    color={'primary'}/>
                  </div>

                }
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }
}

DownloadPage.PropTypes = {};

export default withStyles(styles)(DownloadPage);
