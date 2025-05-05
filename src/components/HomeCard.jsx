import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Sample destination data
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

const DestinationCard = ({ destination }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/destination/${destination.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
          }}
        />
        <div className="absolute top-2 right-2 bg-[#f7e8ea] text-[#834d55] text-xs font-semibold px-2 py-1 rounded-full">
          {destination.issuedRecently} issued recently
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{destination.name}</h3>
        <div className="flex justify-between items-center mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            destination.type === 'eVisa' || destination.type === 'e-Visa'
              ? 'bg-blue-100 text-blue-800'
              : destination.type === 'Sticker'
                ? 'bg-pink-100 text-pink-800'
                : destination.type === 'Schengen'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800'
          }`}>
            {destination.type}
          </span>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-xl font-bold text-blue-600">{destination.price}</div>
            <div className="text-xs text-gray-500">{destination.fees}</div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm">Get Visa in</div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">{destination.processingTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeCard = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular' },
    { id: 'week', label: 'Visa in a week' },
    { id: 'easy', label: 'Easy Visas' },
    { id: 'schengen', label: 'Schengen Visa' },
    { id: 'free', label: 'Visa Free' }
  ];

  // First filter by category, then by search query
  const filteredByCategory = activeFilter === 'all'
    ? destinationsData
    : destinationsData.filter(dest => dest.category.includes(activeFilter));

  const filteredDestinations = searchQuery
    ? filteredByCategory.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredByCategory;

  const handleLoadMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + 4, filteredDestinations.length));
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setVisibleCount(8); // Reset to show only 8 cards when filter changes
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(8); // Reset to show only 8 cards when search changes
  };

  return (
    <div className="container mx-auto px-4 py-8" id="destination">
      <h2 className="text-2xl font-bold mb-6  text-center">Popular Visa Destinations</h2>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search for a country..."
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute right-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 overflow-x-auto pb-2">
        {filterOptions.map(filter => (
          <button
            key={filter.id}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === filter.id
                ? 'bg-[#b76e79] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Destination Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDestinations.slice(0, visibleCount).map(destination => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredDestinations.length && (
        <div className="text-center mt-8">
          <button
            className="bg-[#b76e79] hover:bg-[#854b54] text-white font-medium py-2 px-6 rounded-full transition-colors"
            onClick={handleLoadMore}
          >
            See More Destinations
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeCard;
