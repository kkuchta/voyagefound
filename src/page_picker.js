import _  from 'lodash';

class PagePicker {
  loadAncestorData = () => {
    return fetch('/ancestors.json')
      .then( (response) => response.json() )
      .then( (json) => {
        this.ancestorData = json
      });
  }

  randomPage = () => {
    return _.sample(this.filtered);
  }

  getAll() {
    return this.getFiltered([],[]);
  }

  getFiltered = (excluded, included) => {
    excluded = excluded || [];
    included = included || [];
    let filtered = []
    _.each(this.ancestorData, (ancestors, page) => {
      let ancestors_plus_page = [page].concat(ancestors || []);
      if (included.length && !_.intersection(included, ancestors_plus_page).length) return;
      if (excluded.length && _.intersection(excluded, ancestors_plus_page).length) return;
      filtered.push(ancestors_plus_page);
    });
    return filtered;
  }

  updateFilters = (excluded, included) => {
    console.log('updating filters', excluded, included);
    this.filtered = this.getFiltered(excluded, included);
  }
}

export default PagePicker
