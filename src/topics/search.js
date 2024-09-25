'use strict';

const _ = require('lodash');
const nconf = require('nconf');

const meta = require('../meta');
const plugins = require('../plugins');
const db = require('../database');
const posts = require('../posts'); 


module.exports = function (Topics) {

    Topics.search = async function (data) {

        // extracting the attributes of data object 
        const query = data.query || ''; // the search term 
        const tid = data.tid || 1; // topic id to search in
        const uid = data.uid || 0; // user id of the searcher 

        // storing the posts associated with a topic 
        const set = `tid:${tid}:posts`; 

        // fetch topic attributes using getTopicData
        const topicData = await Topics.getTopicData(tid); 
        
        // using getTopicPosts function in src/topics/posts.js  
        // to retrieve all the posts in the topic (by making range 0 to -1) 
        const postsData = await Topics.getTopicPosts(topicData, set, 0, -1, uid); 

        // looping through retrieved postsdata array 
        // and inspecting each post object for the search query 
        const filteredPosts = postsData.filter(post => 
            // comparing both in lowercase 
            post.content.toLowerCase().includes(query.toLowerCase())
        );

        // returning results object containing the array of the filtered posts 
        // and number of filtered posts found 
        const result = {
            matchCount: filteredPosts.length,
            posts: filteredPosts // array of arrays of post objects 
        };

        return result; 

    };
};
