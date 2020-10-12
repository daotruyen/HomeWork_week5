import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet ,FlatList , Linking } from 'react-native';
import moment from 'moment';
import { Card, Button, Icon } from 'react-native-elements';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasErrored, setHasApiError] = useState(false);
  const [lastPageReached, setLastPageReached] = useState(false);
  
  const getNews = async (callback) => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=db7e7b25ac2b4cdaaf3ebd2c8a72b928&page=${pageNumber}`
      );
      const JsonData = await response.json();
      return callback(JsonData.articles);
    } catch (error) {
      console.log(error);
      setHasApiError(true);
    }
  };

  useEffect(() => {
    getNews((res) => {
      const newRes = filterForUniqueArticles(res);

      setArticles(newRes);
      setLoading(false);
      setPageNumber((prev) => prev + 1);
    });
  }, []);

  const renderArticleItem = ({ item }) => {
    {
      articles.map(article => {
        return (
          <Card title={article.title} image={{ uri: article.urlToImage }}>
            <View style={styles.row}>
              <Text style={styles.label}>Source</Text>
              <Text style={styles.info}>{article.source.name}</Text>
            </View>
            <Text style={{ marginBottom: 10 }}>{article.content}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Published</Text>
              <Text style={styles.info}>
                {moment(article.publishedAt).format('LLL')}
              </Text>
            </View>
            <Button icon={<Icon />} title="Read more" backgroundColor="#03A9F4" onPress={() => onPress(item.url)} />
          </Card>
        );
      });
    }
  };
  const onPress = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URL: ${url}`);
      }
    });
  };
  const filterForUniqueArticles = arr => {
    const cleaned = [];
    arr.forEach(itm => {
      let unique = true;
      cleaned.forEach(itm2 => {
        const isEqual = JSON.stringify(itm) === JSON.stringify(itm2);
        if (isEqual) unique = false;
      });
      if (unique) cleaned.push(itm);
    });
    return cleaned;
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" loading={loading} />
      </View>
    )
  }
  if (hasErrored) {
    return (
      <View style={styles.container}>
        <Text>Error =(</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
    <View style={styles.row}>
  <Text style={styles.label}>Articles Count:</Text>
  <Text style={styles.info}>{articles.length}</Text>
</View>
    <FlatList
    data={articles}
    renderItem={renderArticleItem}
    keyExtractor={item => item.title}
    onEndReached={getNews} 
    onEndReachedThreshold={1}
    ListFooterComponent={lastPageReached ? <Text>No more articles</Text> : <ActivityIndicator
      size="large"
      loading={loading}
    />}
    />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#fff",
    justifyContent: 'center',
  },
  containerFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  header: {
    height: 30,
    width: '100%',
    backgroundColor: 'pink'
  },
  row: {
    flexDirection: 'row'
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold'
  },
  info: {
    fontSize: 16,
    color: 'grey'
  }
})