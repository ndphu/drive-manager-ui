import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import {humanFileSize} from '../../utils/StringUtils';
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List/List";

const styles = theme => ({
    primary: {
        fontSize: 14,
    },
    secondary: {
        fontSize: 11,
    }
});

class DriveFileList extends React.Component {
    render = () => {
        const {classes, files, onItemClick, hideDivider, hideSecondary} = this.props;
        return (
            <div>
                <List>
                    {
                        files.map(file => (
                            <ListItem key={`list-item-drive-file-${file.id}`}
                                      divider={!hideDivider}
                                      dense
                                      button
                                      onClick={() => {
                                          onItemClick && onItemClick(file)
                                      }}
                            >
                                <ListItemText primary={file.name}
                                              secondary={hideSecondary ? '' : `${humanFileSize(file.size)} ${file.mimeType}`}
                                />
                            </ListItem>
                        ))
                    }

                </List>
            </div>
        );
    }
}

DriveFileList.PropTypes = {};

export default withStyles(styles)(DriveFileList);
