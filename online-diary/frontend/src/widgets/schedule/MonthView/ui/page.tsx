import dayjs from "dayjs";
import { LESSON_TIMES } from "@entities/schedule/model/constants";
import styles from "./styles.module.scss";

export const MonthView = ({ monthDays, currentDate, events }: any) => (
  <div className={styles.monthGrid}>
    {monthDays.map((day: dayjs.Dayjs) => (
      <div key={day.format()} className={`${styles.monthCell} ${day.month() !== currentDate.month() ? styles.otherMonth : ""}`}>
        <span className={`${styles.monthDate} ${day.isToday() ? styles.activeDate : ""}`}>{day.date()}</span>
        <div className={styles.monthEventList}>
          {events.filter((e: any) => e.date === day.format("YYYY-MM-DD"))
            .sort((a: any, b: any) => a.lessonNumber - b.lessonNumber)
            .map((e: any) => (
              <div key={e.id} className={`${styles.monthEventBadge} ${styles[e.type?.toLowerCase() || 'lecture']}`}>
                <span className={styles.eventTime}>{LESSON_TIMES[e.lessonNumber as keyof typeof LESSON_TIMES]?.start}</span> {e.subjectName}
              </div>
            ))}
        </div>
      </div>
    ))}
  </div>
);