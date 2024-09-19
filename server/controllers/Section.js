const Section = require("../models/Section")
const Course = require("../models/Course")
const SubSection = require("../models/Subsection")

//*******CREATE a new section***************
exports.createSection = async (req, res) => {
  try {
    // Extract the required properties from the request body
    //here courseId , so that I can update the course
    const { sectionName, courseId } = req.body

    // Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      })
    }

    // Create a new section with the given name
    const newSection = await Section.create({ sectionName })

    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId, //I will find using courseId
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ) //If I will not populate than My updatedCourse will only contain ObjectId not exact object
    //If want exact object than I need to populate it
      .populate({ //here I'm populating subsection and
        path: "courseContent",
        populate: { // here I'm population subsection
          path: "subSection",
        },
      })
      .exec()

    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    })
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}


//**************UPDATE a section***************
exports.updateSection = async (req, res) => {
  try {
    //there will be not need to update Section in course bc course contain Section Id not section data
    //Section Id will be same as previous SectionId in course so there is no need to update sectionID
    const { sectionName, sectionId, courseId } = req.body

    const section = await Section.findByIdAndUpdate(
      sectionId, //kiske basis per find karna chahte ho aur
      { sectionName }, //kya update karna chahte ho
      { new: true }
    )
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()
    // console.log(course)

    res.status(200).json({
      success: true,
      message: section,
      data: course,
    })
  } catch (error) {
    console.error("Error updating section:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}


//****************DELETE a section****************
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    })
    const section = await Section.findById(sectionId)
    // console.log(sectionId, courseId)
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }
    // Delete the associated subsections
    await SubSection.deleteMany({ _id: { $in: section.subSection } })

    await Section.findByIdAndDelete(sectionId)

    // find the updated course and return it
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    })
  } catch (error) {
    console.error("Error deleting section:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
