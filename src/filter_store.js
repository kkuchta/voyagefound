import _ from 'lodash'
class FilterStore {
  constructor () {
    // Todo: load from localstorage
    this.filters = {
      include: [],
      exclude: []
    };
    this.listeners = [];
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  addFilter(filter, isInclude) {
    const list = this.filters[isInclude ? 'include' : 'exclude'];
    list.push(filter);
    this.listeners.forEach( (callback) => callback.call() );
  }

  removeFilter(filter, isInclude) {
    const list = this.filters[isInclude ? 'include' : 'exclude'];
    _.pull(list, filter);
    this.listeners.forEach( (callback) => callback.call() );
  }

  getFilters () {
    return {
      include: this.filters.include.slice(),
      exclude: this.filters.exclude.slice()
    }
  }
}
export default FilterStore;
