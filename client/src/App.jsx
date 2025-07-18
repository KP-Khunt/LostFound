import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LostForm from './pages/LostForm';
import FoundForm from './pages/FoundForm';
import MatchList from './pages/MatchList';
import History from './pages/History';
import Graph from './pages/Graph';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lost-form" element={<LostForm />} />
            <Route path="/found-form" element={<FoundForm />} />
            <Route path="/matches" element={<MatchList />} />
            <Route path="/history" element={<History />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            {/* 404 Page */}
            <Route path="*" element={
              <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Page not found</p>
                  <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
