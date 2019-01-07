import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import {humanFileSize} from '../../utils/StringUtils';

const styles = theme => ({});

class AccountList extends React.Component {
  render = () => {
    const {classes, accounts, onItemClick} = this.props;
    return (
      <div>
        <List>
          {
            accounts.map(account => (
              <ListItem key={`list-item-account-${account._id}`}
                        divider
                        dense
                        button
                        onClick={() => {onItemClick && onItemClick(account)}}
              >
                <ListItemText primary={account.name} secondary={`${humanFileSize(account.usage)}/${humanFileSize(account.limit)}`} />
              </ListItem>
            ))
          }

        </List>
      </div>
    );
  }
}

AccountList.PropTypes = {};

export default withStyles(styles)(AccountList);
