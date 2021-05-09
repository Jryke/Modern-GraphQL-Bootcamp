import { v4 as uuidv4 } from 'uuid'

//
// Goal: Set up a mutation for updating a comment
//
// 1. Define mutation
//  - Add id/data for arguments.  Setup data to support title, body, and published.
//  - Return the updated comment
// 2. Create resolver method
//  - Verify comment exists, else throw error
//  - Update comment properties one at a time
// 3. Verify your work by updating all properties for a given comment

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email)
    if (emailTaken) {
      throw new Error('Email taken.')
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    }

    db.users.push(user)

    return user
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(user => user.id === args.id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const deletedUsers = db.users.splice(userIndex, 1)

    db.posts = db.posts.filter(post => {
      const match = post.author === args.id

      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }

      return !match
    })

    db.comments = db.comments.filter(comment => comment.author !== args.id)

    return deletedUsers[0]
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args
    const user = db.users.find(user => user.id === id)

    if (!user) {
      throw new Error('User not found')
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email)

      if (emailTaken) {
        throw new Error('Email taken')
      }

      user.email = data.email
    }

    if (typeof data.name === 'string') {
      user.name = data.name
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }

    return user
  },
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some(user => user.id === args.data.author)

    if (!userExists) {
      throw new Error('User not found')
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    }

    db.posts.push(post)

    return post
  },
  updatePost(parent, args, { db }, info) {
    const { id, data } = args
    const post = db.posts.find(post => post.id === id)

    if (!post) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {
      post.title = data.title
    }

    if (typeof data.body === 'string') {
      post.body = data.body
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published
    }

    if (typeof data.author === 'string') {
      const authorExists = db.users.find(user => user.id === data.author)

      if (!authorExists) {
        throw new Error('Author not found')
      }

      post.author = data.author
    }

    return post
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id)

    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    const deletedPosts = db.posts.splice(postIndex, 1)

    db.comments = db.comments.filter(comment => comment.post !== args.id)

    return deletedPosts[0]
  },
  createComment(parent, args, { db }, info) {
    const userExists = db.users.some(user => user.id === args.data.author)
    const postExists = db.posts.some(post => post.id === args.data.post)
    const postIsPublished = db.posts.find(post => post.id === args.data.post)
      .published

    if (!userExists) {
      throw new Error('User not found')
    }

    if (!postExists) {
      throw new Error('Post not found')
    } else if (!postIsPublished) {
      throw new Error('Post is not published')
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    }

    db.comments.push(comment)

    return comment
  },
  updateComment(parent, args, { db }, info) {
    const { id, data } = args
    const comment = db.comments.find(comment => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    if (typeof data.author === 'string') {
      const authorExists = db.users.find(user => user.id === data.author)

      if (!authorExists) {
        throw new Error('Author not found')
      }

      comment.author = data.author
    }

    if (typeof data.post === 'string') {
      const postExists = db.posts.find(post => post.id === data.post)

      if (!postExists) {
        throw new Error('Post not found')
      }

      comment.post = data.post
    }

    return comment
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    )

    if (commentIndex === -1) {
      throw new Error('Comment not found')
    }

    const deletedComments = db.comments.splice(commentIndex, 1)

    return deletedComments[0]
  },
}

export { Mutation as default }
