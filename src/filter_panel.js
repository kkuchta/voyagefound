import React, { Component } from 'react';
import AddFilter from './add_filter.js'
import FilterList from './filter_list.js'
import './random_button.css'
import './filter_editor.css'

class FilterPanel extends Component {
  render() {
    return (
      <div className='FilterPanel'>
        <RandomButton newRandom={this.props.newRandom} />
        <FilterEditor pages={this.props.pages} filterStore={this.props.filterStore} />
      </div>
    )
  }
}

class FilterEditor extends Component {
  render() {
    return (
      <div className='FilterEditor'>
        <AddFilter pages={this.props.pages} filterStore={this.props.filterStore} />
        <FilterList filterStore={this.props.filterStore} />
      </div>
    )
  }
}

class RandomButton extends Component {
  render() {
    return (
      <div className='RandomButton' onClick={this.props.newRandom}>
        <div className='buttonText'>
          Random<br />place
        </div>
      </div>
    );
  }
}

export default FilterPanel;
