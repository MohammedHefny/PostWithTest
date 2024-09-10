import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import {Story} from '../interfaces/Story';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {Box} from 'native-base';

type RootStackParamList = {
  Posts: undefined;
  Details: {post: Story};
};

type HomeScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'Posts'
>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Posts'>;
interface Props {
  navigation: HomeScreenNavigationProp['navigation'];
  route: HomeScreenRouteProp;
}
interface State {
  data: Story[];
  loading: boolean;
  error: string | null;
}
class Posts extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      error: null,
    };
  }
  fetchData = async () => {
    const {data} = this.state;
    try {
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=1`,
      );
      const json = await response.json();
      this.setState({
        data: [...data, ...json.hits],
        loading: false,
      });
    } catch (error) {
      this.setState({error: (error as Error).message, loading: false});
    }
  };
  componentDidMount(): void {
    this.fetchData();
  }
  render() {
    const {loading, error, data} = this.state;
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    return (
      <View>
        <FlatList
          data={data}
          keyExtractor={item => item.objectID}
          renderItem={({item}) => (
            <TouchableOpacity>
              <Box style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>By {item.author}</Text>
                <Text style={styles.details}>
                  {item.created_at} - Tags: {item._tags.join(', ')}
                </Text>
              </Box>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

export default Posts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  details: {
    fontSize: 12,
    color: '#888',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
