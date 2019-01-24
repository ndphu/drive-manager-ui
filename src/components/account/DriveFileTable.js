import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Table from '@material-ui/core/Table/Table';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import IconButton from '@material-ui/core/IconButton/IconButton';
import {humanFileSize} from "../../utils/StringUtils";
import Hidden from '@material-ui/core/Hidden/Hidden';

const styles = theme => ({
  tableRow: {}
});

class DriveFileTable extends React.Component {

  render = () => {
    const {classes, files, onRowClick, onDownloadClick} = this.props;

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <Hidden lgDown>
              <TableCell>Key</TableCell>
            </Hidden>
            <TableCell>MIME</TableCell>
            <TableCell>Size</TableCell>
            <Hidden mdDown>
              <TableCell>Download</TableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map(file => {
            return (
              <TableRow key={file.id}
                        hover
                        className={classes.tableRow}
                        onClick={() => {
                          onRowClick && onRowClick(file)
                        }}
              >
                <TableCell component="th"
                           scope="row"
                >
                  {file.name}
                </TableCell>
                <Hidden lgDown>
                  <TableCell>{file.id}</TableCell>
                </Hidden>
                <Hidden mdDown>
                  <TableCell>{file.mimeType}</TableCell>
                </Hidden>
                <TableCell>{humanFileSize(file.size)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    onDownloadClick && onDownloadClick(file)
                  }}>
                    <DownloadIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

DriveFileTable.PropTypes = {};

export default withStyles(styles)(DriveFileTable);
