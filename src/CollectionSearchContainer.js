import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
// import { get } from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import CollectionsView from './CollectionsView';
import filterConfig from './filterConfigData';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

class CollectionSearchContainer extends React.Component {
  static manifest = Object.freeze({
    metadataCollections: {
      type: 'okapi',
      records: 'fincConfigMetadataCollections',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      path: 'finc-config/metadata-collections',
      resourceShouldRefresh: true,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(label="%{query.query}*")',
            {
              'Collection Name': 'label'
            },
            filterConfig,
            2,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    mdSources: {
      type: 'okapi',
      records: 'tinyMetadataSources',
      path: 'finc-config/tiny-metadata-sources',
      resourceShouldRefresh: true
    },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    filterId: PropTypes.string,
    collectionIds: PropTypes.arrayOf(PropTypes.object),
    isEditable: PropTypes.bool,
    mutator: PropTypes.object,
    onSelectRow: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      logger: PropTypes.object,
      okapi: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();
  }

  componentDidMount() {
    this.collection = new StripesConnectedSource(this.props, this.logger, 'metadataCollections');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }

    this.props.mutator.query.update({
      filters: 'permitted.yes,selected.yes',
    });
  }

  querySetter = ({ nsValues }) => {
    this.props.mutator.query.update(nsValues);
  }

  queryGetter = () => {
    return _.get(this.props.resources, 'query', {});
  }

  handleNeedMoreData = () => {
    if (this.collection) {
      this.collection.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  onChangeIndex = (e) => {
    const qindex = e.target.value;

    this.props.mutator.query.update({ qindex });
  }

  render() {
    const { onSelectRow, resources } = this.props;

    if (this.collection) {
      this.collection.update(this.props, 'metadataCollections');
    }

    return (
      <CollectionsView
        filterId={this.props.filterId}
        collectionIds={this.props.collectionIds}
        isEditable={this.props.isEditable}
        contentData={_.get(resources, 'metadataCollections.records', [])}
        onNeedMoreData={this.handleNeedMoreData}
        onSelectRow={onSelectRow}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        collection={this.collection}
        onChangeIndex={this.onChangeIndex}
        filterData={{
          mdSources: _.get(this.props.resources, 'mdSources.records', []),
        }}
        onClose={this.props.onClose}
        stripes={this.props.stripes}
      />
    );
  }
}

export default stripesConnect(CollectionSearchContainer, { dataKey: 'find_collection' });
