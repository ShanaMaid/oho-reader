import {connect} from 'react-redux';
import {getBookList} from '../redux/action/index'

const Main = (component) => {
  const mapStateToProps = (state) => {
    let {fetchBookList} = state
    return {
      fetchBookList
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      search: (name) => dispatch(getBookList(name))
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
    )(component)
}

export default Main;