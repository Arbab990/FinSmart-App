"use client";
import React, { useState } from "react";
import { FaBell, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const NotificationsAndReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const addReminder = () => {
    if (!title || !amount || !date) {
      alert("Please fill in all fields.");
      return;
    }

    const newReminder = {
      id: Date.now(),
      title,
      amount,
      date,
    };
    setReminders([...reminders, newReminder]);
    setTitle("");
    setAmount("");
    setDate("");
  };

  const removeReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        🕒 Notifications & Reminders
      </h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Add a Reminder</h3>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Reminder Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2"
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded p-2"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded p-2"
          />
          <button
            onClick={addReminder}
            className="bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 transition duration-300"
          >
            ➕ Add Reminder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="p-4 border rounded-lg shadow-md bg-white transition-transform duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold">{reminder.title} 🎉</h4>
              <button
                onClick={() => removeReminder(reminder.id)}
                className="text-red-500 hover:text-red-700"
              >
                ❌ Remove
              </button>
            </div>
            <p className="text-gray-600">Amount: ${reminder.amount} 💰</p>
            <p className="text-gray-600">Due Date: {reminder.date} 📅</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsAndReminders;

