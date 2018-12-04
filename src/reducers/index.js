import { combineReducers } from 'redux';

import { cards, cardsHasErrored, cardsIsLoading, filter } from './cards';

export default combineReducers({
  cards,
  cardsHasErrored,
  cardsIsLoading,
  filter
});
