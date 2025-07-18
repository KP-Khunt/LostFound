import React from 'react';

const Card = ({ item, type }) => {
  return (
    <div className="bg-white shadow-md p-3 rounded mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {type === 'lost' ? 'Lost' : 'Found'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-2">{item.description}</p>
      
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
        <div>
          <strong>Category:</strong> {item.category}
        </div>
        <div>
          <strong>Location:</strong> {item.location}
        </div>
        <div>
          <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
        </div>
        <div>
          <strong>Contact:</strong> {item.contact || 'N/A'}
        </div>
      </div>
      
      {item.image && (
        <div className="mt-3">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-48 object-cover rounded"
          />
        </div>
      )}
    </div>
  );
};

export default Card;
