import React from "react";
import TableHead from "@material-ui/core/TableHead/TableHead";
import Table from "@material-ui/core/Table/Table";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import withStyles from "@material-ui/core/styles/withStyles";
import {getAccountUsagePercent, humanFileSize} from '../../utils/StringUtils';
import Hidden from '@material-ui/core/Hidden/Hidden';


const styles = theme => ({
  tableRow: {
    cursor: 'pointer',
  }
});

class AccountTable extends React.Component {
  render = () => {
    const {classes, accounts, onRowClick} = this.props;
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <Hidden mdDown>
              <TableCell>Client Id</TableCell>
            </Hidden>
            <Hidden lgDown>
              <TableCell>Email</TableCell>
            </Hidden>
            <TableCell>Usage</TableCell>
            <TableCell>Limit</TableCell>
            <TableCell>Percent</TableCell>
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
                <Hidden mdDown>
                  <TableCell>{account.clientId}</TableCell>
                </Hidden>
                <Hidden lgDown>
                  <TableCell>{account.clientEmail}</TableCell>
                </Hidden>
                <TableCell>{humanFileSize(account.usage)}</TableCell>
                <TableCell>{humanFileSize(account.limit)}</TableCell>
                <TableCell>{getAccountUsagePercent(account.usage, account.limit)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    )
  }
}

export default withStyles(styles)(AccountTable);