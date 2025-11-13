import MoreDark from "../assets/images/moreDark.png";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useGetAllEventsQuery } from "../redux/features/event/eventApi";
import type { Event } from "../@types";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  const { data: eventsData } = useGetAllEventsQuery({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(
      new Date(new Date().setMonth(new Date().getMonth() + 1)),
      "yyyy-MM-dd"
    ),
  });

  // Get next 3 upcoming events
  const upcomingEvents = eventsData?.events?.slice(0, 3) || [];

  return (
    <div className="bg-white p-4 rounded-md card">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <img src={MoreDark} alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event: Event) => (
            <div
              className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
              key={event._id}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-gray-300 text-xs">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">
            No upcoming events
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
