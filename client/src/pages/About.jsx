import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            About LostFound
          </h1>
          
          <div className="space-y-6">
            {/* Project Overview */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Smart Campus Lost & Found Portal
              </h2>
              <p className="text-gray-600 leading-relaxed">
                LostFound is a comprehensive web application designed to help students and staff 
                efficiently report, track, and recover lost items on campus. Our platform uses 
                smart matching algorithms to connect lost items with found items, making the 
                recovery process faster and more reliable.
              </p>
            </section>

            {/* Key Features */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Easy Reporting
                  </h3>
                  <p className="text-gray-700">
                    Quick and simple forms to report lost or found items with detailed descriptions, 
                    categories, and photo uploads.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Smart Matching
                  </h3>
                  <p className="text-gray-700">
                    Intelligent algorithms that match lost items with found items based on 
                    descriptions, categories, and locations.
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">
                    Real-time Updates
                  </h3>
                  <p className="text-gray-700">
                    Get instant notifications when potential matches are found for your lost items.
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">
                    Analytics Dashboard
                  </h3>
                  <p className="text-gray-700">
                    Visual statistics and insights about lost and found items across campus.
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                How It Works
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Report an Item</h3>
                    <p className="text-gray-600">
                      Use our simple forms to report lost or found items with detailed descriptions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Smart Matching</h3>
                    <p className="text-gray-600">
                      Our system automatically searches for potential matches based on your item details.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Get Connected</h3>
                    <p className="text-gray-600">
                      When matches are found, we connect you with the person who found your item.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Reunite</h3>
                    <p className="text-gray-600">
                      Coordinate with the finder to safely recover your lost item.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Need Help?
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  If you have any questions or need assistance using the platform, please don't hesitate to contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong> support@lostfound.campus.edu
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> (555) 123-4567
                  </p>
                  <p className="text-gray-700">
                    <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </section>

            {/* Tech Stack */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Technology Stack
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Frontend</h3>
                  <p className="text-sm text-gray-600">React.js</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Styling</h3>
                  <p className="text-sm text-gray-600">Tailwind CSS</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Routing</h3>
                  <p className="text-sm text-gray-600">React Router</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Charts</h3>
                  <p className="text-sm text-gray-600">Chart.js</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
