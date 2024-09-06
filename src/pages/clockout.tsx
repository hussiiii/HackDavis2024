import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/useAuth';
import { useRouter } from 'next/router';

const Clockout = () => {
  const user = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState<string[]>([]);
  const [items, setItems] = useState('');
  const [comments, setComments] = useState('');
  const [reachOut, setReachOut] = useState('');

  useEffect(() => {
    if (user) {
      fetch(`/api/getUserInfo?email=${user.email}`)
        .then(response => response.json())
        .then(data => {
          setUsername(data.username);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [user]);

  const handleTaskChange = (task: string) => {
    setTasksCompleted(prev =>
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clockOutData = {
      date: new Date(),
      volunteer: username || '',
      rating,
      comments,
      tasksCompleted: tasksCompleted.join(', '),
      items,
      reachOut,
    };

    try {
      const response = await fetch('/api/clockout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clockOutData),
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to submit clock-out data');
      }
    } catch (error) {
      console.error('Error submitting clock-out data:', error);
    }
  };

  return (
    <>
      <div className="p-8 max-w-4xl mx-auto">
        <NavBar />
        
        <div className="mt-8">
          <h1 className="text-4xl font-bold mb-4">Clock Out</h1>
          <p className="text-gray-600 mb-6">
            Please fill out the following form before leaving for the end of your shift!
          </p>

          {/* Form Start */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Rate this shift */}
            <div className="space-y-2">
              <label className="block text-lg font-medium">Rate this shift<span className="text-red-600">*</span></label>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="shift_rating" value="Great" className="mr-2" onChange={(e) => setRating(e.target.value)} />
                  Great, no problems
                </label>
                <label className="flex items-center">
                  <input type="radio" name="shift_rating" value="Neutral" className="mr-2" onChange={(e) => setRating(e.target.value)} />
                  Neither good nor bad
                </label>
                <label className="flex items-center">
                  <input type="radio" name="shift_rating" value="Bad" className="mr-2" onChange={(e) => setRating(e.target.value)} />
                  Not good, had some problems (elaborate below)
                </label>
                <label className="flex items-center">
                  <input type="radio" name="shift_rating" value="Other" className="mr-2" onChange={(e) => setRating(e.target.value)} />
                  Other (elaborate below)
                </label>
              </div>
            </div>

            {/* Tasks completed */}
            <div className="space-y-2">
              <label className="block text-lg font-medium">Tasks completed<span className="text-red-600">*</span></label>
              <div className="flex flex-col space-y-2">
                {['Cleaned Volunteer Bathroom', 'Cleaned Fridge', 'Took out the Trash (Landfill + Compost)', 
                  'Put Trash Cans on the Curb', 'Vacuumed Stairs/ Hallway', 'Laundry (Volunteer Sheets/Bedding)'].map(task => (
                    <label key={task} className="flex items-center">
                      <input type="checkbox" className="mr-2" onChange={() => handleTaskChange(task)} />
                      {task}
                    </label>
                  ))}
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" onChange={() => handleTaskChange('Other')} />
                  Other (elaborate below)     
                  </label>
              </div>
            </div>

            {/* Items to be purchased */}
            <div className="space-y-2">
              <label className="block text-lg font-medium">
                Items to be purchased (Cleaning products, Laundry Detergent, Office Supplies, etc.)
              </label>
              <p className="text-sm text-gray-600">
                Resident has a Food Request? Submit <a href="#" className="text-blue-500 underline">here</a>.
              </p>
              <input type="text" className="w-full border rounded-md px-3 py-2" placeholder="Your answer" value={items} onChange={(e) => setItems(e.target.value)} />
            </div>

            {/* Resident/Volunteer comments */}
            <div className="space-y-2">
              <label className="block text-lg font-medium">Resident/Volunteer comments, concerns, questions</label>
              <textarea className="w-full border rounded-md px-3 py-2" placeholder="Your answer" value={comments} onChange={(e) => setComments(e.target.value)}></textarea>
            </div>

            {/* Contact option */}
            <div className="space-y-2">
              <label className="block text-lg font-medium">
                Would you like us to reach out to you regarding any concerns you may have mentioned in this form?
              </label>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="contact" value="Yes" className="mr-2" onChange={(e) => setReachOut(e.target.value)} />
                  Yes
                </label>
                <label className="flex items-center">
                  <input type="radio" name="contact" value="No" className="mr-2" onChange={(e) => setReachOut(e.target.value)} />
                  No
                </label>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                className="w-1/4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-backy hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Complete Clock Out
              </button>
            </div>

          </form>
          {/* Form End */}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Clockout;