const mongoose = require("mongoose");

// Define the RatingAndReview schema
const ratingAndReviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
	rating: {
		type: Number,
		required: true,
	},
	review: {
		type: String,
		required: true,
	},
	course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},
});

// Export the RatingAndReview model
module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);


//why index: true,
//ANS: 
// RatingAndReview.find({ course: courseId });
// MongoDB will use the index on the course field to speed up this query, making it more efficient compared to scanning all documents in the collection.

// Without indexing, querying large datasets would take longer as MongoDB would check every document.