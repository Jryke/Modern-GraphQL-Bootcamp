//
// Goal: Create a subscription for new post
//
// 1. Define "post" subscription. No arguments are necessary. Response should be a post object.
// 2. Set up the resolver for post. Since there are no args, a channel name like "post" is fine.
// 3. Modify the mutation for creating a post to publish the new post data.
//  - Only call pubsub.publish if the post had "published" set to true.
//  - Don't worry about updatePost or deletePost.
// 4. Test your work!

const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0

      setInterval(() => {
        count++
        pubsub.publish('count', {
          count,
        })
      }, 1000)

      return pubsub.asyncIterator('count')
    },
  },
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find(post => post.id === postId && post.published)

      if (!post) {
        throw new Error('Post not found')
      }

      return pubsub.asyncIterator(`comment ${postId}`)
    },
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post')
    },
  },
}

export { Subscription as default }
