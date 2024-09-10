import React from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {NativeBaseProvider, Box} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

interface Story {
  objectID: string;
  title: string;
  author: string;
  url: string;
  created_at: string;
  _tags: string[];
}

type RootStackParamList = {
  Home: undefined;
  Details: {post: Story};
};

type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

const Details: React.FC<DetailsScreenProps> = ({route}) => {
  const {post} = route.params;

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.author}>By {post.author}</Text>
          <Text style={styles.details}>Created at: {post.created_at}</Text>
          <Text style={styles.details}>URL: {post.url}</Text>
          <Text style={styles.details}>Tags: {post._tags.join(', ')}</Text>
          <Text style={styles.json}>{JSON.stringify(post, null, 2)}</Text>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginVertical: 8,
  },
  details: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  json: {
    fontSize: 12,
    color: '#333',
    marginTop: 16,
  },
});

export default Details;
