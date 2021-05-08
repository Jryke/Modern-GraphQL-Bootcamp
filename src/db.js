const users = [
  {
    id: '1',
    name: 'Jesse',
    email: 'jesse@example.com',
    age: 38,
  },
  {
    id: '2',
    name: 'Dylan',
    email: 'dylan@example.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
  },
]

// Demo post data
const posts = [
  {
    id: '1',
    title: 'My first post',
    body: 'This is my first example posts to use for testing!',
    published: true,
    author: '1',
  },
  {
    id: '2',
    title: 'My second post',
    body: 'Another example of posting.',
    published: false,
    author: '1',
  },
  {
    id: '3',
    title: 'My last post',
    body: 'The last time a post will be tested (for now).',
    published: true,
    author: '2',
  },
]

const comments = [
  {
    id: '1',
    text: 'nice post!',
    author: '3',
    post: '1',
  },
  {
    id: '2',
    text: `I didn't like this post`,
    author: '2',
    post: '2',
  },
  {
    id: '3',
    text: 'I agree!',
    author: '1',
    post: '3',
  },
  {
    id: '4',
    text: 'I strongly disagree',
    author: '2',
    post: '2',
  },
]

const db = {
  users,
  posts,
  comments,
}

export { db as default }
