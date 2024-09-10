import React from 'react';
import {render, waitFor, screen} from '@testing-library/react-native';
import fetchMock from 'jest-fetch-mock';
import Posts from './components/Posts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from './App';
import {Story} from './interfaces/Story';

fetchMock.enableMocks();

const mockData: Story[] = [
  {
    objectID: '1',
    title: 'Test Story 1',
    author: 'Author 1',
    url: 'http://example.com',
    created_at: '2024-09-10T00:00:00Z',
    _tags: ['tag1', 'tag2'],
  },
  {
    objectID: '2',
    title: 'Test Story 2',
    author: 'Author 2',
    url: 'http://example.com',
    created_at: '2024-09-11T00:00:00Z',
    _tags: ['tag3', 'tag4'],
  },
];

// Define types for your navigation and route props
type PostsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Posts'
>;
type PostsScreenRouteProp = RouteProp<RootStackParamList, 'Posts'>;

// Mock navigation and route objects with proper types
const mockNavigation: Partial<PostsScreenNavigationProp> = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  // Add any other necessary mock methods
};

const mockRoute: PostsScreenRouteProp = {
  key: '1',
  name: 'Posts',
  params: undefined,
};

describe('Posts Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should render loading indicator while fetching data', () => {
    fetchMock.mockResponseOnce(JSON.stringify({hits: []}));
    const {getByTestId} = render(
      <Posts navigation={mockNavigation as any} route={mockRoute} />,
    );

    expect(getByTestId('loading')).toBeTruthy();
  });

  it('should render the fetched data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({hits: mockData}));

    render(<Posts navigation={mockNavigation as any} route={mockRoute} />);

    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeTruthy();
      expect(screen.getByText('By Author 1')).toBeTruthy();
      expect(
        screen.getByText('2024-09-10T00:00:00Z - Tags: tag1, tag2'),
      ).toBeTruthy();
      expect(screen.getByText('Test Story 2')).toBeTruthy();
    });
  });

  it('should render error message on fetch failure', async () => {
    fetchMock.mockReject(new Error('Failed to fetch'));

    render(<Posts navigation={mockNavigation as any} route={mockRoute} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeTruthy();
    });
  });
});
