import { Table } from "@shared/ui/Table";
import styles from "./styles.module.scss";

type DiaryRow = {
  id: number;
  title: string;
  category: string;
  updatedAt: string;
};

const columns = [
  { key: "title", title: "Запись", dataIndex: "title" },
  { key: "category", title: "Категория", dataIndex: "category" },
  { key: "updatedAt", title: "Обновлено", dataIndex: "updatedAt" },
];

const demoData: DiaryRow[] = [
  { id: 1, title: "Идеи для недельного отчета", category: "Работа", updatedAt: "05.07.2024" },
  { id: 2, title: "Планы на отпуск", category: "Личное", updatedAt: "01.07.2024" },
  { id: 3, title: "Список книг к прочтению", category: "Обучение", updatedAt: "28.06.2024" },
];

export const DashboardTable = () => {
  return (
    <section className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <h2>Предпросмотр таблицы записей</h2>
        <p>Базовый каркас для будущей работы с таблицами дневника.</p>
      </div>
      <Table caption="Записи" columns={columns} data={demoData} />
    </section>
  );
};
