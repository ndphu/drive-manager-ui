import React from "react";
import TableHead from "@material-ui/core/TableHead/TableHead";
import Table from "@material-ui/core/Table/Table";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import withStyles from "@material-ui/core/styles/withStyles";
import {humanFileSize} from '../../utils/StringUtils';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import TableFooter from '@material-ui/core/TableFooter/TableFooter';


const styles = theme => ({
  tableRow: {
    cursor: 'pointer',
  }
});

class AccountTable extends React.Component {
  render = () => {
    const {classes, accounts, onRowClick,
      totalAccount, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage} = this.props;


    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Client Id</TableCell>
            <TableCell>Client Email</TableCell>
            <TableCell>Usage</TableCell>
            <TableCell>Limit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map(account => {
            return (
              <TableRow key={account._id}
                        hover
                        className={classes.tableRow}
                        onClick={() => {onRowClick && onRowClick(account)}}
              >
                <TableCell component="th"
                           scope="row"
                >
                  {account.name}
                </TableCell>
                <TableCell>{account.clientId}</TableCell>
                <TableCell>{account.clientEmail}</TableCell>
                <TableCell>{humanFileSize(account.usage)}</TableCell>
                <TableCell>{humanFileSize(account.limit)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter className={classes.footer}>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={totalAccount}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
}

export default withStyles(styles)(AccountTable);