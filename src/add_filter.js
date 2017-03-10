import React, { Component } from 'react';
import _ from 'lodash';
import Autocomplete from 'react-autocomplete';
import './add_filter.css';

// TODO: anglicize umlauts and whatnot so people can actually type them
class AddFilter extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '', selected: null };

    // This is a little ugly, but it works:
    // 1. Build an index of all pages by first letter so we can narrow down our
    //    search space.
    // 2. Precompute the first 10 results for when a user types a single letter
    //    so we can quickly return (rather than having to search all 2k or so
    //    results for the letter `b`.
    this.pageIndex = _.groupBy(this.props.pages, (page) => {
      return page[0][0].toLowerCase();
    });
    this.firstLetterResults = {};
    _.each(this.pageIndex, (pages, firstLetter) => {
      this.firstLetterResults[firstLetter] = _.take(pages.sort(this.sortItems), 10);
    });
    this.pageIndex[''] = [];
  }
  getItems() {
    if (this.state.value === '') {
      return [];
    }

    // Use the precomputed results if they've only typed one letter.
    if (this.state.value.length === 1) {
      return this.firstLetterResults[this.state.value[0].toLowerCase()];
    }

    // Otherwise search the full list of pages starting with the first letter
    // of whatever they've typed
    return this.pageIndex[this.state.value[0].toLowerCase()];
  }

  sortItems(a, b) {
    const aLower = a[0].toLowerCase();
    const bLower = b[0].toLowerCase();
    return aLower < bLower ? -1 : 1;
  }

  shouldItemRender(page, value) {
    //return _.startsWith(page[0].toLowerCase(), value.toLowerCase());
    const pageValue = this.getItemValue(page);
    return _.startsWith(pageValue, value.toLowerCase());
  }

  renderItem(item, isHighlighted) {
    return (<div
      className={isHighlighted ? 'highlighted' : ''}
      key={item.join(' < ')}
    >
      {_.truncate(item.join(' < '), { length: 50 })}
    </div>);
  }

  getItemValue(item) {
    return item.join(' < ').toLowerCase();
  }

  onChange(event, value) {
    this.setState({ value, selected: null });
    //const page = this.getItems().find( (item) => this.getItemValue(item) == 
  }
  onSelect(value, item) {
    this.setState({value: value.toLowerCase(), selected: item});
  }
  addFilter(isInclude) {
    const filter = this.state.selected[0];
    this.props.filterStore.addFilter(filter, isInclude);
  }

  render() {
    const buttonStyle = this.state.selected ? {} : { display: 'none' };
    return (
      <div className='AddFilter'>
        <Autocomplete
          items={this.getItems()}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          onSelect={this.onSelect.bind(this)}
          sortItems={this.sortItems}
          getItemValue={this.getItemValue}
          shouldItemRender={this.shouldItemRender}
          renderItem={this.renderItem}
        />
        <div style={buttonStyle}>
          <button onClick={this.addFilter.bind(this, true)}>+only</button>
          <button onClick={this.addFilter.bind(this, false)}>+except</button>
        </div>
      </div>
    )
  }
}

export default AddFilter
