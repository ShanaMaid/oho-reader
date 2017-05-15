import {GET_BOOK_LIST, GET_BOOK_ITEM}  from '../action/index';
import {ADD_LIST, REMOVE_LIST, GET_LIST, REFRESH_LIST} from '../action/index';
import storejs from 'store/dist/store.legacy';



//搜索书籍
export const fetchBookList = (state = {books: [], name: ''}, action={}) => {
  switch (action.type){
    case GET_BOOK_LIST:
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
    case GET_BOOK_ITEM:
      return action.data;
    default:
      return state;
  }
}


//默认书单列表
export const bookList = (state, action={}) => {
  let localList = storejs.get('bookList') || [];
  let localBookIdList =  storejs.get('bookIdList') || [];
  state = {list: localList, id: new Set(localBookIdList)};
  switch(action.type){
    case ADD_LIST:
      if (state.id.has(action.data._id)) {
        return state;
      }
      state.list.unshift(action.data);
      state.id.add(action.data._id);
      storejs.set('bookList', state.list);
      storejs.set('bookIdList', Array.from(state.id));
      return state;
    case REMOVE_LIST:
      for (let index in state.list){
        if (state.list[index]._id === action.data._id) {
          state.list.splice(index, 1);
          state.id.delete(action.data._id);
          break;
        }
      }
      storejs.set('bookList', state.list);
      storejs.set('bookIdList', Array.from(state.id));
      return state;
    case GET_LIST:
      return state;
    case REFRESH_LIST:
      storejs.set('bookList', action.data);
      state = {list: action.data, id: new Set(localBookIdList)};
      return state;
    default:
      return state;
  }
}

