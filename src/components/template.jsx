import {connect} from 'react-redux';
import {getBookList, getBookItem} from '../redux/action/index'

const Main = (component) => {
  const mapStateToProps = (state) => {
    let {
      fetchBookList,
      fetchBookItem
    } = state
    return {
      fetchBookList,
      fetchBookItem
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      search: (name) => dispatch(getBookList(name)),
      getBokkIntroduce: (id) => dispatch(getBookItem(id))
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
    )(component)
}

export default Main;