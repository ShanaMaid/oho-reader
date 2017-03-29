import  'whatwg-fetch'

export const GET_BOOKLIST = 'GET_BOOKLIST';
export const GET_BOOKITEM = 'GET_BOOKITEM';

export const receiveBookList = (data, name) => {
  return {
    type: GET_BOOKLIST,
    data,
    name
  }
}

//搜索书籍
export const getBookList = (name) => {
  return  dispatch => {
    fetch('/api/book/fuzzy-search?query=' + name + '&start=0')
      .then(res => res.json())
      .then(data => {
        data.books.map((item, index, arr) => {
          if (item.cover.search(/agent/i) === -1) {
            item.cover = 'http://api.zhuishushenqi.com' + item.cover
          }
          else{
            item.cover = item.cover.replace(/\/agent\//, '')
          }
        })
        return data
      })
      .then(data => dispatch(receiveBookList(data, name)))
      .catch(error => {
        console.log(error)
      })
  }
}


export const receiveBookItem = (data) => {
  return {
    type: GET_BOOKITEM,
    data
  }
}

//获取书籍详情
export const getBookItem = (id) => {
  return dispatch => {
    fetch('/api/book/' + id)
      .then(res => res.json())
      .then(data => dispatch(receiveBookItem(data)))
      .catch(error => {
        console.log(error)
      })
  }
}

