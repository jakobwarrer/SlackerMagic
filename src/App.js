import './App.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { cardsFetchData, filterColor } from './actions/cards';

class App extends Component {
  componentDidMount() {
    this.props.fetchData(
      "https://api.magicthegathering.io/v1/cards?page=2&set=GRN"
    );
  }
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
    `;
    const Item = styled.li`
      flex: 1 0 25%;
      max-width: 25%;
      animation: ${scale} 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
      img {
        width: 100%;
      }
    `;

    // if (this.props.hasErrored) {
    //   return <p>Sorry! There was an error loading the cards</p>;
    // }
    // if (this.props.isLoading) {
    //   return <p>Loading…</p>;
    // }
    // if (!this.props.cards) return null;
    return (
      <div className="App">
        <header className="App-header">
          <button
            onClick={() => this.props.filterColor(this.props.cards, "White")}
          >
            White
          </button>
          <List>
            {this.props.cards.map((card, index) => (
              <Item key={index}>
                <img src={card.imageUrl} alt={`Card front of ${card.name}`} />
              </Item>
            ))}
          </List>
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
    fetchData: url => dispatch(cardsFetchData(url)),
    filterColor: color => dispatch(filterColor(color))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
