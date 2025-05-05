import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// Sample destination data (same as in HomeCard.jsx)
const destinationsData = [
  {
    id: 1,
    name: 'United Arab Emirates',
    image: '/images/c.jpeg',
    price: '₹6450',
    fees: '(+649 Fees+Tax)',
    processingTime: '5 days',
    issuedRecently: 1064,
    type: 'eVisa',
    category: ['popular', 'easy']
  },
  {
    id: 2,
    name: 'Singapore',
    image: '/images/c.jpeg',
    price: '₹2399',
    fees: '(+199 Fees+Tax)',
    processingTime: '12 days',
    issuedRecently: 968,
    type: 'eVisa',
    category: ['popular']
  },
  {
    id: 3,
    name: 'Vietnam',
    image: '/images/c.jpeg',
    price: '₹2300',
    fees: '(+199 Fees+Tax)',
    processingTime: '5 days',
    issuedRecently: 594,
    type: 'e-Visa',
    category: ['easy', 'week']
  },
  {
    id: 4,
    name: 'United States of America',
    image: '/images/c.jpeg',
    price: '₹16095',
    fees: '(+999 Fees+Tax)',
    processingTime: '150 days',
    issuedRecently: 2,
    type: 'Sticker',
    category: ['popular']
  },
  {
    id: 5,
    name: 'Japan',
    image: '/images/c.jpeg',
    price: '₹2500',
    fees: '(+299 Fees+Tax)',
    processingTime: '7 days',
    issuedRecently: 320,
    type: 'eVisa',
    category: ['popular', 'week']
  },
  {
    id: 6,
    name: 'Australia',
    image: '/images/c.jpeg',
    price: '₹9800',
    fees: '(+499 Fees+Tax)',
    processingTime: '15 days',
    issuedRecently: 156,
    type: 'eVisa',
    category: ['popular']
  },
  {
    id: 7,
    name: 'South Korea',
    image: '/images/c.jpeg',
    price: '₹3200',
    fees: '(+299 Fees+Tax)',
    processingTime: '10 days',
    issuedRecently: 338,
    type: 'eVisa',
    category: ['easy']
  },
  {
    id: 8,
    name: 'France',
    image: '/images/c.jpeg',
    price: '₹7900',
    fees: '(+399 Fees+Tax)',
    processingTime: '15 days',
    issuedRecently: 245,
    type: 'Schengen',
    category: ['schengen']
  },
  {
    id: 9,
    name: 'Thailand',
    image: '/images/c.jpeg',
    price: '₹2100',
    fees: '(+199 Fees+Tax)',
    processingTime: '3 days',
    issuedRecently: 782,
    type: 'Visa Free',
    category: ['free', 'week']
  },
  {
    id: 10,
    name: 'Germany',
    image: '/images/c.jpeg',
    price: '₹7900',
    fees: '(+399 Fees+Tax)',
    processingTime: '15 days',
    issuedRecently: 189,
    type: 'Schengen',
    category: ['schengen']
  },
  {
    id: 11,
    name: 'Canada',
    image: '/images/c.jpeg',
    price: '₹12500',
    fees: '(+699 Fees+Tax)',
    processingTime: '45 days',
    issuedRecently: 124,
    type: 'eVisa',
    category: ['popular']
  },
  {
    id: 12,
    name: 'Italy',
    image: '/images/c.jpeg',
    price: '₹7900',
    fees: '(+399 Fees+Tax)',
    processingTime: '15 days',
    issuedRecently: 167,
    type: 'Schengen',
    category: ['schengen']
  }
];

export default function DestinationDetail() {
  const router = useRouter();
  const { id } = router.query;

  // Find the destination by ID
  const destination = destinationsData.find(dest => dest.id === parseInt(id));

  // If destination not found or page is still loading
  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading destination details...</h1>
          <p className="mb-4">If this page doesn't load, the destination may not exist.</p>
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

  // Define visa types data
  const [selectedVisaType, setSelectedVisaType] = useState("All");

  // Sample visa data for each destination
  const visaData = [
    {
      type: "Tourist",
      name: "Tourist Visa",
      typeLabel: "Tourist",
      stay: "30 days",
      validity: "90 days",
    },
    {
      type: "Business",
      name: "Business Visa",
      typeLabel: "Business",
      stay: "60 days",
      validity: "180 days",
    },
    {
      type: "Student",
      name: "Student Visa",
      typeLabel: "Student",
      stay: "365 days",
      validity: "365 days",
    }
  ];

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
      <img
        src={destination.image}
        alt={destination.name}
        className="w-full h-56 sm:h-64 md:h-72 object-cover rounded-2xl"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/1200x600?text=Image+Not+Found";
        }}
      />
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
      {["All", "Tourist", "Business", "Student"].map((type) => (
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
            <div className="text-gray-600 font-medium">Visa Type</div>
            <div className="text-right text-blue-600">{destination.type}</div>

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
            onClick={() => router.push(`/apply?destinationId=${destination.id}&destinationName=${destination.name}&visaType=${visa.type}`)}
            className="bg-[#014421] text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg hover:bg-[#1b2e24] transition-all duration-300 w-full sm:w-auto mb-2 sm:mb-0"
          >
            Start Application
          </button>

          <div className="text-center sm:text-right">
            <div className="text-gray-600 text-xs">Pay Us</div>
            <div className="text-blue-600 font-bold text-xs sm:text-sm">{destination.price} per adult</div>
            <div className="text-gray-500 text-xs">{destination.fees}</div>
            <a href="#" className="text-xs text-blue-500 hover:underline">View details</a>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      </div>
    </>
  );
}
