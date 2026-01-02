import { HomeworkCard, Homework } from "@entities/homework";
import styles from "./styles.module.scss";

interface Props {
  items: Homework[];
}

export const HomeworkList = ({ items }: Props) => {
  if (items.length === 0) {
    return <div className={styles.empty}>У цьому розділі поки немає завдань ✨</div>;
  }

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.month]) acc[item.month] = [];
    acc[item.month].push(item);
    return acc;
  }, {} as Record<string, Homework[]>);

  return (
    <div className={styles.container}>
      {Object.entries(grouped).map(([month, tasks]) => (
        <section key={month} className={styles.section}>
          <h2 className={styles.monthTitle}>{month}</h2>
          <div className={styles.grid}>
            {tasks.map(task => <HomeworkCard key={task.id} data={task} />)}
          </div>
        </section>
      ))}
    </div>
  );
};