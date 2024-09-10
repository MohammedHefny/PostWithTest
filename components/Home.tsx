import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {NativeBaseProvider, Box, VStack, HStack, Button} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {Story} from '../interfaces/Story';

type RootStackParamList = {
  Home: undefined;
  Details: {post: Story};
};

type HomeScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp['navigation'];
  route: HomeScreenRouteProp;
}

interface State {
  data: Story[];
  loading: boolean;
  error: string | null;
  page: number;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
}

class Home extends Component<Props, State> {
  intervalId!: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      error: null,
      page: 0,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
    };
  }

  componentDidMount() {
    this.fetchData();
    this.intervalId = setInterval(this.fetchData, 10000); // Fetch new data every 10 seconds
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear interval on component unmount
    }
  }

  fetchData = async () => {
    const {page, data} = this.state;
    try {
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`,
      );
      const json = await response.json();
      this.setState({
        data: [...data, ...json.hits],
        loading: false,
        page: page + 1,
      });
    } catch (error) {
      this.setState({error: (error as Error).message, loading: false});
    }
  };

  filterData = () => {
    const {data, searchQuery} = this.state;
    if (!searchQuery) return data;
    return data.filter(
      item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  handleSelectPost = (post: Story) => {
    this.props.navigation.navigate('Details', {post});
  };

  handlePageChange = (pageNumber: number) => {
    this.setState({currentPage: pageNumber});
  };

  renderPagination = (totalPages: number) => {
    const {currentPage} = this.state;
    const pageNumbers = Array.from({length: totalPages}, (_, i) => i + 1);

    return (
      <ScrollView
        horizontal
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
        }}
        showsHorizontalScrollIndicator={false}>
        <HStack space={2} py={3}>
          {pageNumbers.map(number => (
            <Button
              key={number}
              onPress={() => this.handlePageChange(number)}
              variant={currentPage === number ? 'solid' : 'outline'}>
              {number}
            </Button>
          ))}
        </HStack>
      </ScrollView>
    );
  };

  render() {
    const {loading, error, searchQuery, currentPage, itemsPerPage} = this.state;
    const filteredData = this.filterData();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
      <NativeBaseProvider>
        <Box style={styles.container}>
          <VStack space={2} px={3} py={2}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search by title or author"
              value={searchQuery}
              onChangeText={text =>
                this.setState({searchQuery: text, currentPage: 1})
              }
            />
            <FlatList
              data={currentItems}
              keyExtractor={item => item.objectID}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => this.handleSelectPost(item)}>
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
            {this.renderPagination(totalPages)}
          </VStack>
        </Box>
      </NativeBaseProvider>
    );
  }
}

export default Home;

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
