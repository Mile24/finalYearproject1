import React, { useEffect, useState } from 'react';
import CustomerNavbar from './CustomerNavbar';

function TrackServ() {
  const customerEmail = sessionStorage.getItem("customerEmail");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('trackServices');
  const [feedbackRequest, setFeedbackRequest] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [stars, setStars] = useState(0);
  const [feedbackEmail, setFeedbackEmail] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8082/api/serviceRequest/customer/${customerEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch service requests", err);
        setLoading(false);
      });
  }, [customerEmail]);

  const updateAcceptanceStatus = (id, acceptanceStatus) => {
    fetch(`http://localhost:8082/api/serviceRequest/updateAcceptance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerAcceptanceStatus: acceptanceStatus }),
    })
      .then(() => {
        alert(`You selected: ${acceptanceStatus}`);
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, customerAcceptanceStatus: acceptanceStatus } : r))
        );
      })
      .catch((err) => console.error('Acceptance update failed', err));
  };

  const updateStatus = (id) => {
    const req = requests.find(r => r.id === id);
    fetch(`http://localhost:8082/api/serviceRequest/updateStatus/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    })
      .then(() => {
        alert('Payment Received: ₹' + req.serviceCharge);
        setRequests((prev) =>
          prev.map((r) => r.id === id ? { ...r, status: 'COMPLETED' } : r)
        );
        setFeedbackRequest(req);
        setFeedbackEmail(req.accptedEmail);
      })
      .catch((err) => console.error('Status update failed', err));
  };

  const submitFeedback = () => {
    const body = {
      reviewText,
      stars,
      customerEmail,
      serviceProviderEmail: feedbackEmail
    };

    fetch(`http://localhost:8082/api/feedback/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(() => {
        alert('Feedback submitted!');
        setFeedbackRequest(null);
        setReviewText('');
        setStars(0);
        setFeedbackEmail('');
      })
      .catch(err => console.error('Feedback submission failed', err));
  };

  const getStatusMessage = (req) => {
    const { status, serviceCharge } = req;
    if (status === "TIMEOUT" && serviceCharge === 0) {
      return { label: "We are sorry, no providers accepted your request", color: "text-red-500" };
    }
    if (status === "TIMEOUT" && serviceCharge > 0) {
      return { label: "Accepted", color: "text-green-600" };
    }
    if (status === "REJECTED" && serviceCharge === 0) {
      return { label: "Rejected or Service Providers May Unavailable.", color: "text-red-600" };
    }
    return { label: status, color: "text-blue-600" };
  };

  return (
    <div className="font-sans min-h-screen w-full bg-gray-50">
      <CustomerNavbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <section className="py-16 pt-28 md:pt-32 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Service Requests</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-500">No service requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => {
              const statusInfo = getStatusMessage(req);
              return (
                <div key={req.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{req.problemCategory}</h3>
                  <p className="text-gray-600 mb-1"><strong>Description:</strong> {req.problemDescription}</p>
                  <p className="text-gray-600 mb-1"><strong>Created:</strong> {new Date(req.createdTime).toLocaleString()}</p>
                  {req.accptedEmail && (
                    <p className="text-gray-600 mb-1"><strong>Provider:</strong> {req.accptedEmail}</p>
                  )}
                  <p className={`font-medium mt-2 ${statusInfo.color}`}>
                    <strong>Status:</strong> {statusInfo.label}
                  </p>
                  {req.serviceCharge > 0 && (
                    <p className="text-green-700 font-semibold mt-1">Charge: ₹{req.serviceCharge}</p>
                  )}

                  {statusInfo.label === "ACCEPTED" && !req.customerAcceptanceStatus && (
                    <div className="mt-4">
                      <label className="block mb-1 font-medium text-gray-700">Select Status:</label>
                      <select
                        onChange={(e) => updateAcceptanceStatus(req.id, e.target.value)}
                        defaultValue=""
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="" disabled>Select</option>
                        <option value="OK">OK</option>
                        <option value="NOT_OK">Not OK</option>
                      </select>
                    </div>
                  )}

                  {req.customerAcceptanceStatus === 'OK' && req.status !== 'COMPLETED' && (
                    <div className="mt-4">
                      <button
                        onClick={() => updateStatus(req.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}

                  {req.customerAcceptanceStatus === 'NOT_OK' && (
                    <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
                      <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Please Find Another Providers, Because your not fine with that Charges.
                      </p>
                    </div>
                  )}

                  {req.status === 'COMPLETED' && (
                    <div className="mt-4">
                      <button
                        onClick={() => alert("Already Updated")}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        disabled
                      >
                        Work Completed
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {feedbackRequest && (
        <section className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Leave Feedback</h2>
            <p><strong>Provider:</strong> {feedbackEmail}</p>
            <p><strong>Category:</strong> {feedbackRequest.problemCategory}</p>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full mt-3 p-2 border rounded-md"
              rows={4}
              placeholder="Write your review..."
            ></textarea>

            <div className="mt-4 flex items-center space-x-2">
              <label className="text-gray-700 font-medium">Stars:</label>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setStars(s)}
                  className={`text-xl ${stars >= s ? 'text-yellow-400' : 'text-gray-400'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setFeedbackRequest(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={!reviewText || stars === 0}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default TrackServ;
