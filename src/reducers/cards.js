export function cardsHasErrored(state = false, action) {
  switch (action.type) {
    case "CARDS_HAS_ERRORED":
      return action.hasErrored;
    default:
      return state;
  }
}
export function cardsIsLoading(state = false, action) {
  switch (action.type) {
    case "CARDS_IS_LOADING":
      return action.isLoading;
    default:
      return state;
  }
}
export function cards(state = [], action) {
  switch (action.type) {
    case "CARDS_FETCH_DATA_SUCCESS":
      return action.cards;
    default:
      return state;
  }
}
export function sets(state = [], action) {
  switch (action.type) {
    case "SETS_FETCH_DATA_SUCCESS":
      return action.sets;
    default:
      return state;
  }
}
export function currentSet(state = "RNA", action) {
  switch (action.type) {
    case "SET_CURRENT_SET":
      return action.set;
    default:
      return state;
  }
}
export function filter(state = [], action) {
  switch (action.type) {
    case "CARDS_FILTER_COLOR":
      return action.cards.filter(t =>
        t.colors ? t.colors.includes(action.color) : false
      );
    case "CARDS_RESET":
      return action.cards;
    default:
      return state;
  }
}

export const visibilityFilter = (
  state = { colors: [], rarity: [] },
  action
) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER_COLORS":
      return {
        ...state,
        colors: state.colors.includes(action.colors)
          ? state.colors.filter(t => t !== action.colors)
          : [...state.colors, action.colors]
      };
    case "SET_VISIBILITY_FILTER_RARITY":
      return {
        ...state,
        rarity: state.rarity.includes(action.rarity)
          ? state.rarity.filter(t => t !== action.rarity)
          : [...state.rarity, action.rarity]
      };
    case "RESET_VISIBILITY_FILTER":
      return {
        colors: [],
        rarity: []
      };
    default:
      return state;
  }
};
