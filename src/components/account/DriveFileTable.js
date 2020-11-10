import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Table from '@material-ui/core/Table/Table';
import {humanFileSize} from "../../utils/StringUtils";
import IconButton from '@material-ui/core/IconButton/IconButton';
import DownloadIcon from '@material-ui/icons/SaveAltOutlined';
import ViewIcon from '@material-ui/icons/VisibilityOutlined';
import LinkIcon from '@material-ui/icons/LinkOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import UploadIcon from '@material-ui/icons/CloudUploadOutlined';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Divider from '@material-ui/core/Divider/Divider';
import Dialog from "@material-ui/core/Dialog/Dialog";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button/Button";
import CloseIcon from '@material-ui/icons/Close';
import accountService from "../../services/AccountService";
import {BigPlayButton, Player} from "video-react";
import Typography from "@material-ui/core/Typography/Typography";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const styles = theme => ({
    tableRow: {
        cursor: "pointer",
    },
    tableRowSelected: {
        backgroundColor: "#E8EAF6!important",
    },
    cell: {
        fontSize: "14px!important",
        fontWeight: "500",
        color: "rgba(0,0,0,.72)"
    },
    cellSelected: {
        fontSize: "14px!important",
        color: "#303F9F",
        fontWeight: "500",
    },
    tableRowHover: {
        backgroundColor: "#9FA8DA!important",
    },
    grow: {
        flexGrow: 1,
    },
    tableWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 0,
        top: 96,
        overflowY: 'scroll',
        backgroundColor: "white",
    },

    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing.unit * 2,
        flex: 1,
    },
});

class DriveFileTable extends React.Component {
    state = {
        selected: [],
        preview: false,
    };

    toggleSelected = (fileId) => {
        const {selected} = this.state;
        const existing = selected.indexOf(fileId);
        let newSelected = [];
        if (this.state.multiSelect) {
            newSelected = [...selected];
        }
        if (existing < 0) {
            newSelected.push(fileId);
        } else {
            newSelected.splice(existing, 1)
        }
        this.setState({selected: newSelected});
    };

    handleDownload = () => {
        const _this = this;
        const selected = this.props.files.find(file => _this.state.selected.indexOf(file.id) >= 0)
        accountService.getSharableLink(this.props.accountId, selected.id).then(resp => {
            window.open(`https://drive.google.com/uc?id=${resp.file.id}&export=download`, "_blank")
        })
    };

    handlePreview = () => {
        const _this = this;
        this.setState({preview: true, previewItem: null}, function () {
            const selected = this.props.files.find(file => _this.state.selected.indexOf(file.id) >= 0)
            accountService.getSharableLink(this.props.accountId, selected.id).then(resp => {
                console.log(resp);
                _this.setState({
                    previewLink: `https://drive.google.com/uc?id=${resp.file.id}&export=download`,
                    contentType: resp.file.mimeType.startsWith('image') ? 'image' : (resp.file.mimeType.startsWith('video') ? 'video': null),
                })
            })
        })
    };

    handlePreviewClose = () => {
        this.setState({preview: false})
    };

    render = () => {
        const {classes, files, onRowClick, onDownloadClick, onUploadClick, onRefreshClick, accountName,} = this.props;
        const {selected, preview, previewLink, contentType} = this.state;
        return (
            <div>
                <Dialog fullScreen open={preview} onClose={this.handlePreviewClose}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={this.handlePreviewClose}
                                        aria-label="close">
                                <CloseIcon/>
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Sound
                            </Typography>
                            <Button autoFocus color="inherit" onClick={this.handleDownload}>
                                Download
                            </Button>
                        </Toolbar>
                    </AppBar>
                    {previewLink && contentType === 'video' &&
                    <Player
                        ref={'player'}
                        playsInline={true}
                        preload={'metadata'}
                        autoPlay={true}
                        fluid={false}
                        src={previewLink}>
                        <BigPlayButton position="center"/>
                    </Player>
                    }
                    {previewLink && contentType === 'image' &&
                    <img src={previewLink}/>
                     }
                </Dialog>
                <div>
                    <Toolbar variant={'dense'}>
                        <Typography
                            variant="title"
                            color={"primary"}>
                            {accountName}
                        </Typography>
                        <div className={classes.grow}/>
                        {selected.length > 0 &&
                        <React.Fragment>
                            <IconButton aria-label="Download" className={classes.margin}
                                        onClick={this.handleDownload}>
                                <DownloadIcon/>
                            </IconButton>
                            <IconButton aria-label="Preview" className={classes.margin}
                                        onClick={this.handlePreview}>
                                <ViewIcon/>
                            </IconButton>
                            <IconButton aria-label="Link" className={classes.margin}>
                                <LinkIcon/>
                            </IconButton>
                            <IconButton aria-label="Delete" className={classes.margin}>
                                <DeleteIcon/>
                            </IconButton>
                        </React.Fragment>
                        }
                        <Typography
                            color="inherit"
                            style={{
                                borderRight: '2px solid lightgrey',
                                paddingTop: '0.9em',
                                paddingBottom: '0.9em',
                                marginLeft: 8,
                                marginRight: 8
                            }}
                        >
                        </Typography>
                        <div>
                            <IconButton aria-label="Refresh" className={classes.margin}
                                        onClick={onRefreshClick}>
                                <RefreshIcon color={'primary'}/>
                            </IconButton>
                            <IconButton aria-label="Upload" className={classes.margin}
                                        onClick={onUploadClick}>
                                <UploadIcon color={'primary'}/>
                            </IconButton>
                        </div>
                    </Toolbar>
                    <Divider/>
                </div>
                <div className={classes.tableWrapper}>
                    <Table>
                        <TableBody>
                            {files.map(file => {
                                let selected = this.state.selected.indexOf(file.id) >= 0;
                                return (
                                    <TableRow key={file.id}
                                              selected={selected}
                                              classes={{selected: classes.tableRowSelected}}
                                              onClick={(e) => {
                                                  if (e.detail > 1) {
                                                      return;
                                                  }
                                                  this.toggleSelected(file.id);
                                              }}
                                    >
                                        <TableCell component="th"
                                                   scope="row"
                                                   className={selected ? classes.cellSelected : classes.cell}
                                        >
                                            {file.name}
                                        </TableCell>
                                        <TableCell component="th"
                                                   scope="row"
                                                   className={selected ? classes.cellSelected : classes.cell}
                                        >
                                            {file.mimeType}
                                        </TableCell>
                                        <TableCell className={selected ? classes.cellSelected : classes.cell}>
                                            {humanFileSize(file.size)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

            </div>
        );
    }
}

DriveFileTable.PropTypes = {};

export default withStyles(styles)(DriveFileTable);
