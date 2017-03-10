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

  updateFilters = (excluded, included) => {
    excluded = excluded || [];
    included = included || [];
    this.filtered = [];
    _.each(this.ancestorData, (ancestors, page) => {
      let ancestors_plus_page = [page].concat(ancestors || []);
      if (included.length && !_.intersection(included, ancestors_plus_page).length) return;
      if (excluded.length && _.intersection(excluded, ancestors_plus_page).length) return;
      this.filtered.push(ancestors_plus_page);
    });
  }
}

export default PagePicker
