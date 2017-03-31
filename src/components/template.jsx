import {connect} from 'react-redux';
import {
  getBookList, 
  getBookItem,
  deleteBook,
  addBook,
  getBook
  } 
  from '../redux/action/index'

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

  const mapDispatchToProps = (dispatch) => {
    return {
      search: (name) => dispatch(getBookList(name)),
      getBokkIntroduce: (id) => dispatch(getBookItem(id)),
      deleteBook: (id) => dispatch(deleteBook(id)),
      addBook: (id) => dispatch(addBook(id)),
      getBook: (id) => dispatch(getBook()),
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
    )(component)
}

export default Main;