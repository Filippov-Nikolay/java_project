import dayjs from "dayjs";
import { LESSON_TIMES } from "@entities/schedule/model/constants";
import { LessonCard } from "@entities/schedule/ui/LessonCard";
import styles from "@app/(main)/schedule/styles.module.scss";


export const WeekView = ({ hours, weekDays, events, now, indicatorPos }: any) => {

 const getPos = (lessonNumber: number) => {
  const time = LESSON_TIMES[lessonNumber] || LESSON_TIMES[1];
  const [_, sM] = time.start.split(':').map(Number);
  
  return { 
    top: (sM / 60) * 80, 

    height: (80 / 60) * 80 
  };
};

  return (
    <>
      {hours.map((hour: number) => (
        <div key={hour} className={styles.gridRow} id={`hour-${hour}`}>
          <div className={styles.timeLabel}>{hour}:00</div>
          {weekDays.map((day: dayjs.Dayjs) => (
            <div key={day.format()} className={styles.gridCell}>
              {events
                .filter((e: any) => {
                  const time = LESSON_TIMES[e.lessonNumber];
                  if (!time) return false;

                  const startHour = parseInt(time.start.split(':')[0]);
                  return e.date === day.format("YYYY-MM-DD") && startHour === hour;
                })
                .map((e: any) => {
                  const { top, height } = getPos(e.lessonNumber);
                  const eventData = {
                    ...e,
                    title: e.subjectName,
                    startTime: LESSON_TIMES[e.lessonNumber].start,
                    endTime: LESSON_TIMES[e.lessonNumber].end
                  };
                  return <LessonCard key={e.id} event={eventData} top={top} height={height} />;
                })}

              {day.isToday() && now.hour() === hour && (
                <div 
                  className={styles.timeIndicator} 
                  style={{ top: `${(now.minute() / 60) * 80}px` }}
                >
                  <div className={styles.timeBall} />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};