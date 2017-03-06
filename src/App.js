import React, { Component } from 'react';
import _  from 'lodash';
import './App.css';

fetch('/ancestors.json')
  .then( (response) => response.json() )
  .then( (json) => {
    console.log('loaded json');
    window.ancestorData = json
  });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { pageTitle: '' };
  }
  newRandom = () => {
    console.log('App.newRandom called with this=', this);
    const newPageTitle = _(window.ancestorData).keys().sample();
    console.log('newPageTitle=', newPageTitle);
    console.log('{ pageTitle: newPageTitle }', { pageTitle: newPageTitle });
    this.setState({ pageTitle: newPageTitle });
  }

  render() {
    return (
      <div className="App">
        pageTitle= {this.state.pageTitle}
        <Tree />
        <RandomButton newRandom={this.newRandom.bind(this)} />
        <Link pageTitle={this.state.pageTitle} />
      </div>
    );
  }
}

class Tree extends Component {
  render() {
    return (
      <div>
        Tree Here
      </div>
    )
  }
}

class RandomButton extends Component {
  render() {
    return (
      <button onClick={this.props.newRandom}>
        Random Button
      </button>
    );
  }
}

class Link extends Component {
  url = (pageTitle) => {
    return "https://en.wikivoyage.org/wiki/" + pageTitle;
  }
  render() {
    return (
      <iframe className='wiki-frame' src={this.url(this.props.pageTitle)} />
      //<div>
        //<a href={this.url(this.props.pageTitle)}>{this.url(this.props.pageTitle)}</a>
      //</div>
    )
  }
}

export default App;
