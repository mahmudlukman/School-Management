import { format } from "date-fns";
import { useGetAllAnnouncementsQuery } from "../redux/features/announcement/announcementApi";
import type { Announcement } from "../@types";

const Announcements = () => {
  const { data: announcementsData } = useGetAllAnnouncementsQuery({
    isActive: true,
  });

  const recentAnnouncements =
    announcementsData?.announcements?.slice(0, 3) || [];

  const getBgColor = (index: number) => {
    const colors = [
      "bg-lamaSkyLight",
      "bg-lamaPurpleLight",
      "bg-lamaYellowLight",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white p-4 rounded-md card">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400 cursor-pointer">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {recentAnnouncements.length > 0 ? (
          recentAnnouncements.map((announcement: Announcement, index: number) => (
            <div
              key={announcement._id}
              className={`${getBgColor(index)} rounded-md p-4`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{announcement.title}</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                  {format(new Date(announcement.createdAt), "MMM-dd-yyyy")}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {announcement.content}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">
            No announcements
          </p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
