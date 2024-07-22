import React, { useEffect, useState } from 'react';
import EventCard from './ShowEventCard';
import EventModal from '../eventsmodal/EventModal';
import './ShowEvents.css';

export default function ShowEvents({ searchQuery }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Initial fetch events from local storage or an empty array
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(storedEvents);
    setFilteredEvents(storedEvents);
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, events]);

  const filterEvents = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = events.filter(event =>
      event.eventsTitle.toLowerCase().includes(lowercasedQuery) ||
      event.eventsDescription.toLowerCase().includes(lowercasedQuery) ||
      event.eventsLocation.toLowerCase().includes(lowercasedQuery) ||
      event.eventsVenue.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredEvents(filtered);
  };

  const handleDelete = (eventId) => {
    const updatedEvents = events.filter(event => event.eventsId !== eventId);
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const handleUpdate = (eventId) => {
    const eventToUpdate = events.find(event => event.eventsId === eventId);
    setSelectedEvent(eventToUpdate);
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
  };

  const handleFormSubmit = (updatedEvent) => {
    const updatedEvents = events.map(event =>
      event.eventsId === updatedEvent.eventsId ? updatedEvent : event
    );
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setSelectedEvent(null);
  };

  return (
    <div className="show-events">
      <h2 className="title">Events</h2>
      <div className="events-list">
        {filteredEvents.map(event => (
          <EventCard
            key={event.eventsId}
            event={event}
            onDelete={() => handleDelete(event.eventsId)}
            onUpdate={() => handleUpdate(event.eventsId)}
          />
        ))}
      </div>
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={handleModalClose}
          onUpdate={handleFormSubmit}
        />
      )}
    </div>
  );
}
