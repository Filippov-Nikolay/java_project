"use client";

import { useState } from "react";
import { Modal } from "@shared/ui/Modal";
import styles from "./styles.module.scss";

interface Props {
  subjects: string[];
  selected: string;
  onSelect: (val: string) => void;
}

export const SubjectPicker = ({ subjects, selected, onSelect }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredSubjects = subjects.filter(s => 
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <button className={styles.trigger} onClick={() => setIsOpen(true)}>
        <span>Предмет: <b>{selected === 'all' ? 'Всі' : selected}</b></span>
        <span className={styles.icon}>🔍</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Вибір предмета">
        <div className={styles.pickerBody}>
          <input 
            className={styles.searchInput}
            placeholder="Пошук предмета..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          
          <div className={styles.list}>
            <button 
              className={selected === 'all' ? styles.itemActive : styles.item}
              onClick={() => { onSelect('all'); setIsOpen(false); }}
            >
              Всі предмети
            </button>
            
            {filteredSubjects.map(s => (
              <button 
                key={s}
                className={selected === s ? styles.itemActive : styles.item}
                onClick={() => { onSelect(s); setIsOpen(false); }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};