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
export function setsFetchDataSuccess(sets) {
  return {
    type: "SETS_FETCH_DATA_SUCCESS",
    sets
  };
}
export function setCurrentSet(set) {
  return {
    type: "SET_CURRENT_SET",
    set
  };
}
export function filterColor(colors) {
  return {
    type: "SET_VISIBILITY_FILTER_COLORS",
    colors
  };
}

export function filterRarity(rarity) {
  return {
    type: "SET_VISIBILITY_FILTER_RARITY",
    rarity
  };
}

export function filterReset() {
  return {
    type: "RESET_VISIBILITY_FILTER"
  };
}

export const VisibilityColors = {
  SHOW_WHITE: "W",
  SHOW_BLUE: "U",
  SHOW_BLACK: "B",
  SHOW_RED: "R",
  SHOW_GREEN: "G"
};

export const VisibilityRarity = {
  SHOW_COMMON: "Common",
  SHOW_UNCOMMON: "Uncommon",
  SHOW_RARE: "Rare",
  SHOW_MYTHIC_RARE: "Mythic Rare",
  SHOW_SPECIAL: "Special",
  SHOW_BASIC_LAND: "Basic Land"
};

export function errorAfterFiveSeconds() {
  // We return a function instead of an action object
  return dispatch => {
    setTimeout(() => {
      // This function is able to dispatch other action creators
      dispatch(cardsHasErrored(true));
    }, 5000);
  };
}
export function setsFetchData() {
  return dispatch => {
    dispatch(cardsIsLoading(true));
    let getSets = (sets = []) => {
      let next;
      return new Promise((resolve, reject) =>
        fetch(`https://api.magicthegathering.io/v1/sets`)
          .then(response => {
            if (response.status !== 200) {
              throw `${response.status}: ${response.statusText}`;
            }
            next = response.headers.get("Link").match(/rel="next"/g);
            response
              .json()
              .then(data => {
                sets = sets.concat(data.sets);
                if (next) {
                  getSets(sets)
                    .then(resolve)
                    .catch(reject);
                } else {
                  resolve(sets);
                }
              })
              .catch(reject);
          })
          .catch(reject)
      );
    };
    getSets().then(sets => {
      dispatch(cardsIsLoading(false));
      dispatch(setsFetchDataSuccess(sets));
    });
  };
}
export function cardsFetchData() {
  return (dispatch, getState) => {
    dispatch(cardsIsLoading(true));
    let getCards = (page = 1, cards = []) => {
      let next;
      return new Promise((resolve, reject) =>
        fetch(
          `https://api.magicthegathering.io/v1/cards?page=${page}&set=${
            getState().currentSet
          }`
        )
          .then(response => {
            if (response.status !== 200) {
              throw `${response.status}: ${response.statusText}`;
            }
            next = response.headers.get("Link").match(/rel="next"/g);
            response
              .json()
              .then(data => {
                cards = cards.concat(data.cards);
                if (next) {
                  getCards(page + 1, cards)
                    .then(resolve)
                    .catch(reject);
                } else {
                  resolve(cards);
                }
              })
              .catch(reject);
          })
          .catch(reject)
      );
    };
    getCards().then(cards => {
      dispatch(cardsIsLoading(false));
      dispatch(cardsFetchDataSuccess(cards));
    });
  };
}
// export function cardsFetchData(url) {
//   return dispatch => {
//     dispatch(cardsIsLoading(true));
//     let page = 1;
//     let allCards = [];
//     const repeat = () =>
//       fetch(`https://api.magicthegathering.io/v1/cards?page=${page}&set=GRN`)
//         .then(response => {
//           if (!response.ok) {
//             throw Error(response.statusText);
//           }

//           console.log();
//           page++;
//           if (response.headers.get("Link").match(/rel="next"/g)) {
//             repeat();
//           }
//           return response;
//         })
//         .then(response => response.json())
//         .then(cards => {
//           allCards = allCards.concat(cards.cards);
//           dispatch(cardsFetchDataSuccess(allCards));
//           dispatch(cardsIsLoading(false));
//         })
//         .catch(() => dispatch(cardsHasErrored(true)));
//     repeat();
//   };
// }
