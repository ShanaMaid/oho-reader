import React from 'react';
import {Layout, Icon, Input } from 'antd'
import { Link } from 'react-router-dom'
import ResultBookItem from './resultBookItem'
import styles from '../styles/search.less'

const { Header, Content } = Layout
class Search extends React.Component{
  constructor(props) {
    super(props)
    this.bookList = []
    this.searchValue = '';
    this.state = {
      searchValue: '',
      bookList: []
    }

    this.searchBook = () => {
      fetch('/api/book/fuzzy-search?query=' + this.state.searchValue + '&start=0')
      .then(res => res.json())
      .then(data => {
        data.books.map((item, index, arr) => {
          if (item.cover.search(/agent/i) === -1) {
            arr[index].cover = 'http://api.zhuishushenqi.com' + item.cover
          }
          else{
            arr[index].cover = item.cover.replace(/\/agent\//, '')
          }
          
        })
        console.log(data.books)
        this.setState({bookList: data.books})
      })
      .catch(error => {
        console.log(error)
      })
    }
  }


  componentWillMount() {

  }

  handleChange(e) {
    this.setState({searchValue:e.target.value});
  }


  render() {
    return (
      <div>
        <Layout>
          <Header className={styles.header}>
            <Icon type="arrow-left" className={styles.pre}/>
            <Input
              ref="search" 
              placeholder="请输入搜索的书名"
              className={styles.searchInput}
              value={this.state.searchValue}
              onChange={this.handleChange.bind(this)}
              onPressEnter={this.searchBook}
            />
            <Icon type="search" className={styles.search} onClick={this.searchBook}/>
          </Header>
          <Content className={styles.content}>
            {
              this.state.bookList.length != 0 ? this.state.bookList.map((item) =>{
                // if (item.cover.search(/agent/i) === -1) {
                //   item.cover = 'http://api.zhuishushenqi.com' + item.cover
                // }
                // else{
                //   item.cover = item.cover.replace(/\/agent\//, '')
                // }
                // console.log(item.title)
                return <ResultBookItem data={item}/>
            }) : '没有找到搜索结果'}
          </Content>
        </Layout>
      </div>
    )
  }
}

export default Search;