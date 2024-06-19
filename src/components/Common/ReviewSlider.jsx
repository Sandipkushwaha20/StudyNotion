
import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import navigation styles
import "../../App.css";
// Icons
import { FaStar } from "react-icons/fa";
// Import required modules
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper";

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);

  // I will show 10 words of starting
  const truncateWords = 10;

  useEffect(() => {
    (async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      );
      if (data?.success) {
        setReviews(data?.data);
      }
    })();
  }, []);

  return (
    <div className="relative flex justify-center items-center py-2 w-full h-[300px]">
      <div className="max-w-full lg:max-w-full w-full">
        <Swiper
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: '.custom-prev',
            nextEl: '.custom-next',
          }}
          modules={[FreeMode, Pagination, Autoplay, Navigation]} // Add Navigation module
          className="w-full"
          breakpoints={{
            // when window width is >= 600px
            600: {
              slidesPerView: 2,
            },

            // when window width is >= 1200px
            1200: {
              slidesPerView: 4,
            },
          }}
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="flex flex-col rounded-lg hover:shadow-none hover:scale-95 transition-all duration-200 gap-3 bg-richblack-800 p-3 text-sm text-richblack-25 w-[300px] h-[150px]">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />

                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-50">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-xs font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="text-richblack-25">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </p>
                  <div className="flex items-center ">
                    <h3 className="font-semibold text-yellow-100">
                      {review.rating.toFixed(1)}
                    </h3>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom navigation buttons */}
        <div className="custom-prev absolute left-1 top-1/4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 cursor-pointer z-10">
          <svg  className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="custom-next absolute right-1 top-1/4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 cursor-pointer z-10">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ReviewSlider;
