import React, { Component } from 'react';
import AddFilter from './add_filter.js'
import FilterList from './filter_list.js'
import RandomButton from './random_button.js'
import './random_button.css'
import './filter_editor.css'

class FilterPanel extends Component {
  render() {
    return (
      <div className='FilterPanel'>
        <RandomButton newRandom={this.props.newRandom} />
        <FilterList filterStore={this.props.filterStore} />
        <AddFilter pages={this.props.pages} filterStore={this.props.filterStore} />
        <div className='toggleCompact' onClick={this.props.toggleCompact}>
          <i className='compactShow fa fa-caret-left' />
          <i className='expandedShow fa fa-caret-down' />
        </div>
        <div className='divider'></div>
      </div>
    )
  }
}

export default FilterPanel;
