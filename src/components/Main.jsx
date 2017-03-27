import 'normalize.css'
import React from 'react';
// import 'antd/dist/antd.css';
import { Input, Layout} from 'antd';
import BookItem from './bookItem';
import styles from '../styles/main.css';


const Search = Input.Search;
const { Header, Content } = Layout;

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.bookList = [];
  }
 
  componentWillMount() {
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
  }

  render() {
    return (
      <div>
        <Layout>
          <Header className={styles.header}>
            <span className={styles.title}>oho阅读</span>
            <Search
              placeholder="输入你要搜索的小说"
              style={{ width: 200, float: 'right'}}
            />
          </Header>
          <Content className={styles.content}>
            {this.bookList}
          </Content>
        </Layout>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
