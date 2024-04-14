import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../Common/IconBtn"


const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

    // Video data
  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  

  // first render par kya show karna h us logik ke liye useEffect ka user kar lenge
  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        // let's assume all 3 fields data are present
        // console.log("courseSectionData", courseSectionData)
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        // console.log("filteredData", filteredData)
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        // console.log("filteredVideoData", filteredVideoData)
        if (filteredVideoData && filteredVideoData.length > 0) {
          setVideoData(filteredVideoData[0]);
          setPreviewSource(courseEntireData.thumbnail);
          setVideoEnded(false);
        } else {
          // Handle the case when filteredVideoData is empty or undefined
          // For example, you can navigate to a default page or display an error message
          <p>No Data</p>
        }
      }
    }   
     setVideoSpecificDetails();
  }, [courseSectionData, courseEntireData, location.pathname]);

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndex === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  };

  // go to the next video
  const goToNextVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndex].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId)

    // console.log("no of subsections", noOfSubsections)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndex + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  // go to the previous video
  const goToPrevVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      // same section prev video
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndx - 1
        ]._id
        // is video par chale jao
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      // diff section last video
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndex - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndex - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  // handle lacture complition
  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    // state update
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false);
  }

  return ( 
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : 
      //if video is present then I will use player and show video 

      (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    playerRef?.current?.seek(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />

              {/* prev button */}
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo} 
                    // blackButton property is in App.css
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails
// video
