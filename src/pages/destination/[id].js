import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

// No static data - all countries will be fetched from Firebase


export default function DestinationDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [selectedVisaType, setSelectedVisaType] = useState("All");
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visaData, setVisaData] = useState([]);

  // Fetch destination data from Firebase
  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // First try to get from countries collection
        const countryRef = doc(db, 'countries', id);
        const countrySnap = await getDoc(countryRef);

        if (countrySnap.exists()) {
          const countryData = {
            id: countrySnap.id,
            ...countrySnap.data()
          };
          setDestination(countryData);

          // Set visa data from Firebase
          if (countryData.visaInfo) {
            setVisaData(countryData.visaInfo);
          } else {
            // Fallback to default visa data if not available
            setVisaData([
              {
                type: "Tourist",
                name: "Tourist Visa",
                typeLabel: "Tourist",
                stay: "30 days",
                validity: "90 days",
                documentChecklist: ["Passport (valid for 6 months)", "Passport-sized photographs"]
              },
              {
                type: "Work",
                name: "Work Visa",
                typeLabel: "Work",
                stay: "60 days",
                validity: "180 days",
                documentChecklist: ["Valid passport", "Offer letter from the employer"]
              },
              {
                type: "Student",
                name: "Student Visa",
                typeLabel: "Student",
                stay: "365 days",
                validity: "365 days",
                documentChecklist: ["Passport (valid for 6 months)", "University admission letter"]
              }
            ]);
          }
        } else {
          // If not found in countries collection, try destinations collection as fallback
          const destinationRef = doc(db, 'destinations', id);
          const destinationSnap = await getDoc(destinationRef);

          if (destinationSnap.exists()) {
            const destinationData = {
              id: destinationSnap.id,
              ...destinationSnap.data()
            };
            setDestination(destinationData);

            // Set visa data from Firebase
            if (destinationData.visaInfo) {
              setVisaData(destinationData.visaInfo);
            } else {
              // Fallback to default visa data if not available
              setVisaData([
                {
                  type: "Tourist",
                  name: "Tourist Visa",
                  typeLabel: "Tourist",
                  stay: "30 days",
                  validity: "90 days",
                  documentChecklist: ["Passport (valid for 6 months)", "Passport-sized photographs"]
                },
                {
                  type: "Work",
                  name: "Work Visa",
                  typeLabel: "Work",
                  stay: "60 days",
                  validity: "180 days",
                  documentChecklist: ["Valid passport", "Offer letter from the employer"]
                },
                {
                  type: "Student",
                  name: "Student Visa",
                  typeLabel: "Student",
                  stay: "365 days",
                  validity: "365 days",
                  documentChecklist: ["Passport (valid for 6 months)", "University admission letter"]
                }
              ]);
            }
          } else {
            console.log('No such destination in either collection!');
            // No data found in Firebase
            router.push('/'); // Redirect to home page if no data found
          }
        }
      } catch (error) {
        console.error("Error fetching destination:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  // If destination not found or page is still loading
  if (loading || !destination) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading destination details...</h1>
          <p className="mb-4">If this page does not load, the destination may not exist.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate a future date for visa processing (15 days from now)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 15);
  const formattedDate = futureDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  const filteredVisas =
    selectedVisaType === "All"
      ? visaData
      : visaData.filter((visa) => visa.type === selectedVisaType);
  return (
    <>
      <Head>
        <title>Apply for {destination.name} Visa Online | IMMIZA</title>
        <meta name="description" content={`Apply for ${destination.name} visa - Processing time: ${destination.processingTime}`} />
      </Head>

      <div className=" mx-auto ">



  {/* Hero Image and Text Section */}
  <div className="rounded-2xl overflow-hidden px-4 sm:px-8 md:px-12 lg:px-24 py-6 md:py-12"> {/* Responsive padding */}
  {/* Hero Image and Text Section */}
  <div className="flex flex-col md:flex-row w-full relative">
    {/* Left Side - Image */}
    <div className="w-full md:w-1/2 relative mb-6 md:mb-0">
      <div className="relative w-full h-56 sm:h-64 md:h-72 rounded-2xl overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            // Next/image doesn't support onError the same way as img
            // This is a fallback but may not work as expected
            const imgElement = e.target;
            if (imgElement) {
              imgElement.src = "https://via.placeholder.com/1200x600?text=Image+Not+Found";
            }
          }}
        />
      </div>
    </div>

    {/* Right Side - Text */}
    <div className="w-full md:w-1/2 flex flex-col justify-center p-4 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800">
        {destination.name} Visa
      </h1>
      <p className="text-base sm:text-lg text-center text-gray-600 mb-4">Apply for your visa online quickly and easily.</p>

      {/* Visa Details */}
      <div className="text-center mt-4">
        <div className="bg-[#014421] text-white py-1.5 sm:py-2 font-semibold text-xs sm:text-sm md:text-base inline-block px-3 sm:px-4 rounded-full">
          Get your visa by {formattedDate}, if you apply today
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-600">Talk to a visa expert - Call now</p>
        <a
          href="tel:+918045680800"
          className="inline-flex items-center justify-center bg-[#b76e79] hover:bg-[#9a5a64] text-white py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg mt-2 text-sm sm:text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call +918045680800
        </a>
      </div>
    </div>
  </div>
</div>




        {/* Visa Types Section */}
        <div className="rounded-lg shadow-xl overflow-hidden p-4 sm:p-6">
  {/* Visa Type Tabs */}
  <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
    <div className="bg-gray-100 p-1 rounded-xl shadow-md flex space-x-2 sm:space-x-4">
      {["All", "Tourist", "Work", "Student"].map((type) => (
        <button
          key={type}
          onClick={() => setSelectedVisaType(type)}
          className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap
            ${selectedVisaType === type
              ? "bg-[#b76e79] text-white shadow-lg"
              : "text-gray-700 hover:bg-white hover:shadow-sm"}
            focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:ring-offset-2`}
        >
          {type}
        </button>
      ))}
    </div>
  </div>

  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-gray-700 mb-6 sm:mb-8">
    {destination.name} Visa Types
  </h2>

  {/* Render Filtered Visa Cards */}
  <div className="space-y-4 sm:space-y-6">
    {filteredVisas.map((visa) => (
      <div
        key={visa.type}
        className="border border-gray-300 rounded-lg overflow-hidden shadow-lg mx-auto"
        style={{ maxWidth: "750px" }}
      >
        {/* Header - Green with visa name */}
        <div className="bg-[#b76e79] text-white px-3 sm:px-4 py-1.5 sm:py-2">
          <h3 className="text-sm sm:text-lg font-semibold">{destination.name} {visa.name}</h3>
        </div>

        {/* Table-like layout for visa details */}
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
            {/* <div className="text-gray-600 font-medium">Visa Type</div>
            <div className="text-right text-blue-600">{destination.type}</div> */}

            <div className="text-gray-600 font-medium">Stay Duration</div>
            <div className="text-right">{visa.stay}</div>

            <div className="text-gray-600 font-medium">Visa Validity</div>
            <div className="text-right">{visa.validity}</div>

            <div className="text-gray-600 font-medium">Processing Time</div>
            <div className="text-right">{destination.processingTime}</div>
          </div>
        </div>

        {/* Footer with button and price */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-3 sm:px-4 py-2 sm:py-3 bg-gray-100">
          <button
            onClick={() => {
              // Get the document checklist for this visa type
              const documentChecklist = visa?.documentChecklist || [];

              // Encode the document checklist as a URL parameter
              const encodedDocumentChecklist = encodeURIComponent(JSON.stringify(documentChecklist));

              // Navigate to the apply page with the document checklist
              router.push(`/apply?destinationId=${destination.id}&destinationName=${destination.name}&visaType=${visa.type}&documentChecklist=${encodedDocumentChecklist}`);
            }}
            className="bg-[#014421] text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg hover:bg-[#1b2e24] transition-all duration-300 w-full sm:w-auto mb-2 sm:mb-0"
          >
            Start Application
          </button>

          {/* <div className="text-center sm:text-right">
            <div className="text-gray-600 text-xs">Pay Us</div>
            <div className="text-blue-600 font-bold text-xs sm:text-sm">{destination.price} per adult</div>
            <div className="text-gray-500 text-xs">{destination.fees}</div>
            <a href="#" className="text-xs text-blue-500 hover:underline">View details</a>
          </div> */}
        </div>
      </div>
    ))}
  </div>
</div>

        {/* Document Checklist Section */}
        <div className="rounded-lg shadow-xl overflow-hidden p-4 sm:p-6 mt-8 bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <svg className="h-8 w-8 text-[#b76e79] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-gray-700">
              Required Documents
            </h2>
          </div>

          {selectedVisaType !== "All" ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition-all duration-300 hover:shadow-xl">
                <div className="bg-[#b76e79] text-white px-5 py-4 flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-semibold flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Document Checklist for {selectedVisaType} Visa
                  </h3>
                  <span className="bg-white text-[#b76e79] text-xs font-bold px-2 py-1 rounded-full">
                    {filteredVisas[0]?.documentChecklist?.length || 0} Items
                  </span>
                </div>

                <div className="p-5 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredVisas[0]?.documentChecklist?.map((document, index) => (
                      <div key={index} className="flex items-start bg-gray-50 p-3 rounded-lg border-l-4 border-[#b76e79] shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="bg-[#b76e79] rounded-full p-1 mr-3 text-white flex-shrink-0">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">{document}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4 text-sm">
                      Make sure you have all the required documents before proceeding with your application
                    </p>
                    <button
                      onClick={() => {
                        // Get the document checklist for the selected visa type
                        const selectedVisa = filteredVisas[0];
                        const documentChecklist = selectedVisa?.documentChecklist || [];

                        // Encode the document checklist as a URL parameter
                        const encodedDocumentChecklist = encodeURIComponent(JSON.stringify(documentChecklist));

                        // Navigate to the apply page with the document checklist
                        router.push(`/apply?destinationId=${destination.id}&destinationName=${destination.name}&visaType=${selectedVisaType}&documentChecklist=${encodedDocumentChecklist}`);
                      }}
                      className="bg-[#b76e79] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#9a5a64] transition-colors shadow-md hover:shadow-lg flex items-center mx-auto"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Apply for {selectedVisaType} Visa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
              <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 mb-4">Please select a specific visa type to view the document checklist.</p>
              <div className="flex justify-center space-x-2">
                {["Tourist", "Work", "Student"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedVisaType(type)}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                      bg-gray-100 text-gray-700 hover:bg-[#b76e79] hover:text-white
                      focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:ring-offset-2"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
