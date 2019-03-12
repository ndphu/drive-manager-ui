import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Table from '@material-ui/core/Table/Table';
import {humanFileSize} from "../../utils/StringUtils";
import Hidden from '@material-ui/core/Hidden/Hidden';
import IconButton from '@material-ui/core/IconButton/IconButton';
import DownloadIcon from '@material-ui/icons/SaveAltOutlined';
import ViewIcon from '@material-ui/icons/VisibilityOutlined';
import LinkIcon from '@material-ui/icons/LinkOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import UploadIcon from '@material-ui/icons/CloudUploadOutlined';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Divider from '@material-ui/core/Divider/Divider';
import Typography from '@material-ui/core/Typography/Typography';

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
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    top: 96,
    overflowY: 'scroll',
    backgroundColor: "white",
  }


});

class DriveFileTable extends React.Component {
  state = {
    selected: [],
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
    if (this.props.onDownloadClick) {
      this.props.onDownloadClick(
        this.props.files.filter(file => this.state.selected.indexOf(file.id) >= 0)
      );
    }
  };

  render = () => {
    const {classes, files, onRowClick, onDownloadClick, onUploadClick, onRefreshClick, accountName} = this.props;
    const {selected} = this.state;
    return (
      <div>
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
              <IconButton aria-label="Preview" className={classes.margin}>
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
                            onDoubleClick={() => {
                              alert(file.name);
                            }}
                  >
                    <TableCell component="th"
                               scope="row"
                               className={selected ? classes.cellSelected : classes.cell}
                    >
                      {file.name}
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
