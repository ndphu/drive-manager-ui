import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper/Paper';
import accountService from '../services/AccountService';
import Typography from '@material-ui/core/Typography/Typography';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import DriveFileTable from '../components/account/DriveFileTable';
import {humanFileSize} from "../utils/StringUtils";
import '../../node_modules/video-react/dist/video-react.css';
import Slide from '@material-ui/core/Slide/Slide';
import Hidden from '@material-ui/core/Hidden/Hidden';
import DriveFileList from '../components/account/DriveFileList';
import Divider from '@material-ui/core/Divider/Divider';
import navigationService from '../services/NavigationService';
import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import {createWriteStream} from 'streamsaver';

const styles = theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing.unit,
    },
    backgroundColor: 'white',
  },
  accountName: {
    ...theme.mixins.gutters(),
  },
  textGutter: {
    ...theme.mixins.gutters(),
  },
  spacer: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  quotaContainer: {
    display: "flex",
    alignItems: "center",
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

  componentDidUpdate = (prevProps) => {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.load()
    }
  };

  handleFileClick = (file) => {
    if (file.mimeType === 'video/mp4') {
      this.showVideo(file);
    }
  };

  showVideo = (file) => {
    navigationService.goToVideoView(this.state.account._id, file.id);
  };

  handleDownloadClick = (files) => {
    files.forEach((file) => {
      accountService.getDownloadLink(this.state.account.id, file.id).then(resp => {
        const link = resp.link;
        fetch(link).then(res => {
          const fileStream = createWriteStream(file.name);
          const writer = fileStream.getWriter();
          const reader = res.body.getReader();
          const pump = () => reader.read()
            .then(({value, done}) => done
              ? writer.close()
              : writer.write(value).then(pump)
            );
          pump().then(() =>
            console.log('Closed the stream, Done writing')
          )
        });
      });
    });

  };

  load = () => {
    const _this = this;
    accountService.getAccountById(this.props.match.params.id)
      .then(account => {
        document.title = account.name;
        this.setState({account}, function () {
          accountService.getAccountFiles(account.id, _this.state.page, _this.state.size)
            .then(files => {
              this.setState({files})
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

  onFileSelected = event => {
    const selectedFiles = [...event.target.files];
    const _this = this;
    selectedFiles.forEach(f => {
      f.state = 'Pending';
    });
    this.setState({
      selectedFiles: selectedFiles,
      openUploadDialog: event.target.files && event.target.files.length > 0,
    }, function () {
      const account = _this.state.account;
      const selectedFiles = _this.state.selectedFiles;
      let uploadedCount = 0;
      this.setState({uploading: true}, function () {
        selectedFiles.forEach(f => {
          f.state = 'Uploading';
          accountService.uploadFile(account.id, f).then(resp => {
            uploadedCount++;
            f.state = 'Completed';
            const isDone = uploadedCount === selectedFiles.length;
            this.setState({openUploadDialog: !isDone, uploading: !isDone}, function () {
              if (isDone) {
                _this.load();
              }
            });
          });
        });
        this.setState({});
      });
    });
  };

  handleUploadClick = () => {

  };

  handleUploadDialogClose = () => {
    this.setState({openUploadDialog: false});
  };

  handleRefreshClick = () => {
    this.load();
  };

  render = () => {
    const {classes} = this.props;
    const {account, files, refreshingQuota, selectedFiles, openUploadDialog, uploading} = this.state;
    const dialog =
      <Dialog open={openUploadDialog}
              fullWidth
      >
        <DialogTitle>
          Upload Files
        </DialogTitle>
        <DialogContent>
          <List>
            {selectedFiles && selectedFiles.map(f =>
              <ListItem key={f.name}
                        divider
              >
                <ListItemText
                  primary={f.name}
                  secondary={`${humanFileSize(f.size)} - ${f.state}`}
                />
              </ListItem>)}
          </List>
          {uploading && <LinearProgress color={'secondary'} variant={'indeterminate'}/>}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleUploadClick}
                  color={'primary'}
                  disabled={uploading}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>;

    return (
      <div className={classes.root}>
        {dialog}
        {account &&
        <div>
          <Hidden xsDown>
            <DriveFileTable files={files}
                            accountName={account.name}
                            onRowClick={this.handleFileClick}
                            onDownloadClick={this.handleDownloadClick}
                            onUploadClick={() => {this.inputElement.click();}}
                            onRefreshClick={this.handleRefreshClick}
            />
          </Hidden>
          <Hidden smUp>
            <DriveFileList files={files}
                           onItemClick={this.handleFileClick}/>
          </Hidden>
        </div>
        }
        <input type='file'
               ref={input => this.inputElement = input}
               style={{display: 'none'}}
               onChange={this.onFileSelected}
               multiple/>
      </div>
    );
  }
}

DriveAccountDetailsPage.PropTypes = {};

export default withStyles(styles)(DriveAccountDetailsPage);
