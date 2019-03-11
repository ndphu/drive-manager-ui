import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Table from '@material-ui/core/Table/Table';
import {humanFileSize} from "../../utils/StringUtils";
import Hidden from '@material-ui/core/Hidden/Hidden';

const styles = theme => ({
    tableRow: {
        cursor: "pointer",
    },
    tableRowSelected: {
        backgroundColor: "#E8EAF6!important",
    },
    cellSelected: {
        color: "#303F9F",
        fontWeight: "500",
    },
    tableRowHover: {
        backgroundColor: "#9FA8DA!important",
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
                                      onContextMenu={(e) => {
                                          e.preventDefault();
                                      }}
                            >
                                <TableCell component="th"
                                           scope="row"
                                           className={selected && classes.cellSelected}
                                >
                                    {file.name}
                                </TableCell>
                                <Hidden lgDown>
                                    <TableCell className={selected && classes.cellSelected}>
                                        {file.id}
                                    </TableCell>
                                </Hidden>
                                <TableCell className={selected && classes.cellSelected}>
                                    {file.mimeType}
                                </TableCell>
                                <TableCell className={selected && classes.cellSelected}>{humanFileSize(file.size)}
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
