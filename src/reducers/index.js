import { combineReducers } from 'redux';

import { cards, cardsHasErrored, cardsIsLoading, currentSet, filter, sets, visibilityFilter } from './cards';

export default combineReducers({
  cards,
  sets,
  currentSet,
  cardsHasErrored,
  cardsIsLoading,
  filter,
  visibilityFilter
});
