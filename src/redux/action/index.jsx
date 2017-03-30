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
        data.books.map((item) => {
          if (item.cover.search(/agent/i) === -1) {
            item.cover = 'http://api.zhuishushenqi.com' + item.cover;
          }
          else{
            item.cover = item.cover.replace(/\/agent\//, '');
          }
        })
        return data;
      })
      .then(data => dispatch(receiveBookList(data, name)))
      .catch(error => {
        console.log(error);
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
      .then(data => {
        if (data.cover.search(/agent/i) === -1) {
          data.cover = 'http://api.zhuishushenqi.com' + data.cover;
        }
        else{
          data.cover = data.cover.replace(/\/agent\//, '');
        }
        if (Array.from(String(data.wordCount)).length > 4) {
          let arr = Array.from(String(data.wordCount));
          arr.length -= 4;
          data.wordCount = arr.join('') + '万';
        }
        let time = new Date(new Date() - new Date(data.updated)).getTime();
        let min = time / (1000 * 60);
        let hour = min / 60;
        let day = hour / 24;
        let month = day / 30;
        let year = month / 12;
        if (min < 60) {
          data.updated = Math.floor(min) + '分钟';
        }
        else if (hour < 24) {
          data.updated = Math.floor(hour) + '小时';
        }
        else if (day < 30) {
          data.updated = Math.floor(day) + '天';
        }
        else if (month < 12) {
          data.updated = Math.floor(month) + '月';
        }
        else {
          data.updated = Math.floor(year) + '年';
        }

        // data.longIntro = data.longIntro.replace(/\r\n/, '<br/>');
        data.wordCount += '字';
        return data;
      })
      .then(data => dispatch(receiveBookItem(data)))
      .catch(error => {
        console.log(error);
      })
  }
}

