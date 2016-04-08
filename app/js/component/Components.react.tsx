/// <reference path="../../../typings/browser.d.ts" />

import * as React from 'react';
import * as _ from 'lodash';
import * as ReactDOM from 'react-dom';

const Stateful = React.createClass({
  searchTextChanged() {
    this.setState({
      title: ReactDOM.findDOMNode(this.refs.SearchInput).value
    });
  },
  componentDidMount() {
    console.log("componentDidMount");
  },
  componentWillUnmount() {
    console.log("componentWillUnmount");
  },
  getInitialState() {
    return {
      title: ''
    };
  },
  render() {
    return (
      <div>
        <input type="text" placeholder="Search..." value={this.state.title} onChange={this.searchTextChanged} ref="SearchInput" />
        <Stateless title={this.state.title} />
      </div>
    );
  }
});

const Stateless = ({title}) => {
  return (
    <div className="big-berg">{title}</div>
  );
};

export default Stateful;