import React, { useEffect, useState } from 'react';
import { Upload, Users, Clock3, X, Eye } from 'lucide-react';

interface Participant {
  rollNumber: string;
  uploads: number;
}

function App() {
  const [rollNumber, setRollNumber] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [leaderboard, setLeaderboard] = useState<Participant[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('https://farewell-snap-contest-api.onrender.com/leaderboard');
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !selectedFiles?.length) return;

    const formData = new FormData();
    formData.append('rollNumber', rollNumber);
    Array.from(selectedFiles).forEach(file => formData.append('photos', file));

    try {
      setUploading(true);
      setUploadMessage('');
      const res = await fetch('https://farewell-snap-contest-api.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
      setUploadMessage('✅ Photos uploaded successfully!');
      setRollNumber('');
      setSelectedFiles(null);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setUploadMessage('❌ Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMessage(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="/aids.jpg"
            alt="AI & DS Department Farewell Group Photo"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
            <h1 className="text-5xl font-bold mb-2">Farewell 2k25</h1>
            <p className="text-2xl mb-4">Department of Artificial Intelligence and Data Science</p>
            <p className="text-lg opacity-90">
              Upload your best memories with juniors and stand a chance to win exciting prizes!
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
            <Users className="h-6 w-6" />
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-2">1. Enter Roll Number</h3>
              <p className="text-gray-600">Identify yourself with your college roll number</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-2">2. Upload Photos</h3>
              <p className="text-gray-600">Share your group photos with juniors</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-2">3. Win Prizes</h3>
              <p className="text-gray-600">The more you share, the better your chances!</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-purple-800 mb-6 flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Upload Photos
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rollNumber" className="block text-gray-700 font-medium mb-2">
                Roll Number
              </label>
              <input
                type="text"
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your roll number"
                required
              />
            </div>
            <div>
              <label htmlFor="photos" className="block text-gray-700 font-medium mb-2">
                Choose Photos
              </label>
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedFiles(e.target.files)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-purple-600 text-white py-3 px-6 rounded-lg transition duration-200 ${
                uploading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Submit Photos'}
            </button>

            {uploadMessage && (
              <p
                className={`text-center text-sm font-medium ${
                  uploadMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {uploadMessage}
              </p>
            )}
          </form>

          {/* Leaderboard Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              <Eye className="w-5 h-5" />
              View Live Leaderboard
            </button>
          </div>
        </div>

        {/* Contest Deadline */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center justify-center gap-2">
            <Clock3 className="h-6 w-6" />
            Contest Deadline
          </h2>
          <p className="text-lg text-gray-600">
            Submit your entries before{' '}
            <span className="font-semibold text-purple-800">April 17th, 2025</span>
          </p>
          <p className="text-gray-500 mt-2">Make your farewell unforgettable! ❤️</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Live Leaderboard</h2>
            <div className="space-y-3">
              {leaderboard.length > 0 ? (
                leaderboard
                  .sort((a, b) => b.uploads - a.uploads)
                  .map((participant, index) => (
                    <div
                      key={participant.rollNumber}
                      className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
                    >
                      <span className="font-bold text-purple-600">#{index + 1}</span>
                      <div className="flex-1 ml-3">
                        <p className="font-semibold">{participant.rollNumber}</p>
                        <p className="text-sm text-gray-500">{participant.uploads} uploads</p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">No participants yet!</p>
              )}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
