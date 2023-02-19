import React, { useReducer } from 'react';
import merge from "lodash/merge";

const createDataContext = (reducer, actions, initialState) => {
  const Context = React.createContext();

  const Provider = ({ children, appInitialState = {} }) => {
    const mergedState = merge(initialState, appInitialState);
    const [state, dispatch] = useReducer(reducer, mergedState);

    const boundActions = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};

export default createDataContext;
