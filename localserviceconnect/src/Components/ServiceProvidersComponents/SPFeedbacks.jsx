import React, { useEffect, useState } from 'react';
import NavbarSP from './NavbarSP';

function SPFeedback() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = sessionStorage.getItem("serviceProviderEmail");

  useEffect(() => {
    fetch(`http://localhost:8082/api/feedback/serviceProvider/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
  }, [email]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavbarSP />

      <div className="pt-28 md:pt-32 max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          My Feedback
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading feedback...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven't submitted any feedback yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
              >
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-indigo-700">{review.serviceProviderName}</h3>
                  <p className="text-sm text-gray-500">
                    {review.serviceCategory} • {review.serviceProviderEmail}
                  </p>
                </div>
                <div className="my-3">
                  <p className="text-gray-700">
                    <span className="font-semibold">Review:</span> {review.reviewText}
                  </p>
                </div>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < review.stars ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {review.stars} out of 5
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 italic">
                    Submitted by: {review.customerName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SPFeedback;
