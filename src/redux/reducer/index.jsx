import {GET_BOOKLIST, GET_BOOKITEM} from '../action/index';
import {ADD_LIST, REMOVE_LIST, GET_LIST} from '../action/index';
import storejs from 'store/dist/store.legacy'

//搜索书籍
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

//书籍详情
export const fetchBookItem = (state = {}, action={}) => {
  switch(action.type){
    case GET_BOOKITEM:
      return action.data;
    default:
      return state;
  }
}


//默认书单列表
const localList = storejs.get('bookList') || [];
const localBookIdList = new Set(storejs.get('bookIdList')) || new Set();
export const bookList = (state = localList, action={}) => {
  switch(action.type){
    case ADD_LIST:
      state.push(action.data);
      localBookIdList.add(action.data._id);
      storejs.set('bookList', state);
      storejs.set('bookIdList', localBookIdList);
      return state;
    case REMOVE_LIST:
      for (let index in state){
        if (state[index]._id === action.data._id) {
          state.splice(index, 1);
          localBookIdList.delete(state[index]._id);
          break;
        }
      }
      storejs.set('bookList', state);
      storejs.set('bookIdList', localBookIdList);
      return state;
    case GET_LIST:
      return state;
    default:
      return state;
  }
}

