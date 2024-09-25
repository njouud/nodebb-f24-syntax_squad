'use strict';

module.exports = function (Topics) {
	Topics.search = async function (data) {
		// Extracting the attributes of data object
		const query = data.query || ''; // The search term
		const tid = data.tid || 1; // Topic ID to search in
		const uid = data.uid || 0; // User ID of the searcher

		// Storing the posts associated with a topic
		const set = `tid:${tid}:posts`;

		// Getting topic attributes using getTopicData
		const topicData = await Topics.getTopicData(tid);

		// Using getTopicPosts function in src/topics/posts.js
		// to retrieve all the posts in the topic (by making range 0 to -1)
		const postsData = await Topics.getTopicPosts(topicData, set, 0, -1, uid);

		// Looping through retrieved postsData array
		// and inspecting each post object for the search query
		const filteredPosts = postsData.filter(post => post.content.toLowerCase().includes(query.toLowerCase()));

		// Returning results object containing the array of filtered posts
		// and number of filtered posts found
		return {
			matchCount: filteredPosts.length,
			posts: filteredPosts, // Array of post objects
		};
	};
};
