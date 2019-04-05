import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';


const TITLE_REGEX = /Game Thread: (.*) @ (.*) \((.*)\)/;
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

function isValidUrl(u) {
  return !['reddit', 'discord'].some(t => u.includes(t));
}

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}


const styles = {
  cardContainer: {
    minWidth: '85%',
    maxWidth: '85%',
  },
  card: {
    backgroundColor: '#ffffff',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

class Game extends React.Component {
  constructor(props) {
    super(props);

    const collect = TITLE_REGEX.exec(props.gameData.title);

    [, this.teamOne, this.teamTwo] = collect;

    const timeParts = collect[3].split(' ');
    const date = new Date();
    const [hours, minutes] = timeParts[0].split(':');


    date.setHours(hours - 3);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    this.date = date;

    this.comments = props.gameData.comments.map((c) => {
      const urls = [];
      let m;
      do {
        m = URL_REGEX.exec(c.body);
        if (m) {
          urls.push(m[0]);
        }
      } while (m);
      return {
        html: c.body_html,
        body: c.body,
        author: c.author,
        urls,
      };
    });
  }

  render() {
    const { gameData: { url }, classes } = this.props;
    const header = `${this.teamOne} vs. ${this.teamTwo}`;
    return (
      <Grid item className={classes.cardContainer}>
        <ExpansionPanel className={classes.card}>
          <ExpansionPanelSummary>
            <Grid container direction="row">
              <Grid item><Link variant="h3" href={url}>{header}</Link></Grid>
              <Grid item><Typography variant="h4">{this.date.toLocaleTimeString()}</Typography></Grid>
            </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List>
              {this.comments.map(c => c.urls.filter(isValidUrl).map(u => (
                <ListItemLink href={u} key={`link-${u}`}>{`${u} (u/${c.author})`}</ListItemLink>
              )))}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </Grid>
    );
  }
}

export default withStyles(styles)(Game);
