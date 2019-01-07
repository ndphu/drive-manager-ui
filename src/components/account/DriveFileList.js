import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import {humanFileSize} from '../../utils/StringUtils';

const styles = theme => ({});

class DriveFileList extends React.Component {
  render = () => {
    const {classes, files, onItemClick} = this.props;
    return (
      <div>
        {
          files.map(file => (
            <ListItem key={`list-item-drive-file-${file.id}`}
                      dense
                      divider
                      button
                      onClick={() => {
                        onItemClick && onItemClick(file)
                      }}
            >
              <ListItemText primary={file.name} secondary={`${humanFileSize(file.size)}`}/>
            </ListItem>
          ))
        }
      </div>
    );
  }
}

DriveFileList.PropTypes = {};

export default withStyles(styles)(DriveFileList);
