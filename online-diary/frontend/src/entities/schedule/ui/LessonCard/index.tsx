import styles from "./styles.module.scss";

export const LessonCard = ({ event, top, height }: any) => (
  <div 
    className={`${styles.card} ${styles[event.type]}`} 
    style={{ top: `${top}px`, height: `${height}px` }}
  >
    <div className={styles.title}>{event.title}</div>
    <div className={styles.info}>{event.startTime} - {event.endTime}</div>
  </div>
);