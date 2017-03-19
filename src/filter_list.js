import React, { Component } from 'react';
import './filter_list.css';
import _ from 'lodash';

class FilterList extends Component {
  constructor (props) {
    super(props);
    this.state = { filters: this.props.filterStore.getFilters()};
    this.props.filterStore.addListener(this.onFilterChange.bind(this));
  }

  onFilterChange () {
    this.setState({filters: this.props.filterStore.getFilters()});
  }

  removeFilter (filter, isInclude) {
    this.props.filterStore.removeFilter(filter, isInclude);
  }

  render() {

    const filters = this.state.filters
    const [humanInclude, humanExclude] = ['include', 'exclude'].map( (filterType) => {
      return _.truncate(filters[filterType].join(', '), {length: 50});
    });

    const [includeExpandedList, excludeExpandedList] = ['include', 'exclude'].map( (filterType) => {
      return (<ul> {
          filters[filterType].map((filter) =>
            <li key={filter}>
              {filter}
              <button onClick={this.removeFilter.bind(this, filter, filterType === 'include')}>X</button>
            </li>
          )
        } </ul>)
    })

    return (
      <div className='FilterList'>
        <div className='list compactShow'>
          <span className='label'>In:</span>
          {humanInclude}
        </div>
        <div className='list expandedShow'>
          <div className='header expandedShow'>In one of:</div>
          {includeExpandedList}
        </div>

        <div className='list compactShow'>
          <span className='label compactShow'>Not in:</span>
          {humanExclude}
        </div>
        <div className='list expandedShow'>
          <div className='header expandedShow'>But not in:</div>
          {excludeExpandedList}
        </div>
      </div>
    )
  }
}

export default FilterList
