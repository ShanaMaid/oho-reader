import {GET_BOOKLIST, GET_BOOKITEM} from '../action/index';


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
export const fetchBookItem = (state = {}, action={}) =>{
  switch(action.type){
    case GET_BOOKITEM:
      return action.data;
    default:
      return state;
  }
}


