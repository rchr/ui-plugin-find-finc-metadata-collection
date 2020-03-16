import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from '@folio/stripes/components';

import CollectionSearchContainer from './CollectionSearchContainer';
import css from './CollectionSearch.css';

class CollectionSearchModal extends Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired
    }).isRequired,
    modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    selectCollection: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    dataKey: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.modalRef = props.modalRef || React.createRef();
  }

  selectCollection = (e, collection) => {
    this.props.selectCollection(collection);
    this.props.onClose();
  };

  render() {
    return (
      <Modal
        contentClass={css.modalContent}
        enforceFocus={false}
        onClose={this.props.onClose}
        size="large"
        open={this.props.open}
        ref={this.modalRef}
        label={
          <FormattedMessage id="ui-plugin-find-finc-metadata-collection.modal.label" />
        }
        dismissible
      >
        <CollectionSearchContainer
          {...this.props}
          onSelectRow={this.selectCollection}
        />
      </Modal>
    );
  }
}

export default CollectionSearchModal;
