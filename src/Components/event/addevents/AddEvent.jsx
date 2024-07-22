import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddEvent.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function AddEvent() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState('');
  const navigate = useNavigate();
  //const[eventStatus, setEventStatus] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const userId = sessionStorage.getItem("userId");
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  const onSubmit = (data) => {
    const formattedDate = moment(data.date).format("YYYY-MM-DD");
    const formattedStartTime = moment(data.startTime, "HH:mm").format("HH:mm:ss");
    const formattedEndTime = moment(data.endTime, "HH:mm").format("HH:mm:ss");

    if (formattedStartTime >= formattedEndTime) {
      toast.error("Event start time must be before end time.");
      return;
    }

    const conflictingEvent = events.find(event => 
      event.eventsVenue === data.venue.toUpperCase() && 
      event.eventsDate === formattedDate && 
      (
        (formattedStartTime >= event.eventsStartTime && formattedStartTime < event.eventsEndTime) ||
        (formattedEndTime > event.eventsStartTime && formattedEndTime <= event.eventsEndTime) ||
        (formattedStartTime <= event.eventsStartTime && formattedEndTime >= event.eventsEndTime)
      )
    ); 

    if (conflictingEvent) {
      toast.error("For the same venue, time should be different.");
      return;
    }

    const event = {
      eventsTitle: data.title,
      eventsDescription: data.description,
      eventsDate: formattedDate,
      eventsStartTime: formattedStartTime,
      eventsEndTime: formattedEndTime,
      eventsLocation: data.location,
      eventsVenue: data.venue,
      eventsStatus: "planned",
      userId: userId,
    };

    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    toast.success("Event added successfully!");
    navigate("/showevents");
  };

  return (
    <div>
      <div className="add-event container mt-5">
        <div className="d-flex justify-content-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="add-event-form w-75"
          >
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Event Title
              </label>
              <input
                type="text"
                className="form-control custom-input"
                id="event-title"
                {...register("title", { required: "Event title is required" })}
              />
              {errors.title && (
                <span className="text-danger">{errors.title.message}</span>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Event Date
              </label>
              <input
                type="date"
                className="form-control custom-input"
                id="event-date"
                min={today}
                onChange={(e) => setDate(e.target.value)}
                {...register("date", { required: "Event date is required" })}
              />
              {errors.date && (
                <span className="text-danger">{errors.date.message}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="startTime" className="form-label">
                  Event Start Time
                </label>
                <input
                  type="time"
                  className="form-control custom-input"
                  id="event-start-time"
                  {...register("startTime", {
                    required: "Event start time is required",
                  })}
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="endTime" className="form-label">
                  Event End Time
                </label>
                <input
                  type="time"
                  className="form-control custom-input"
                  id="event-end-time"
                  {...register("endTime", {
                    required: "Event end time is required",
                  })}
                />
                {errors.endTime && (
                  <span className="text-danger">{errors.endTime.message}</span>
                )}
              </div>
            </div>
     
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="location" className="form-label">
                  Event Location
                </label>
                <input
                  type="text"
                  className="form-control custom-input"
                  id="event-location"
                  {...register("location", {
                    required: "Event location is required",
                  })}
                />
                {errors.location && (
                  <span className="text-danger">{errors.location.message}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="venue" className="form-label">
                  Event Venue
                </label>
                <input
                  type="text"
                  className="form-control custom-input"
                  id="event-venue"
                  {...register("venue", {
                    required: "Event venue is required",
                  })}
                />
                {errors.venue && (
                  <span className="text-danger">{errors.venue.message}</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Event Description
              </label>
              <textarea
                className="form-control custom-input"
                id="description"
                rows="3"
                {...register("description", {
                  required: "Event description is required",
                })}
              ></textarea>
              {errors.description && (
                <span className="text-danger">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="mb-3 text-center">
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
