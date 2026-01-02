import clsx from "clsx";
import { Homework } from "../../model/types";
import styles from "./styles.module.scss";

interface Props {
  data: Homework;
}

const getIcon = (subject: string) => {
  const s = subject.toLowerCase();
  if (s.includes('android')) return '🤖';
  if (s.includes('java')) return '☕';
  if (s.includes('бд') || s.includes('баз')) return '🗄️';
  return '📄'; 
};

export const HomeworkCard = ({ data }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconBox}>{getIcon(data.subjectName)}</div>
      <div className={styles.info}>
        <span className={styles.subjectName}>{data.subjectName}</span>
        <h3 className={styles.title}>{data.title}</h3>
        <div className={styles.footer}>
          <span className={styles.date}>{data.date}</span>
          <span className={clsx(styles.deadline, data.isOverdue && styles.overdue)}>
            {data.deadlineText}
          </span>
        </div>
      </div>
    </div>
  );
};