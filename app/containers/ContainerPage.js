// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ContainerView from '../components/ContainerView';
import * as containerActions from '../actions/container';

function mapStateToProps(state) {
  return {
    containers: state.container.list,
    images: state.image.list
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...containerActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContainerView);