import React, { useState } from 'react';
import { Upload, Trophy, Users, Clock3 } from 'lucide-react';

interface Participant {
  rollNumber: string;
  uploads: number;
}

function App() {
  const [rollNumber, setRollNumber] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [leaderboard, setLeaderboard] = useState<Participant[]>([
    { rollNumber: '21CS101', uploads: 8 },
    { rollNumber: '21CS045', uploads: 6 },
    { rollNumber: '21CS078', uploads: 5 },
  ]);

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !selectedFiles?.length) return;

    const formData = new FormData();
    formData.append('rollNumber', rollNumber);
    Array.from(selectedFiles).forEach(file => formData.append('photos', file));

    try {
      setUploading(true);
      setUploadMessage('');

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photos');
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard);

      setUploadMessage('✅ Photos uploaded successfully!');
      setRollNumber('');
      setSelectedFiles(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setUploadMessage('❌ Error uploading photos. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMessage(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="aids.jpg"
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

        {/* Upload & Leaderboard Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
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

              {/* Upload Message */}
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
          </div>

          {/* Leaderboard Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-purple-800 mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Live Leaderboard
            </h2>
            <div className="space-y-4">
              {[...leaderboard].sort((a, b) => b.uploads - a.uploads).map((participant, index) => (
                <div
                  key={participant.rollNumber}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                    <div>
                      <p className="font-semibold">{participant.rollNumber}</p>
                      <p className="text-sm text-gray-500">{participant.uploads} uploads</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="bg-yellow-400 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      Leading
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contest Deadline */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center justify-center gap-2">
            <Clock3 className="h-6 w-6" />
            Contest Deadline
          </h2>
          <p className="text-lg text-gray-600">
            Submit your entries before <span className="font-semibold text-purple-800">April 17th, 2025</span>
          </p>
          <p className="text-gray-500 mt-2">Make your farewell unforgettable! ❤️</p>
        </div>
      </div>
    </div>
  );
}

export default App;
