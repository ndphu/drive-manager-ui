import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import {getAccountUsagePercent, humanFileSize} from '../../utils/StringUtils';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import FolderIcon from '@material-ui/icons/FolderOutlined'
import PropTypes from 'prop-types';

const styles = theme => ({});

const getSecondaryText = (account) => {
  return `${humanFileSize(account.usage)} of ${humanFileSize(account.limit)} usage - ${getAccountUsagePercent(account.usage, account.limit)}`
};

class AccountList extends React.Component {
  render = () => {
    const {classes, accounts, onItemClick} = this.props;
    return (
      <List>
        {
          accounts.map(account => (
            <ListItem key={`list-item-account-${account._id}`}
                      divider
                      button
                      onClick={() => {
                        onItemClick && onItemClick(account)
                      }}
            >
              <ListItemIcon>
                <FolderIcon color={'primary'}/>
              </ListItemIcon>
              <ListItemText primary={account.name}
                            secondary={getSecondaryText(account)}
              />
            </ListItem>
          ))
        }

      </List>
    );
  }
}

AccountList.PropTypes = {
  onItemClick: PropTypes.func,
};

export default withStyles(styles)(AccountList);
