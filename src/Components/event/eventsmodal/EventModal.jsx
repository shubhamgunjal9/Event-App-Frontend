import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EventModal.css';
import moment from 'moment';

export default function EventModal({ event, onClose, onUpdate }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (event) {
      setValue("eventsId", event.eventsId);
      setValue("eventsTitle", event.eventsTitle);
      setValue("eventsDescription", event.eventsDescription);
      setValue("eventsDate", event.eventsDate);
      setValue("eventsStartTime", event.eventsStartTime);
      setValue("eventsEndTime", event.eventsEndTime);
      setValue("eventsLocation", event.eventsLocation);
      setValue("eventsVenue", event.eventsVenue);
    }
  }, [event, setValue]);

  const onSubmit = (data) => {
    const formattedDate = moment(data.eventsDate).format("YYYY-MM-DD");
    const formattedStartTime = moment(data.eventsStartTime, "HH:mm").format("HH:mm:ss");
    const formattedEndTime = moment(data.eventsEndTime, "HH:mm").format("HH:mm:ss");

    if (formattedStartTime >= formattedEndTime && !moment(formattedEndTime, "HH:mm:ss").isSame(moment("00:00:00", "HH:mm:ss"))) {
      toast.error("Event start time must be before end time, or the event must span across midnight.");
      return;
    }

    const updatedEvent = {
      eventsId: data.eventsId,
      eventsTitle: data.eventsTitle,
      eventsDescription: data.eventsDescription,
      eventsDate: formattedDate,
      eventsStartTime: formattedStartTime,
      eventsEndTime: formattedEndTime,
      eventsLocation: data.eventsLocation,
      eventsVenue: data.eventsVenue,
    };

    onUpdate(updatedEvent);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Event</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              name="eventsTitle" 
              {...register("eventsTitle", { required: "Event title is required" })}
              required 
            />
            {errors.eventsTitle && (
              <span className="text-danger">{errors.eventsTitle.message}</span>
            )}
          </div>
          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              name="eventsDescription" 
              {...register("eventsDescription", { required: "Event description is required" })}
              required 
            />
            {errors.eventsDescription && (
              <span className="text-danger">{errors.eventsDescription.message}</span>
            )}
          </div>
          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="eventsDate" 
              {...register("eventsDate", { required: "Event date is required" })}
              required 
            />
            {errors.eventsDate && (
              <span className="text-danger">{errors.eventsDate.message}</span>
            )}
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input 
              type="time" 
              name="eventsStartTime" 
              {...register("eventsStartTime", { required: "Event start time is required" })}
              required 
            />
            {errors.eventsStartTime && (
              <span className="text-danger">{errors.eventsStartTime.message}</span>
            )}
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input 
              type="time" 
              name="eventsEndTime" 
              {...register("eventsEndTime", { required: "Event end time is required" })}
              required 
            />
            {errors.eventsEndTime && (
              <span className="text-danger">{errors.eventsEndTime.message}</span>
            )}
          </div>
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              name="eventsLocation" 
              {...register("eventsLocation", { required: "Event location is required" })}
              required 
            />
            {errors.eventsLocation && (
              <span className="text-danger">{errors.eventsLocation.message}</span>
            )}
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input 
              type="text" 
              name="eventsVenue" 
              {...register("eventsVenue", { required: "Event venue is required" })}
              required 
            />
            {errors.eventsVenue && (
              <span className="text-danger">{errors.eventsVenue.message}</span>
            )}
          </div>
          <input type="hidden" name="eventsId" {...register("eventsId")} />
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}
