// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImageView from '../components/ImageView';
import * as imageActions from '../actions/image';

function mapStateToProps(state) {
  return {
    images: state.image.list
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...imageActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageView);