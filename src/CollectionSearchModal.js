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
    // const footer = (
    //   <div className={css.pluginModalFooter}>
    //     <Button
    //       marginBottom0
    //       onClick={this.props.onClose}
    //       className="left"
    //     >
    //       <FormattedMessage id="ui-plugin-find-finc-metadata-collection.button.close" />
    //     </Button>
    //     {(
    //       <React.Fragment>
    //         <div>
    //           <FormattedMessage
    //             id="ui-plugin-find-finc-metadata-collection.modal.totalSelected"
    //             // values={{ count: checkedRecordsLength }}
    //           />
    //         </div>
    //         <Button
    //           buttonStyle="primary"
    //           data-test-find-records-modal-save
    //           // disabled={!checkedRecordsLength}
    //           marginBottom0
    //           onClick={this.saveMultiple}
    //         >
    //           <FormattedMessage id="ui-plugin-find-finc-metadata-collection.button.save" />
    //         </Button>
    //       </React.Fragment>
    //     )}
    //   </div>
    // );

    return (
      <Modal
        contentClass={css.modalContent}
        enforceFocus={false}
        // footer={footer}
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
          onClose={this.props.onClose}
        />
      </Modal>
    );
  }
}

export default CollectionSearchModal;
