export function cardsHasErrored(bool) {
  return {
    type: "CARDS_HAS_ERRORED",
    hasErrored: bool
  };
}
export function cardsIsLoading(bool) {
  return {
    type: "CARDS_IS_LOADING",
    isLoading: bool
  };
}
export function cardsFetchDataSuccess(cards) {
  return {
    type: "CARDS_FETCH_DATA_SUCCESS",
    cards
  };
}

export function errorAfterFiveSeconds() {
  // We return a function instead of an action object
  return dispatch => {
    setTimeout(() => {
      // This function is able to dispatch other action creators
      dispatch(cardsHasErrored(true));
    }, 5000);
  };
}

export function cardsFetchData(url) {
  return dispatch => {
    dispatch(cardsIsLoading(true));
    let page = 0;
    let allCards = [];
    const repeat = () =>
      fetch(`https://api.magicthegathering.io/v1/cards?page=${page}&set=GRN`)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          dispatch(cardsIsLoading(false));

          console.log();
          page++;
          if (response.headers.get("Link").match(/rel="next"/g)) {
            repeat();
          }
          return response;
        })
        .then(response => response.json())
        .then(cards => {
          allCards = allCards.concat(cards.cards);
          dispatch(cardsFetchDataSuccess(allCards));
        })
        .catch(() => dispatch(cardsHasErrored(true)));
    repeat();
  };
}
