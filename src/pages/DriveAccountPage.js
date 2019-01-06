import React from "react";
import withStyles from "@material-ui/core/es/styles/withStyles";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import AccountTable from "../components/account/AccountTable";
import accountService from "../services/AccountService";
import navigationService from '../services/NavigationService';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import TableFooter from '@material-ui/core/TableFooter/TableFooter';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';


const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  divider: {
    ...theme.mixins.gutters(),
    marginTop: 8,
    marginBottom: 8,
  },
  footer: {
    width: "100%"
  }
});


class DriveAccountPage extends React.Component {
  state = {
    accounts: [],
    page: 0,
    rowsPerPage: 10,
    totalAccount: 0,
    loading: false,
  };

  componentDidMount = () => {
    this.setState({loading: true});
    accountService.getDriveAccounts(this.state.page + 1, this.state.rowsPerPage)
      .then(resp => this.setState(
        {
          accounts: resp.accounts,
          totalAccount: resp.total,
          page: resp.page - 1,
          rowsPerPage: resp.size,
          loading: false,
        }));
    document.title = 'Accounts'
  };

  handleRowClick = (account) => {
    navigationService.goToAccount(account._id)

  };

  handleChangePage = (e, page) => {
    this.setState({loading: true});
    accountService.getDriveAccounts(page + 1, this.state.rowsPerPage)
      .then(resp => this.setState({
        accounts: resp.accounts,
        totalAccount: resp.total,
        page: resp.page - 1,
        rowsPerPage: resp.size,
        loading: false,
      }))
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({loading: true});
    const rowsPerPage = parseInt(event.target.value);
    accountService.getDriveAccounts(1, rowsPerPage)
      .then(resp => this.setState({
        accounts: resp.accounts,
        totalAccount: resp.total,
        page: resp.page - 1,
        rowsPerPage: resp.size,
        loading: false,
      }))
  };

  render = () => {
    const {classes} = this.props;
    const {accounts, rowsPerPage, page, totalAccount, loading} = this.state;

    return (
      <Paper className={classes.root} elevation={1} square={true}>
        <Typography variant="h5" component="h3" color={"primary"}>
          Storage Account
        </Typography>
        {accounts && accounts.length > 0 &&
        <AccountTable accounts={accounts}
                      onRowClick={this.handleRowClick}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      totalAccount={totalAccount}
                      handleChangePage={this.handleChangePage}
                      handleChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        }

        {loading && <LinearProgress/>}
        <div className={classes.divider}/>
      </Paper>
    )
  }
}

export default withStyles(styles)(DriveAccountPage)