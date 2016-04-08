import * as React from 'react';
import * as _ from 'lodash';
import * as ReactDOM from 'react-dom';

interface StatefulState {
  title: string;
};
interface StatefulProps {};

class Stateful extends React.Component<StatefulProps, StatefulState> {
  constructor(props : StatefulProps) {
    super(props);
    this.state = {
      title: ""
    };
  }
  componentDidMount() {
    console.log("componentDidMount");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
  searchTextChanged() {
    this.setState({
      title: ReactDOM.findDOMNode(this.refs.SearchInput).value
    });
  }
  render() {
    return (
      <div>
        <input type="text" placeholder="Search..." value={this.state.title} onChange={this.searchTextChanged.bind(this)} ref="SearchInput" />
        <Stateless title={this.state.title} />
      </div>
    );
  }
}

const Stateless = ({title}) => {
  return (
    <div className="big-berg">{title}</div>
  );
};

export default Stateful;