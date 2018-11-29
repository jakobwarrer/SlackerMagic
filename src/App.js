import './App.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { cardsFetchData } from './actions/cards';
import logo from './logo.svg';

class App extends Component {
  componentDidMount() {
    this.props.fetchData(
      "https://api.magicthegathering.io/v1/cards?page=2&set=GRN"
    );
  }
  render() {
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the cards</p>;
    }
    if (this.props.isLoading) {
      return <p>Loading…</p>;
    }
    if (!this.props.cards) return null;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <ul>
            {this.props.cards.map((card, index) => (
              <li key={index}>
                <p>{card.name}</p>
                <img src={card.imageUrl} alt={`Card front of ${card.name}`} />
              </li>
            ))}
          </ul>
        </header>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    cards: state.cards,
    hasErrored: state.cardsHasErrored,
    isLoading: state.cardsIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: url => dispatch(cardsFetchData(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
