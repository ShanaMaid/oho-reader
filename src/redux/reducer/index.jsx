import {GET_BOOKLIST} from '../action/index'


export const fetchBookList = (state = {books: [], name: ''}, action={}) => {
  switch (action.type){
    case GET_BOOKLIST:
      let {
        data: {books}, 
        name
      } = action
      return {books, name};
    default:
      return state;
  }
}


