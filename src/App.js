import './App.css';

import { Button, CircularProgress, withStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React, { Component } from 'react';
import Img from 'react-image';
import LazyLoad from 'react-lazyload';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import {
  cardsFetchData,
  filterColor,
  filterRarity,
  filterReset,
  setCurrentSet,
  setsFetchData,
  VisibilityColors,
  VisibilityRarity,
} from './actions/cards';
import CountDownTimer from './components/CountDownTimer';

const styles = theme => ({
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: `${theme.spacing.unit}px 0`
  },
  toggleGroup: {
    background: theme.palette.background.default
  }
});
class App extends Component {
  componentDidMount() {
    this.props.fetchData(
      "https://api.magicthegathering.io/v1/cards?page=2&set=GRN"
    );
    this.props.fetchSets();
  }
  handleColor = (event, color) => this.props.filterColorClick(color);
  handleRarity = (event, rarity) => this.props.filterRarityClick(rarity);
  handleSet = (event, set) => {
    this.props.setSet(event.target.value);
    this.props.fetchData(
      "https://api.magicthegathering.io/v1/cards?page=2&set=GRN"
    );
  };
  render() {
    const scale = keyframes`
      from {
        transform: scale(0);
      }

      to {
        transform: scale(1);
      }
    `;
    const List = styled.ul`
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      width: 100%;
      margin-top: 3rem;
    `;
    const Item = styled.li`
      flex: 1 0 ${100 / 4}%;
      width: ${100 / 4}%;
      max-width: ${100 / 4}%;
      height: 0;
      padding-bottom: ${((88 / 63) * 100) / 4}%;
      position: relative;
      animation: ${scale} 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
      :after {
        content: "";
        padding-bottom: 139.68%;
      }
      img {
        width: 100%;
      }
    `;

    return (
      <div className="App">
        <header className="App-header">
          <CountDownTimer targetDate={"Feb 23, 2019 15:00:00"} />
          <FormControl className={this.props.classes.toggleContainer}>
            <InputLabel htmlFor="code">Set</InputLabel>
            <Select
              className={this.props.classes.toggleGroup}
              value={this.props.currentSet}
              onChange={this.handleSet}
              inputProps={{
                name: "name",
                id: "code"
              }}
            >
              {this.props.sets.map((card, index) => (
                <MenuItem value={card.code} key={index}>
                  {card.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={this.props.classes.toggleContainer}>
            <ToggleButtonGroup
              className={this.props.classes.toggleGroup}
              value={this.props.filters.colors}
              exclusive
              onChange={this.handleColor}
            >
              <ToggleButton color="primary" value={VisibilityColors.SHOW_WHITE}>
                <i className="ms ms-w ms-cost" />
              </ToggleButton>
              <ToggleButton color="primary" value={VisibilityColors.SHOW_BLUE}>
                <i className="ms ms-u ms-cost" />
              </ToggleButton>
              <ToggleButton color="primary" value={VisibilityColors.SHOW_BLACK}>
                <i className="ms ms-b ms-cost" />
              </ToggleButton>
              <ToggleButton color="primary" value={VisibilityColors.SHOW_RED}>
                <i className="ms ms-r ms-cost" />
              </ToggleButton>
              <ToggleButton color="primary" value={VisibilityColors.SHOW_GREEN}>
                <i className="ms ms-g ms-cost" />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className={this.props.classes.toggleContainer}>
            <ToggleButtonGroup
              className={this.props.classes.toggleGroup}
              value={this.props.filters.rarity}
              exclusive
              onChange={this.handleRarity}
            >
              <ToggleButton
                color="primary"
                value={VisibilityRarity.SHOW_COMMON}
              >
                Common
              </ToggleButton>
              <ToggleButton
                color="primary"
                value={VisibilityRarity.SHOW_UNCOMMON}
              >
                Uncommon
              </ToggleButton>
              <ToggleButton color="primary" value={VisibilityRarity.SHOW_RARE}>
                Rare
              </ToggleButton>
              <ToggleButton
                color="primary"
                value={VisibilityRarity.SHOW_MYTHIC_RARE}
              >
                Mythic Rare
              </ToggleButton>
              <ToggleButton
                color="primary"
                value={VisibilityRarity.SHOW_SPECIAL}
              >
                Special
              </ToggleButton>
              <ToggleButton
                color="primary"
                value={VisibilityRarity.SHOW_BASIC_LAND}
              >
                Basic Land
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => this.props.reset()}
          >
            Reset
          </Button>

          {this.props.isLoading ? (
            <CircularProgress />
          ) : (
            <List>
              {this.props.cards.map((card, index) => (
                <Item key={index}>
                  <LazyLoad offset={100}>
                    <Img
                      src={card.imageUrl}
                      alt={`Card front of ${card.name}`}
                    />
                  </LazyLoad>
                </Item>
              ))}
            </List>
          )}
        </header>
      </div>
    );
  }
}
const getColorCards = (cards, filter) => {
  let filteredCards = cards;
  filteredCards =
    filter.colors.length > 0
      ? filteredCards.filter(t =>
          t.colorIdentity
            ? t.colorIdentity.find(color => filter.colors.includes(color))
            : false
        )
      : filteredCards;
  filteredCards =
    filter.rarity.length > 0
      ? filteredCards.filter(t =>
          t.rarity ? filter.rarity.includes(t.rarity) : false
        )
      : filteredCards;

  return filteredCards;
};
const sortDate = sets => {
  return sets.sort((a, b) => {
    return (
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  });
};
const mapStateToProps = state => {
  return {
    cards: getColorCards(state.cards, state.visibilityFilter),
    sets: sortDate(state.sets),
    currentSet: state.currentSet,
    filters: state.visibilityFilter,
    hasErrored: state.cardsHasErrored,
    isLoading: state.cardsIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filterColorClick: color => dispatch(filterColor(color)),
    filterRarityClick: rarity => dispatch(filterRarity(rarity)),
    reset: () => dispatch(filterReset()),
    fetchData: url => dispatch(cardsFetchData(url)),
    fetchSets: () => dispatch(setsFetchData()),
    filterColor: color => dispatch(filterColor(color)),
    setSet: set => dispatch(setCurrentSet(set))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
