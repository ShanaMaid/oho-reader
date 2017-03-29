import  'whatwg-fetch'

export const GET_BOOKLIST = 'GET_BOOKLIST';

export const receivePosts = (data, name) => {
  return {
    type: GET_BOOKLIST,
    data,
    name
  }
}

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
      .then(data => dispatch(receivePosts(data, name)))
      .catch(error => {
        console.log(error)
      })
  }
}

