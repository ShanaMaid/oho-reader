import {GET_BOOK_LIST, GET_BOOK_ITEM, GET_BOOK_SOURCE}  from '../action/index';
import {ADD_LIST, REMOVE_LIST, GET_LIST} from '../action/index';
import {GET_CHAPTER_CONTENT, GET_CHAPTER_LIST} from '../action/index';
import storejs from 'store/dist/store.legacy'



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
let localList = storejs.get('bookList') || [];
let localBookIdList =  storejs.get('bookIdList') || [];
export const bookList = (state, action={}) => {
  switch(action.type){
    case ADD_LIST:
      if (state.id.has(action.data._id)) {
        return {list: state.list, id: state.id};
      }
      state.list.push(action.data);
      state.id.add(action.data._id);
      storejs.set('bookList', state.list);
      storejs.set('bookIdList', Array.from(state.id));
      return {list: state.list, id: state.id};
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
      return {list: state.list, id: state.id};
    case GET_LIST:
      return {list: state.list, id: state.id};
    default:
      return {list: localList, id: new Set(localBookIdList)};
  }
}


//获取书源
export const bookSource = (state, action) => {
  switch(action.type){
    case GET_BOOK_SOURCE:
      return action.data;
    default:
      return [];  
  }
}

//章节列表
export const chapterList = (state, action) => {
  switch(action.type){
    case GET_CHAPTER_LIST:
      return action.data;
    default:
      return [];
  }
}

//章节内容
export const chapterContent = (state, action) => {
  switch(action.type){
    case GET_CHAPTER_CONTENT:
      return action.data;
    default:
      return {};
  }
}