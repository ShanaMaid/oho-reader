import {connect} from 'react-redux';
import * as action from '../redux/action/index'

const Main = (component) => {
  const mapStateToProps = (state) => {
    let {
      fetchBookList,
      fetchBookItem,
      bookList
    } = state
    return {
      fetchBookList,
      fetchBookItem,
      bookList
    }
  }

  return connect(
    mapStateToProps,
    action
    )(component)
}

export default Main;