// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { loadContainer } from '../actions/container';
import { loadImage } from '../actions/image';

function mapStateToProps(state) {
  return {
    containers: state.container.list,
    images: state.image.list
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadContainer,
    loadImage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);