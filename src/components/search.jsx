import React from 'react';
import {Layout, Icon, Input, Spin} from 'antd';
import { Link } from 'react-router-dom';
import ResultBookItem from './resultBookItem';
import styles from '../styles/search.less';
import template from './template';

const { Header, Content } = Layout

class Search extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      searchValue: this.props.fetchBookList.name,
      bookList: this.props.fetchBookList.books,
      loading: false
    }
    this.searchBook = () => {
      let value = this.state.searchValue
      if (new Set(value).has(' ') || value === '') {
        alert('宝贝儿！别输入空格或者空哦！')
        return
      }
      this.setState({loading: true})
      this.props.search(value)
    }

    this.loading = true
  }

  componentWillReceiveProps(nextProps){
    this.setState({bookList: nextProps.fetchBookList.books, searchValue: nextProps.fetchBookList.name, loading: false})
  }

  handleChange(e) {
    this.setState({searchValue:e.target.value});
  }


  render() {
    return (
      <div className="page" ref="search">
        <Layout >
          <Header className={styles.header}>
            <Link to="/"><Icon type="arrow-left" className={styles.pre}/></Link>
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
          <Spin className={styles.loading} spinning={this.state.loading} tip="书籍搜索中...">
          <Content className={styles.content}>
            {
              this.state.bookList.length != 0 ?
              this.state.bookList.map((item, index) => <ResultBookItem data={item} key={index}/>)
              : '没有找到搜索结果'
            }
          </Content>
          </Spin>
        </Layout>
      </div>
    )
  }
}

export default template(Search);