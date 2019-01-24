import React from "react";
import withStyles from "@material-ui/core/es/styles/withStyles";
import Paper from "@material-ui/core/Paper/Paper";
import AccountTable from "../components/account/AccountTable";
import accountService from "../services/AccountService";
import navigationService from '../services/NavigationService';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Hidden from '@material-ui/core/Hidden/Hidden';
import AccountList from '../components/account/AccountList'
import queryString from 'query-string'
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography/Typography';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    margin: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing.unit,
    },
  },
  divider: {
    ...theme.mixins.gutters(),
    marginTop: 8,
    marginBottom: 8,
  },
  footer: {
    width: "100%"
  },
  accountName: {
    ...theme.mixins.gutters(),
  },
  pagingContainer: {
    margin: theme.spacing.unit * 2,
  }
});


class DriveAccountPage extends React.Component {
  state = {
    accounts: [],
    page: 0,
    rowsPerPage: 10,
    loading: false,
  };

  componentDidMount = () => {
    const values = queryString.parse(this.props.location.search);
    const page = values.page ? values.page : 1;
    const size = values.size ? values.size : 10;
    this.setState({loading: true}, function () {
      accountService.getDriveAccounts(page, size)
        .then(resp => {
          this.setState(
            {
              accounts: resp.accounts,
              hasMore: resp.hasMore,
              page: resp.page,
              rowsPerPage: resp.size,
              loading: false,
            });
          document.title = 'Accounts';
        });
    });
  };

  componentDidUpdate = (prevProps) => {
    const values = queryString.parse(prevProps.location.search);
    const nextValues = queryString.parse(this.props.location.search);
    const nextPage = nextValues.page ? nextValues.page : 1;
    const nextSize = nextValues.size ? nextValues.size : 10;
    if (nextValues.page === values.page && nextValues.size === values.size) {
      return
    }
    if ((nextPage !== values.page && nextPage !== this.state.page)
      || (nextSize !== values.size && nextSize !== this.state.rowsPerPage)) {
      this.setState({loading: true}, function () {
        accountService.getDriveAccounts(nextPage, nextSize)
          .then(resp => {
            this.setState(
              {
                accounts: resp.accounts,
                hasMore: resp.hasMore,
                page: resp.page,
                rowsPerPage: resp.size,
                loading: false,
              });
            document.title = 'Accounts';
          });
      });
    }
  };

  handleRowClick = (account) => {
    navigationService.goToAccount(account._id)

  };

  handlePreviousClick = () => {
    navigationService.goToAccountsPage(this.state.page - 1, this.state.rowsPerPage);
  };

  handleNextClick = () => {
    navigationService.goToAccountsPage(this.state.page + 1, this.state.rowsPerPage);
  };

  render = () => {
    const {classes} = this.props;
    const {accounts, rowsPerPage, page, hasMore, loading} = this.state;

    return (
      <Paper className={classes.root} elevation={1} square={true}>
        {accounts && accounts.length > 0 &&
        (
          <div>
            <Hidden xsDown>
              <AccountTable accounts={accounts}
                            onRowClick={this.handleRowClick}
                            rowsPerPage={rowsPerPage}
                            page={page}
              />
            </Hidden>
            <Hidden smUp>
              <Typography
                className={classes.accountName}
                variant="title"
                color={"primary"}>
                Accounts
              </Typography>
              <AccountList accounts={accounts}
                           onItemClick={this.handleRowClick}/>
            </Hidden>
          </div>

        )
        }
        <div className={classes.divider}/>
        <div className={classes.pagingContainer}>
          <Button color={'secondary'}
                  onClick={this.handlePreviousClick}
                  disabled={loading || this.state.page <= 1}>
            Previous
          </Button>
          <Button color={'secondary'}
                  onClick={this.handleNextClick}
                  disabled={loading || !hasMore}>
            Next</Button>
        </div>

        {loading && <LinearProgress/>}

      </Paper>
    )
  }
}

export default withStyles(styles)(DriveAccountPage)