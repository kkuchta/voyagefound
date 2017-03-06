import React, { Component } from 'react';
import _  from 'lodash';

import './App.css';
import PagePicker from './pagePicker.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { pageTitle: '', loaded: false };
    this.pagePicker = new PagePicker();
    this.pagePicker.loadAncestorData().then(() => {
      this.pagePicker.updateFilters(['United States of America', 'Europe', 'Africa'], ['Asia']);
      this.setState({loaded: true});
    });
  }
  newRandom = () => {
    console.log('App.newRandom');
    const newPageTitle = this.pagePicker.randomPage();
    this.setState({ pageTitle: newPageTitle });
  }

  render() {
    let content = 'loading...';
    if (this.state.loaded) {
      content = (
        <div className='loaded'>
          pageTitle= {this.state.pageTitle}
          <Tree />
          <RandomButton newRandom={this.newRandom.bind(this)} />
          <Link pageTitle={this.state.pageTitle} />
        </div>
      )
    }
    return (
      <div className="App">
        {content}
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
        Random
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
